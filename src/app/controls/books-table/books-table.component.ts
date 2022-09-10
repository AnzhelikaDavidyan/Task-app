import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {map, Observable, of, Subject, takeUntil, zip} from 'rxjs';
import {DeletePopupComponent} from '../shared/delete-popup/delete-popup.component';
import {BooksPopupComponent} from './books-popup/books-popup.component';
import {BookModel} from './model/book.model';
import {CrudService} from "../services/crud.service";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {DataCommunicationService} from "../services/data-communication.service";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "../authors-table/model/author.model";

@Component({
    selector: 'app-books-table',
    templateUrl: './books-table.component.html',
    styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

    private destroy$ = new Subject();
    public dataSource: MatTableDataSource<BookModel> = new MatTableDataSource();
    public displayedColumns: string[] = ['id', 'title', 'actions'];
    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(
        private crudService: CrudService,
        private dataCommunicationService: DataCommunicationService,
        public dialog: MatDialog) {

        this.getBooks()
            .subscribe(data => {
                this.dataSource = new MatTableDataSource(data);
            });
    }

    private getBooks(): Observable<BookModel[]> {
        return this.crudService.getList(BOOKS_URL)
            .pipe(
                map((list: any[]) => {
                    const books: BookModel[] = [];
                    list.forEach((item) => {
                        books.push(new BookModel(item.id, item.title, item.genreId, item.publishedYear, item.authorId))
                    });
                    return books;
                }),
                takeUntil(this.destroy$)
            );
    }

    ngOnInit(): void {
        this.dataCommunicationService.getNotifier().subscribe({
            next: () => {
                this.table.renderRows();
            }
        })
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    public addBook() {
        const dialogRef = this.dialog.open(BooksPopupComponent, {
            data: {
                table: this.table,
                isNew: true,
                data: null,
                title: 'Add Book'
            }
        });
    }

    public editBook(event: MouseEvent, model: BookModel) {
        const genre$ = this.crudService.getItemById(GENRES_URL, 'id', +model.genreId);
        const author$ = this.crudService.getItemById(AUTHORS_URL, 'id', +model.authorId);
        const model$ = zip(genre$, author$).pipe(
            map(([genre, author]: [GenreModel[], AuthorModel[]]) => {
                model.genreId = genre[0];
                model.authorId = author[0];
                return model;
            })
        ).subscribe({
            next: (model: BookModel) => {
                const dialogRef = this.dialog.open(BooksPopupComponent, {
                    data: {
                        model,
                        list: this.dataSource.data,
                        table: this.table,
                        title: 'Edit Book'
                    },
                    disableClose: true,
                    autoFocus: false,
                    width: '400px',
                    height: 'auto'
                });
            }
        });

    }

    public deleteBook(book: BookModel) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                item: book
            }
        });
        dialogRef.afterClosed().subscribe(status => {
            if (status) {
                this.removeAction(book).subscribe({
                    next: () => {
                        this.table.renderRows();
                    }
                });
            }
        });
    }

    private removeAction(book: BookModel): Observable<boolean> {
        const data = this.dataSource.data;
        const index = data.indexOf(book);
        if (index > -1) {
            this.dataSource.data.splice(index, 1);
            return this.crudService.removeItem(BOOKS_URL, book).pipe(
                map(() => true)
            );
        }
        return of(false);
    }

    public ngOnDestroy(): void {
        this.destroy$.next(0);
        this.destroy$.complete();
    }

}
