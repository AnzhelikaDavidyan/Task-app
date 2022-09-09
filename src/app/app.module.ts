import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksPopupComponent } from './controls/books-table/books-popup/books-popup.component';
import { BooksTableComponent } from './controls/books-table/books-table.component';
import { HeaderComponent } from './controls/header/header.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BooksTableComponent,
    BooksPopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  entryComponents: [BooksPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
