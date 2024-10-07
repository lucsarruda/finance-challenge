import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { transactions as transactionsData } from 'app/mock-api/transactions/data';

@Injectable({
    providedIn: 'root'
})
export class transactionsMockApi
{
    private _transactions: any = transactionsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ transactions - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/transactions')
            .reply(() => [200, cloneDeep(this._transactions)]);

        // -----------------------------------------------------------------------------------------------------
        // @ transactions - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/transactions')
            .reply(({request}) => {

                // Get the transaction
                const newShortcut = cloneDeep(request.body.transaction);

                // Generate a new GUID
                newShortcut.id = FuseMockApiUtils.guid();

                // Unshift the new transaction
                this._transactions.unshift(newShortcut);

                // Return the response
                return [200, newShortcut];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ transactions - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/transactions')
            .reply(({request}) => {

                // Get the id and transaction
                const id = request.body.id;
                const transaction = cloneDeep(request.body.transaction);

                // Prepare the updated transaction
                let updatedShortcut = null;

                // Find the transaction and update it
                this._transactions.forEach((item: any, index: number, transactions: any[]) => {

                    if ( item.id === id )
                    {
                        // Update the transaction
                        transactions[index] = assign({}, transactions[index], transaction);

                        // Store the updated transaction
                        updatedShortcut = transactions[index];
                    }
                });

                // Return the response
                return [200, updatedShortcut];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ transactions - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/transactions')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Prepare the deleted transaction
                let deletedShortcut = null;

                // Find the transaction
                const index = this._transactions.findIndex((item: any) => item.id === id);

                // Store the deleted transaction
                deletedShortcut = cloneDeep(this._transactions[index]);

                // Delete the transaction
                this._transactions.splice(index, 1);

                // Return the response
                return [200, deletedShortcut];
            });

        this._fuseMockApiService
            .onGet('api/transactions/id', 300)
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the users
                const transactions = cloneDeep(this._transactions);

                // Find the user
                const transaction = transactions.find(item => item.id === id);

                // Return the response
                return [200, transaction ];

            });

           this._fuseMockApiService
            .onGet('api/transactions/results', 300)
            .reply(({request}) => {

                // Clone the users
                const transactions = cloneDeep(this._transactions);

                let contEntrada = 0
                let contSaida = 0
                for (let index = 0; index < transactions.length; index++) {
                    if(transactions[index].type === 'entrada'){
                        contEntrada += transactions[index].amount
                    }else{
                        contSaida += transactions[index].amount
                    }
                }

                const result = {
                    entradas : contEntrada,
                    saidas : contSaida,
                    total: (contEntrada - contSaida)
                }

                // Return the response
                return [200, result ];

            });

    }
}
