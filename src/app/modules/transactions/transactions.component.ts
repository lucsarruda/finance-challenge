import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { TransactionsService } from './transactions.service';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TransactionsFormComponent } from './transactions-form/transactions-form.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: any[] = []; 

  displayedColumns: string[] = [ 'date', 'type' , 'description' , 'amount' , 'actions' ];
  dataSource = new MatTableDataSource<any>([]);

  searchInputControl: UntypedFormControl = new UntypedFormControl();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  dataCount: number = 0;

  result_entradas = 0
  result_saidas = 0 
  result_total = 0

  dollarRate: number | null = 0
  euroRate: number | null = 0
  btcRate: number | null = 0

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _transactionsService: TransactionsService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this._transactionsService.getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((transactions: any[]) => {

               transactions.sort(function(a,b) {
                    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
                });

                this.dataCount = transactions.length
                this.dataSource =  new MatTableDataSource<any>(transactions);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this._changeDetectorRef.markForCheck();
                
            });
    
    this._transactionsService.results().subscribe({
              next: (result: any) => {
                  this.result_entradas = result.entradas
                  this.result_saidas = result.saidas
                  this.result_total = result.total
                  this._changeDetectorRef.markForCheck();
              }
            })

    this._transactionsService.getDollarToBRLRate().subscribe(
              (data) => {
                this.dollarRate = data.USDBRL.ask;
                this.euroRate = data.EURBRL.ask;
                this.btcRate = data.BTCBRL.ask;
                this._changeDetectorRef.markForCheck();
              },
              (error) => {
                console.error(error);
              }
            );
         
  }

  applyFilter(filterValue: string) {
    
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addApp(){
    //this._router.navigate(['./new'], {relativeTo: this._activatedRoute});
    const dialogRef = this._matDialog.open(TransactionsFormComponent ,  { data: { isNew : true   }  } );

    dialogRef.afterClosed()
        .subscribe((result) =>
        {
          this.ngOnInit()
        });
  }

  editSelected(id){
    const dialogRef = this._matDialog.open(TransactionsFormComponent , { data: { isNew : false , id :id }  });

    dialogRef.afterClosed()
        .subscribe((result) =>
        {
          this.ngOnInit()
        });
  }

  deleteSelected(idApp){

    const confirmation = this._fuseConfirmationService.open({
        title  : 'Excluir Movimentação',
        message: 'Deseja excluir movimentação?',
        actions: {
            confirm: {
                label: 'Excluir',
            },
        },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) =>
    {
        // If the confirm button pressed...
        if ( result === 'confirmed' )
        {
          this._transactionsService.delete( idApp).subscribe({
            next: (apps: any) => {
                this.ngOnInit()
                this._changeDetectorRef.markForCheck();
            }
        })
        }
    });

    
  }

}
