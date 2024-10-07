
import { NgModule } from '@angular/core';
import { Route, RouterLink, RouterModule } from '@angular/router';
import { TransactionsComponent } from './transactions.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { QuillEditorComponent } from 'ngx-quill';
import { TransactionsFormComponent } from './transactions-form/transactions-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CurrencyMaskModule } from 'ng2-currency-mask';



const exampleRoutes: Route[] = [
    {
        path     : '',
        component: TransactionsComponent
    }
];

@NgModule({
    declarations: [
      TransactionsComponent,
      TransactionsFormComponent,
    ],
    imports     : [
        RouterModule.forChild(exampleRoutes),
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatTableModule,
        MatIconModule,
        MatGridListModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatMenuModule,
        MatButtonModule,
        MatSnackBarModule,
        CommonModule,
        RouterLink,
        QuillEditorComponent,
        MatPseudoCheckboxModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule ,
        MatNativeDateModule,
        CurrencyMaskModule
    ]
})
export class TransactionsModule
{
}

