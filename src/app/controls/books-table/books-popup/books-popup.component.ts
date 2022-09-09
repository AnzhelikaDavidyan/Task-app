import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { noop, Observable, of, switchMap } from 'rxjs';
import { AuthorModel } from '../../authors-table/model/author.model';
import { AuthorService } from '../../authors-table/service/author.service';
import { GenreModel } from '../../genres-table/model/genre.model';
import { GenreService } from '../../genres-table/service/genre.service';
import { BookModel } from '../model/book.model';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-books-popup',
  templateUrl: './books-popup.component.html',
  styleUrls: ['./books-popup.component.css']
})
export class BooksPopupComponent implements OnInit {

  public bookDetailForm!: FormGroup;
  public genres$: Observable<GenreModel[]> = of([]);
  public filteredAuthors$: Observable<AuthorModel[]> = of([]);

  constructor(private formBuilder: FormBuilder,
    private genreService: GenreService,
    private authorService: AuthorService,
    private bookService: BookService) {

    this.bookDetailForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      publishedYear: new FormControl('', Validators.maxLength(4)),
      genreId: new FormControl('', Validators.required),
      authorId: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.genres$ = this.genreService.getGenres() as Observable<GenreModel[]>;
    this.bookDetailForm.valueChanges.subscribe(changes => {
      this.filteredAuthors$ = this.authorService.getAuthorByGenreId(changes.genreId.id);
    })

  }

  public onSave(): void {
    if (this.bookDetailForm.valid) {
      this.bookService.getLastId().pipe(
        switchMap((id: number) => {
          const form = this.bookDetailForm.value;
          const book = new BookModel(++id, form.title, form.genreId.id, 2022, form.authorId.id)
          return this.bookService.saveBook(book);
        })
      ).subscribe(noop, console.error)
    }
  }

}
