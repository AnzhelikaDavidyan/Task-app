import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CrudService} from "../../services/crud.service";
import {DataCommunicationService} from "../../services/data-communication.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../shared/delete-popup/delete-popup.component";
import {AuthorModel} from "../model/author.model";
import {map, Observable, of, switchMap} from "rxjs";
import {GenreModel} from "../../genres-table/model/genre.model";
import {AUTHORS_URL, GENRES_URL, URLS} from "../../util/url";
import {MenuItem} from "../../util/menu.enum";
import {MatOptionSelectionChange} from "@angular/material/core";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-author-popup',
    templateUrl: './author-popup.component.html',
    styleUrls: ['./author-popup.component.css']
})
export class AuthorPopupComponent implements OnInit {

    public genreId!: FormControl;
    public authorModel!: AuthorModel;
    public formGroup!: FormGroup;
    public genres$: Observable<GenreModel[]> = of([]);

    constructor(private formBuilder: FormBuilder,
                private dataService: DataService,
                private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    model: AuthorModel, list: any[], isNew: boolean, title: string
                }) {
        this.authorModel = this.data.model;
        this.initForm(this.authorModel);
    }

    ngOnInit(): void {
        this.genres$ = this.dataService.getList(GENRES_URL) as Observable<GenreModel[]>;
    }

    private initForm(model?: AuthorModel): void {
        this.formGroup = this.formBuilder.group({
            id: new FormControl(model ? model.id : ''),
            firstName: new FormControl(model ? model.firstName : '', [Validators.required,
                Validators.maxLength(50)]),
            lastName: new FormControl(model ? model.lastName : '', [Validators.required,
                Validators.maxLength(50)]),
            genreId: new FormControl(model ? model.genreId : '', Validators.required),
        });
        this.genreId = this.formGroup.get('genreId') as FormControl;
    }

    public onSave(): void {
        const model = this.formGroup.value;
        if (this.formGroup.valid) {
            if (this.data.isNew) {
                this.dataService.createItem(AUTHORS_URL, model).subscribe({
                    next: () => {
                        const authorModel = new AuthorModel(model.id, model.firstName, model.lastName, model.genreId);
                        this.data.list.push(authorModel);
                        this.dataCommunicationService.notify({isCreated: true});
                    }
                })
            } else {
                this.onEdit(model).subscribe({
                    next: () => {
                        this.dataCommunicationService.notify({isEdited: true});
                    }
                });
            }
        }
    }

    private onEdit(model: AuthorModel): Observable<Object> {
        const index = this.data?.list.findIndex(item => item.id === model.id);
        this.data.list[index] = model;
        return this.dataService.editItem(AUTHORS_URL, model);
    }

    public onGenreChange(event: MatOptionSelectionChange): void {
        if (event.isUserInput) {
            const genreId = event.source.value;
            this.formGroup.get('genreId')?.setValue(genreId);
        }
    }

}
