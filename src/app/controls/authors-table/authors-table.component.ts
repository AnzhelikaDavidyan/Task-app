import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {GenreModel} from "../genres-table/model/genre.model";
import {AuthorModel} from "./model/author.model";
import {ColumnModel, PopupInfo, RelatedDataI} from "../shared/util/table.util";
import {MatDialog} from "@angular/material/dialog";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../util/url";
import {DeletePopupI} from "../shared/delete-popup/delete-popup.component";
import {AuthorPopupComponent} from "./author-popup/author-popup.component";
import {TypeEnum} from "../shared/enum/type.enum";
import {DataService} from "../services/data.service";
import {EntityModel} from "../model/entity.model";

@Component({
    selector: 'app-authors-table',
    templateUrl: './authors-table.component.html',
    styleUrls: ['./authors-table.component.css']
})
export class AuthorsTableComponent implements OnInit {

    private destroy$ = new Subject();
    public displayedColumns: string[] = ['id', 'firstName', 'lastName', 'genreId', 'actions'];
    public columns: ColumnModel[] = [
        new ColumnModel('id', TypeEnum.NUMBER, 'ID'),
        new ColumnModel('firstName', TypeEnum.STRING, 'First Name'),
        new ColumnModel('lastName', TypeEnum.STRING, 'Last Name'),
        new ColumnModel('genreId', TypeEnum.CLASSIFIER, 'Genre', GENRES_URL),
        new ColumnModel('actions', TypeEnum.ACTIONS, 'Actions'),
    ];
    public list: AuthorModel [] = [];

    constructor(public dialog: MatDialog,
                private dataService: DataService) {
    }

    public ngOnInit(): void {
        this.dataService.getList(AUTHORS_URL).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (authors: EntityModel[]) => {
                this.list = authors as AuthorModel[];
            }
        });
    }

    public add() {
        this.dialog.open(AuthorPopupComponent, {
            data: {
                isNew: true,
                list: this.list,
                title: 'Add Author'
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

    public delete(model: AuthorModel) {
        const popupInfo = {
            title: 'Removing an Item',
            message: ' Are you sure you want to remove the selected Item(s) and Related Data?'
        } as DeletePopupI;
        const relatedDataModel = {
            filter: `authorId=${model.id}`,
            urls: [BOOKS_URL]
        } as RelatedDataI;
        this.dataService.deleteItem(AUTHORS_URL, model, this.list, popupInfo, true, relatedDataModel);
    }

    public edit([event, model]: [MouseEvent, GenreModel]) {
        this.dialog.open(AuthorPopupComponent, {
            data: {
                model,
                list: this.list,
                title: 'Edit Author',
            } as PopupInfo,
            disableClose: true,
            autoFocus: false,
            width: '400px',
            height: 'auto'
        });
    }

}
