import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './controls/header/header.component';
import { BooksTableComponent } from './controls/books-table/books-table.component';
import { MaterialModule } from './material.module';
import { GenresTableComponent } from './controls/genres-table/genres-table.component';
import { AuthorsTableComponent } from './controls/authors-table/authors-table.component';
import { AuthorsModule } from './controls/authors-table/authors.module';
import { GenresModule } from './controls/genres-table/genres.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BooksTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    AuthorsModule,
    GenresModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
