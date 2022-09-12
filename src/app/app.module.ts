import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BookPopupComponent} from './controls/books-table/book-popup/book-popup.component';
import {BooksTableComponent} from './controls/books-table/books-table.component';
import {HeaderComponent} from './controls/header/header.component';
import {SharedModule} from './controls/shared/shared.module';
import {MaterialModule} from './material.module';
import {MatSortModule} from "@angular/material/sort";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        BooksTableComponent,
        BookPopupComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        MatSortModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
