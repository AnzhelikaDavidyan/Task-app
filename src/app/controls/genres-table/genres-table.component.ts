import {Component, OnInit, ViewChild} from '@angular/core';
import {map, Observable, of, Subject, takeUntil} from "rxjs";
import {MatTable} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {CrudService} from "../services/crud.service";
import {MatDialog} from "@angular/material/dialog";
import {GENRES_URL} from "../util/url";
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
