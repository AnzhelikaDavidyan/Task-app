import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
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
  public displayedColumns: string[] = ['id', 'title'];
  public isReady: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private bookService: BookService,
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

  
  public ngOnDestroy(): void {
    this.destroy$.next(0);
    this.destroy$.complete();
  }

}
