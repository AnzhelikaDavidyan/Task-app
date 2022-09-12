import {Component, OnInit} from '@angular/core';
import {map, Observable, of, Subject, takeUntil} from "rxjs";
import {ColumnModel} from "../shared/table/table.component";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "./model/author.model";
import {createColumnModels, PopupInfo} from "../shared/util/table.util";
import {CrudService} from "../services/crud.service";
import {DataCommunicationModel, DataCommunicationService} from "../services/data-communication.service";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL} from "../util/url";
import {DeletePopupComponent} from "../shared/delete-popup/delete-popup.component";
import {AuthorPopupComponent} from "./author-popup/author-popup.component";

@Component({
    selector: 'app-authors-table',
    templateUrl: './authors-table.component.html',
    styleUrls: ['./authors-table.component.css']
})
export class AuthorsTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'firstName', 'lastName', 'genreId', 'actions'];
    public columns: ColumnModel[] = [];
    public list: AuthorModel [] = [];

    constructor(private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.columns = createColumnModels(this.displayedColumns);
        this.getAuthors()
            .subscribe(authors => {
                this.list = authors;
            });
    }

    private getAuthors(): Observable<AuthorModel[]> {
        return this.crudService.getList(AUTHORS_URL)
            .pipe(
                map((list: any[]) => {
                    const genres: AuthorModel[] = [];
                    list.forEach((item) => {
                        genres.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                    });
                    return genres;
                }),
                takeUntil(this.destroy$)
            );
    }

    public add() {
        this.dialog.open(AuthorPopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Genre'
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public delete(model: AuthorModel) {
        const dialogRef = this.dialog.open(DeletePopupComponent);
        dialogRef.afterClosed().subscribe(status => {
            if (status) {
                this.removeAction(model).subscribe({
                    next: () => {
                        this.dataCommunicationService.notify({isDeleted: true} as DataCommunicationModel)
                    }
                });
            }
        });
    }

    public edit([event, model]: [MouseEvent, GenreModel]) {
        this.dialog.open(AuthorPopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Genre',
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    private removeAction(model: AuthorModel): Observable<boolean> {
        const data = this.list;
        const index = data.indexOf(model);
        if (index > -1) {
            this.list.splice(index, 1);
            return this.crudService.removeItem(AUTHORS_URL, model).pipe(
                map(() => true)
            );
        }
        return of(false);
    }
}
