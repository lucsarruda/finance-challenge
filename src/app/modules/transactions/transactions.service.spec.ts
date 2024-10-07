import { TestBed } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionsService],
    });
    service = TestBed.inject(TransactionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of transactions', (done) => {
    const mockTransactions = [{ id: 1, name: 'Transaction 1' }, { id: 2, name: 'Transaction 2' }];
    service.transactions$.subscribe((transactions) => {
      expect(transactions).toEqual(mockTransactions);
      done();
    });
    service['._transactions'].next(mockTransactions);
  });

  it('should fetch all transactions from the API', () => {
    const mockTransactions = [{ id: 1, name: 'Transaction 1' }, { id: 2, name: 'Transaction 2' }];

    service.getAll().subscribe((transactions) => {
      expect(transactions.length).toBe(2);
      expect(transactions).toEqual(mockTransactions);
    });

    const req = httpMock.expectOne('api/transactions');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransactions);
  });

  it('should fetch a transaction by ID', () => {
    const mockTransaction = { id: 1, name: 'Transaction 1' };

    service.getId(1).subscribe((transaction) => {
      expect(transaction).toEqual(mockTransaction);
    });

    const req = httpMock.expectOne('api/transactions/id');
    expect(req.request.method).toBe('GET');
    req.flush(mockTransaction);
  });
});
