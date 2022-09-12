import {Component, OnInit, ViewChild} from '@angular/core';
import {map, mergeMap, Observable, of, Subject, switchMap, takeUntil, zip} from "rxjs";
import {MatTable} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {CrudService} from "../services/crud.service";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {ColumnModel, PopupInfo} from "../shared/util/table.util";
import {DeletePopupComponent} from "../shared/delete-popup/delete-popup.component";
import {DataCommunicationModel, DataCommunicationService} from "../services/data-communication.service";
import {GenrePopupComponent} from "./genre-popup/genre-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";

@Component({
    selector: 'app-genres-table',
    templateUrl: './genres-table.component.html',
    styleUrls: ['./genres-table.component.css']
})
export class GenresTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'name', 'actions'];
    public columns: ColumnModel[] = [
        new ColumnModel('id', TypeEnum.NUMBER, 'ID'),
        new ColumnModel('name', TypeEnum.STRING, 'Name'),
        new ColumnModel('actions', TypeEnum.ACTIONS, 'Actions'),];
    public list: GenreModel [] = [];

    @ViewChild(MatTable) table!: MatTable<any>;

    constructor(private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialog: MatDialog) {
        this.getGenres()
            .subscribe(genres => {
                this.list = genres;
            });
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.crudService.getList(GENRES_URL)
            .pipe(
                map((list: any[]) => {
                    const genres: GenreModel[] = [];
                    list.forEach((item) => {
                        genres.push(new GenreModel(item.id, item.name))
                    });
                    return genres;
                }),
                takeUntil(this.destroy$)
            );
    }

    ngOnInit(): void {
    }


    public add() {
        this.dialog.open(GenrePopupComponent, {
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

    public delete(model: GenreModel) {
        const dialogRef = this.dialog.open(DeletePopupComponent, {
            data: {
                title: 'Removing an Item',
                message: ' Are you sure you want to remove the selected Item(s) and Related Data?'
            }
        });
        dialogRef.afterClosed().subscribe(status => {
            if (status) {
                this.removeAction(model).pipe(
                    switchMap((_) => this.removeRelatedData(model))
                ).subscribe({
                    next: () => {
                        this.dataCommunicationService.notify({isDeleted: true} as DataCommunicationModel)
                    }
                });
            }
        });
    }

    private removeRelatedData(model: GenreModel): Observable<boolean> {
        const filter = `genreId=${model.id}`;
        const deletedAuthors$ = this.getDeletedItems(filter, AUTHORS_URL);
        const deletedBooks$ = this.getDeletedItems(filter, BOOKS_URL);
        return zip(deletedAuthors$, deletedBooks$).pipe(
            map(_ => true)
        );
    }

    private getDeletedItems(filter: string, url: string): Observable<Object | []> {
        return this.crudService.getItemsByFilter(url, filter).pipe(
            map((data) => data.map(item => item.id)),
            mergeMap((ids: number[]) => ids.length ? this.crudService.bulkDelete(url, ids) :
                of([]))
        );
    }

    public edit([event, model]: [MouseEvent, GenreModel]) {
        this.dialog.open(GenrePopupComponent, {
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

    private removeAction(model: GenreModel): Observable<boolean> {
        const data = this.list;
        const index = data.indexOf(model);
        if (index > -1) {
            this.list.splice(index, 1);
            return this.crudService.removeItem(GENRES_URL, model).pipe(
                map(() => true)
            );
        }
        return of(false);
    }
}
