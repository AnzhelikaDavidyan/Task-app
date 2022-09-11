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

    @ViewChild(MatPaginator) paginator!: MatPaginator | null;
    @ViewChild(MatSort) sort!: MatSort | null;
    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(
        private crudService: CrudService,
        private dataCommunicationService: DataCommunicationService,
        public dialog: MatDialog) {

        this.getLists()
            .subscribe(data => {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }

    private getLists(): Observable<BookModel[]> {
        return zip(this.crudService.getList(BOOKS_URL),
            this.crudService.getList(GENRES_URL),
            this.crudService.getList(AUTHORS_URL))
            .pipe(
                map(([books, genres, authors]: [any, any, any]) => {
                    const models: BookModel[] = [];
                    books.forEach((item: BookModel) => {
                        item.genreId = genres.find((genre: GenreModel) => genre.id === item.genreId);
                        item.authorId = authors.find((author: AuthorModel) => author.id === item.authorId);
                        models.push(new BookModel(item.id, item.title, item.genreId, item.publishedYear, item.authorId))
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
            },
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public editBook(event: MouseEvent, model: BookModel) {
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
