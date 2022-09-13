import {Component, Inject, OnInit} from '@angular/core';
import {GenreModel} from "../model/genre.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CrudService} from "../../services/crud.service";
import {DataCommunicationService} from "../../services/data-communication.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../shared/delete-popup/delete-popup.component";
import {Observable} from "rxjs";
import {GENRES_URL} from "../../util/url";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-genre-popup',
    templateUrl: './genre-popup.component.html',
    styleUrls: ['./genre-popup.component.css']
})
export class GenrePopupComponent implements OnInit {

    public formGroup!: FormGroup;
    public genreModel!: GenreModel;

    constructor(private formBuilder: FormBuilder,
                private crudService: CrudService,
                private dataService: DataService,
                private dataCommunicationService: DataCommunicationService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    model: GenreModel, list: GenreModel[], isNew: boolean, title: string,
                    genres: GenreModel[]
                }) {
        this.genreModel = this.data.model;
        this.initForm(this.genreModel)
    }

    ngOnInit(): void {
    }

    private initForm(model?: GenreModel): void {
        this.formGroup = this.formBuilder.group({
            id: new FormControl(model ? model.id : ''),
            name: new FormControl(model ? model.name : '', [Validators.required,
                Validators.maxLength(50)]),
        });
    }

    public onSave() {
        const model = this.formGroup.value;
        if (this.formGroup.valid) {
            if (this.data.isNew) {
                this.dataService.createItem(GENRES_URL, model).subscribe({
                    next: () => {
                        const genre = new GenreModel(model.id, model.name);
                        this.dataCommunicationService.notify({
                            model: genre,
                            isCreated: true,
                            isEdited: false,
                            isDeleted: false
                        });
                    }
                })
            } else {
                this.onEdit(model).subscribe({
                    next: () => {
                        this.dataCommunicationService.notify({
                            model,
                            isCreated: false,
                            isEdited: true,
                            isDeleted: false
                        });
                    }
                });
            }
        }
    }


    private onEdit(model: GenreModel): Observable<Object> {
        // const index = this.data?.list.findIndex(item => item.id === model.id);
        // this.data.list[index] = model;
        return this.dataService.editItem(GENRES_URL, model);
    }
}
