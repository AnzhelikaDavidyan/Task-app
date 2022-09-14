import {Component, Inject, OnInit} from '@angular/core';
import {GenreModel} from "../model/genre.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CrudService} from "../../services/crud.service";
import {DataCommunicationModel, DataCommunicationService} from "../../services/data-communication.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DeletePopupComponent} from "../../shared/delete-popup/delete-popup.component";
import {Observable} from "rxjs";
import {GENRES_URL} from "../../util/url";
import {DataService} from "../../services/data.service";
import {duplicate} from "../../shared/util/validators.util";
import {BROADCAST_SERVICE} from "../../../app.token";
import {BroadcastService} from "../../services/broadcast.service";
import {ActionEnum} from "../../util/action.enum";

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
                },
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
        this.genreModel = this.data.model;
        this.initForm(this.genreModel)
    }

    ngOnInit(): void {
    }

    private initForm(model?: GenreModel): void {
        this.formGroup = this.formBuilder.group({
            id: new FormControl(model ? model.id : ''),
            name: new FormControl(model ? model.name : '', [Validators.required,
                Validators.maxLength(50), duplicate(this.data.list)]),
        });
    }

    private publish(type: ActionEnum, model: GenreModel) {
        this.broadCastService.publish({
            type: type,
            payload: model
        });
    }

    private notify(dataCommunicationModel: DataCommunicationModel): void {
        this.dataCommunicationService.notify(dataCommunicationModel);
    }

    public onSave() {
        const model = this.formGroup.value;
        if (this.formGroup.valid) {
            if (this.data.isNew) {
                this.dataService.createItem(GENRES_URL, model).subscribe({
                    next: () => {
                        const genre = new GenreModel(model.id, model.name);
                        this.publish(ActionEnum.CREATE, genre);
                        this.notify({
                            model: genre,
                            isCreated: true,
                            isEdited: false,
                            isDeleted: false
                        } as DataCommunicationModel);
                    }
                })
            } else {
                this.onEdit(model).subscribe({
                    next: () => {
                        this.publish(ActionEnum.EDIT, model);
                        this.notify({
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
        return this.dataService.editItem(GENRES_URL, model);
    }
}
