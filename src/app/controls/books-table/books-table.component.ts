import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { map, noop, Observable, Subject, takeUntil } from 'rxjs';
import { DeletePopupComponent } from '../shared/delete-popup/delete-popup.component';
import { BooksPopupComponent } from './books-popup/books-popup.component';
import { BookModel } from './model/book.model';
import { BookService } from './service/book.service';

@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

  private destroy$ = new Subject();

  public dataSource: MatTableDataSource<BookModel> = new MatTableDataSource();
  public displayedColumns: string[] = ['id', 'title', 'actions'];
  public isReady: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  @ViewChild(MatTable)
  table!: MatTable<any>;

  constructor(
    private bookService: BookService,
    public dialog: MatDialog) {

    this.bookService.getBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.isReady = true;
        this.dataSource = new MatTableDataSource(data);
      });
  }

  ngOnInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public addBook() {
    const dialogRef = this.dialog.open(BooksPopupComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public editBook(value: any, row: any) {
    console.log(value);
  }

  public deleteBook(book: BookModel) {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      data: {
        item: book
      }
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        this.removeAction(book).subscribe(() => {
          this.table.renderRows();
        }, console.error);
      }
    });
  }

  private removeAction(book: BookModel): Observable<boolean> {
    const data = this.dataSource.data;
    const index = data.indexOf(book);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      return this.bookService.removeBook(book).pipe(
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

function of(arg0: boolean): Observable<boolean> {
  throw new Error('Function not implemented.');
}

