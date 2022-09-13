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
import {MaterialModule} from './material.module';
import {DeletePopupComponent} from "./controls/shared/delete-popup/delete-popup.component";
import {ReadClassifierPipe} from "./controls/shared/pipe/read-classifier.pipe";
import {TableComponent} from "./controls/shared/table/table.component";

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
        DeletePopupComponent,
        ReadClassifierPipe,
        TableComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
