import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, Observable, of} from 'rxjs';
import {AuthorModel} from '../../authors-table/model/author.model';
import {GenreModel} from '../../genres-table/model/genre.model';
import {DeletePopupComponent} from '../../shared/delete-popup/delete-popup.component';
import {BookModel} from '../model/book.model';
import {CrudService} from "../../services/crud.service";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL} from "../../util/url";
import {DataCommunicationService} from "../../services/data-communication.service";
import {MatOptionSelectionChange} from "@angular/material/core";
import {includeNCharacter, isPositive} from "../../shared/util/validators.util";
import {DataService} from "../../services/data.service";
import {EntityModel} from "../../model/entity.model";
import {BROADCAST_SERVICE} from "../../../app.token";
import {BroadcastService} from "../../services/broadcast.service";
import {ChannelEnum} from "../../util/channel.enum";

@Component({
    selector: 'app-book-popup',
    templateUrl: './book-popup.component.html',
    styleUrls: ['./book-popup.component.css']
})
export class BookPopupComponent implements OnInit {

    public formGroup!: FormGroup;
    public genres$: Observable<GenreModel[]> = of([]);
    public filteredAuthors$: Observable<AuthorModel[]> = of([]);
    public bookModel!: BookModel;

    public genreId!: FormControl;
    public authorId!: FormControl;

    constructor(private formBuilder: FormBuilder,
                private dataService: DataService,
                private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    model: BookModel,
                    list: BookModel[],
                    isNew: boolean,
                    title: string
                },
                @Inject(BROADCAST_SERVICE) private broadCastService: BroadcastService) {
        this.bookModel = this.data.model;
        this.initForm(this.bookModel);
    }


    public ngOnInit(): void {
        this.genres$ = this.dataService.getList(GENRES_URL) as Observable<GenreModel[]>;
    }

    private publish(type: ChannelEnum, model: BookModel) {
        this.broadCastService.publish({
            type: type,
            payload: model
        });
    }

    private initForm(model?: BookModel): void {
        this.formGroup = this.formBuilder.group({
            id: new FormControl(model ? model.id : null),
            title: new FormControl(model ? model.title : null, [Validators.required,
                Validators.maxLength(50)]),
            description: new FormControl(model ? model.description : null,
                [Validators.maxLength(100)]),
            publishedYear: new FormControl(model ? model.publishedYear : null,
                [Validators.minLength(4), isPositive, includeNCharacter(4)]),
            genreId: new FormControl(model ? model.genreId : null, Validators.required),
            authorId: new FormControl(model ? model.authorId : null, Validators.required)
        });
        this.genreId = this.formGroup.get('genreId') as FormControl;
        this.authorId = this.formGroup.get('authorId') as FormControl;
    }

    public onSave(): void {
        const model = this.formGroup.value;
        if (this.formGroup.valid) {
            if (this.data.isNew) {
                this.dataService.createItem(BOOKS_URL, model).subscribe({
                    next: () => {
                        const book = new BookModel(model.id, model.title, model.description, model.genreId,
                            model.publishedYear, model.authorId);
                        this.publish(ChannelEnum.CREATE_BOOK, book);
                        this.dataCommunicationService.notify({
                            model: book,
                            isCreated: true,
                            isEdited: false,
                            isDeleted: false
                        });
                    },
                    error: console.error
                })
            } else {
                this.onEdit(model).subscribe({
                    next: () => {
                        this.publish(ChannelEnum.EDIT_BOOK, model);
                        this.dataCommunicationService.notify({
                            model,
                            isCreated: false,
                            isEdited: true,
                            isDeleted: false
                        });
                    },
                    error: console.error
                });
            }
        }
    }

    private onEdit(model: BookModel): Observable<Object> {
        return this.crudService.editItem(BOOKS_URL, model);
    }

    public onAuthorChange(event: MatOptionSelectionChange) {
        if (event.isUserInput) {
            const authorId = event.source.value;
            this.setFormValue('authorId', authorId);
        }
    }

    private setFormValue(name: string, id: number): void {
        this.formGroup.get(name)?.setValue(id);
    }

    public onGenreChange(event: MatOptionSelectionChange): void {
        if (event.isUserInput) {
            const genreId = event.source.value;
            this.setFormValue('genreId', genreId);
            if (this.bookModel && genreId !== this.bookModel.genreId) {
                this.formGroup.get('authorId')?.setValue(null);
                this.bookModel.authorId = null;
            }
            this.initFilteredAuthors(genreId);
        } else {
            this.initFilteredAuthors(this.bookModel.genreId);
        }
    }

    private initFilteredAuthors(genreId: number): void {
        const filter = `genreId=${genreId}`;
        this.filteredAuthors$ = this.filterAuthor(filter);
    }

    private filterAuthor(filter: string): Observable<AuthorModel[]> {
        return this.crudService.getItemsByFilter(AUTHORS_URL, filter).pipe(
            map((data: EntityModel[]) => {
                const authors: AuthorModel[] = [];
                (data as AuthorModel[]).forEach((item: AuthorModel) => {
                    authors.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                })
                return authors;
            })
        );
    }

}

