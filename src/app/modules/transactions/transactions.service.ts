


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransactionsService
{
    private _transactions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    private apiUrl = 'https://economia.awesomeapi.com.br';

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for transactions
     */
    get transactions$(): Observable<any[]>
    {
        return this._transactions.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all messages
     */
    getAll(): Observable<any[]>
    {
        return this._httpClient.get<any[]>('api/transactions').pipe(
            tap((transactions) => {
                this._transactions.next(transactions);
            })
        );
    }

    getId( id ): Observable<any>
    {
        return this._httpClient.get<any>('api/transactions/id' ,  { params : { id : id  } }) ;
    }

    results(): Observable<any>
    {
        return this._httpClient.get<any>('api/transactions/results' ,  ) ;
    }

    /**
     * Create a transaction
     *
     * @param transaction
     */
    create(transaction: any): Observable<any>
    {
        return this.transactions$.pipe(
            take(1),
            switchMap(transactions => this._httpClient.post<any>('api/transactions', {transaction}).pipe(
                map((newany) => {

                    // Update the transactions with the new transaction
                    this._transactions.next([...transactions, newany]);

                    // Return the new transaction from observable
                    return newany;
                })
            ))
        );
    }

    /**
     * Update the transaction
     *
     * @param id
     * @param transaction
     */
    update(id: string, transaction: any): Observable<any>
    {
        return this.transactions$.pipe(
            take(1),
            switchMap(transactions => this._httpClient.patch<any>('api/transactions', {
                id,
                transaction
            }).pipe(
                map((updatedany: any) => {

                    // Find the index of the updated transaction
                    const index = transactions.findIndex(item => item.id === id);

                    // Update the transaction
                    transactions[index] = updatedany;

                    // Update the transactions
                    this._transactions.next(transactions);

                    // Return the updated transaction
                    return updatedany;
                })
            ))
        );
    }

    /**
     * Delete the transaction
     *
     * @param id
     */
    delete(id: string): Observable<boolean>
    {
        return this.transactions$.pipe(
            take(1),
            switchMap(transactions => this._httpClient.delete<boolean>('api/transactions', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted transaction
                    const index = transactions.findIndex(item => item.id === id);

                    // Delete the transaction
                    transactions.splice(index, 1);

                    // Update the transactions
                    this._transactions.next(transactions);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    getDollarToBRLRate(): Observable<any> {
        const url = `${this.apiUrl}/json/last/USD-BRL,EUR-BRL,BTC-BRL`;
        return this._httpClient.get(url);
     }
}
