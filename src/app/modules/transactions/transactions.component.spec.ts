import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { TransactionsService } from './transactions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let mockTransactionsService: jasmine.SpyObj<TransactionsService>;

  beforeEach(async () => {
    mockTransactionsService = jasmine.createSpyObj('TransactionsService', ['getAll']);

    await TestBed.configureTestingModule({
      declarations: [TransactionsComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty transactions', () => {
    expect(component.transactions.length).toBe(0);
  });

  it('should fetch and load transactions on init', () => {
    const mockTransactions = [{ id: 1, name: 'Transaction 1' }, { id: 2, name: 'Transaction 2' }];
    mockTransactionsService.getAll.and.returnValue(of(mockTransactions));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.transactions.length).toBe(2);
    expect(component.dataSource.data).toEqual(mockTransactions);
  });


  it('should apply search filter', () => {
    const mockTransactions = [{ id: 1, description: 'Transaction 1' }, { id: 2, description: 'Another Transaction' }];
    component.dataSource.data = mockTransactions;

    component.applyFilter('Another');
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].description).toContain('Another');
  });

});
