import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TransactionsService } from '../transactions.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styleUrls: ['./transactions-form.component.scss']
})
export class TransactionsFormComponent implements OnInit {

  Form: UntypedFormGroup;

  title : string
  isnew : boolean
  user 

  /**
   * Constructor
   */
  constructor(
      public matDialogRef: MatDialogRef<any>,
      private _formBuilder: UntypedFormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _activatedRoute : ActivatedRoute , 
      private _transactionsService : TransactionsService ,
  )
  {
  }

  ngOnInit(): void {
    this.isnew = this.data.isNew

    if ( this.isnew) 
      this.title = "Nova Movimentação"
    
    if ( !this.isnew) 
      this.title = "Editar Movimentação"

    // Create the form
    this.Form = this._formBuilder.group({
        description            : ['', [Validators.required]],
        type               : ['entrada', [Validators.required]],
        amount            : ['', [Validators.required]],
        date            : ['', [Validators.required]],
    });

    
    if ( !this.isnew){
      this._transactionsService.getId( this.data.id ).subscribe({
        next: (transaction: any) => {
            //this.Form.get('app_name').setValue(app.app_name)
            this.Form.get('description').setValue(transaction.description)
            this.Form.get('type').setValue(transaction.type)
            this.Form.get('amount').setValue(transaction.amount)
            this.Form.get('date').setValue(transaction.date)
            
        }
      })
    }
    

  }

    /**
   * Discard the message
   */
  discard(): void
  {
    this.matDialogRef.close();
  }

  salve(): void
  {   

    if(this.isnew){
      
      let app = this.Form.value

      if(typeof(app.date) !== 'string' ){
        app.date = app.date.toISOString()
      }

      this._transactionsService.create( app ).subscribe({
          next: (apps: any) => {
              //this.appsUserLogado = apps
              this.matDialogRef.close();
          }
      })

    }else{

      let app = this.Form.value
      
      if(typeof(app.date) !== 'string' ){
        app.date = app.date.toISOString()
      }
      

      this._transactionsService.update( this.data.id ,app ).subscribe({
          next: (apps: any) => {
              //this.appsUserLogado = apps
              this.matDialogRef.close();
          }
      })
      

    }

  
    
  }
   
  

}
