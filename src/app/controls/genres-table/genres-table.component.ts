import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTable} from "@angular/material/table";
import {GenreModel} from "./model/genre.model";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {ColumnModel, PopupInfo, RelatedDataI} from "../shared/util/table.util";
import {DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {GenrePopupComponent} from "./genre-popup/genre-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";

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

    constructor(public dialog: MatDialog,
                private dataService: DataService) {
    }

    public ngOnInit(): void {
        this.dataService.getList(GENRES_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (genres: EntityModel[]) => {
                this.list = genres as GenreModel[];
            }
        });
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

    public delete(model: EntityModel) {
        const popupInfo = {
            title: 'Removing an Item',
            message: ' Are you sure you want to remove the selected Item(s) and Related Data?'
        } as DeletePopupI;
        const relatedDataModel = {
            filter: `genreId=${model.id}`,
            urls: [AUTHORS_URL, BOOKS_URL]
        } as RelatedDataI;
        this.dataService.deleteItem(GENRES_URL, model, this.list, popupInfo, true, relatedDataModel);
    }

    public edit([event, model]: [MouseEvent, EntityModel]) {
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

}
