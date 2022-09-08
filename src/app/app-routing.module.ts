import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksTableComponent } from './controls/books-table/books-table.component';

const routes: Routes = [
  {
    path: 'books',
    component: BooksTableComponent,
    title: 'Books'
  },
  {
    path: 'authors',
    title: 'Authors',
    loadChildren: () => import('./controls/authors-table/authors.module').then(m => m.AuthorsModule)
  },
  {
    path: 'genres',
    title: 'Genres',
    loadChildren: () => import('./controls/genres-table/genres.module').then(m => m.GenresModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
