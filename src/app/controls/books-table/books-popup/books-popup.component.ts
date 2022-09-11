import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, Observable, of, switchMap} from 'rxjs';
import {AuthorModel} from '../../authors-table/model/author.model';
import {GenreModel} from '../../genres-table/model/genre.model';
import {DeletePopupComponent} from '../../shared/delete-popup/delete-popup.component';
import {BookModel} from '../model/book.model';
import {CrudService} from "../../services/crud.service";
import {MenuItem} from "../../util/menu.enum";
import {AUTHORS_URL, BOOKS_URL, GENRES_URL, URLS} from "../../util/url";
import {EntityModel} from "../../model/entity.model";
import {MatTable} from "@angular/material/table";
import {DataCommunicationService} from "../../services/data-communication.service";

@Component({
    selector: 'app-books-popup',
    templateUrl: './books-popup.component.html',
    styleUrls: ['./books-popup.component.css']
})
export class BooksPopupComponent implements OnInit {

    public bookDetailForm!: FormGroup;
    public genres$: Observable<GenreModel[]> = of([]);
    public filteredAuthors$: Observable<AuthorModel[]> = of([]);
    public bookModel!: BookModel;

    constructor(private formBuilder: FormBuilder,
                private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    model: BookModel, list: any[], table: MatTable<any>,
                    isNew: boolean, title: string
                }) {
        this.bookModel = this.data.model;
        this.initForm(this.data.model);
    }


    public ngOnInit(): void {
        this.genres$ = this.getGenres() as Observable<GenreModel[]>;
        this.bookDetailForm.valueChanges.subscribe(changes => {
            console.log(changes)
        })
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.crudService.getList(GENRES_URL).pipe(
            map((list: EntityModel[]) => {
                const genres: GenreModel[] = [];
                list.forEach((item) => {
                    genres.push(new GenreModel(item.id, item.name as string))
                });
                return genres;
            })
        );
    }

    private initForm(model?: BookModel): void {
        this.bookDetailForm = this.formBuilder.group({
            id: new FormControl(model ? model.id : ''),
            title: new FormControl(model ? model.title : '', [Validators.required,
                Validators.maxLength(50)]),
            publishedYear: new FormControl(model ? model.publishedYear : '', Validators.minLength(4)),
            genreId: new FormControl(model ? model.genreId : '', Validators.required),
            authorId: new FormControl(model ? model.authorId : '', Validators.required)
        });
    }

    public onSave(): void {
        const model = this.bookDetailForm.value;
        if (this.bookDetailForm.valid) {
            if (this.data.isNew) {
                this.createBook(model).subscribe({
                    next: () => {
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

    private onEdit(model: BookModel): Observable<Object> {
        const foundModel: BookModel = this.data?.list.find(item => item.id === model.id);
        foundModel.genreId = (<GenreModel>foundModel.genreId).id;
        foundModel.authorId = (<AuthorModel>foundModel.authorId).id
        return this.crudService.editItem(BOOKS_URL, foundModel);
    }

    private createBook(model: BookModel): Observable<Object> {
        return this.crudService.getLastId(URLS.get(MenuItem.BOOKS) as string).pipe(
            switchMap((id: number) => {
                const book = new BookModel(++id, model.title, (<GenreModel>model.genreId).id,
                    model.publishedYear, (<AuthorModel>model.authorId).id);
                return this.crudService.saveItem(BOOKS_URL, book);
            })
        );
    }

    public onAuthorChange(model: AuthorModel) {
        this.setFormValue('authorId', model);
        this.bookDetailForm.controls['authorId'].setValue(model);
        this.bookModel.authorId = model;
    }

    private setFormValue(name: string, model: any) {
        this.bookDetailForm.controls[name].setValue(model);
    }

    public onGenreChange(model: GenreModel) {
        this.setFormValue('genreId', model);
        if (!this.bookModel) {
            const filter = `genreId=${model.id}`;
            this.filteredAuthors$ = this.filterAuthor(filter);
        } else if (model.id !== (<GenreModel>this.bookModel.genreId).id) {
            this.bookDetailForm.controls['authorId'].setValue(null);
            this.bookModel.authorId = null;
            const filter = `genreId=${model.id}`;
            this.filteredAuthors$ = this.filterAuthor(filter);
        }

    }

    private filterAuthor(filter: string): Observable<any[]> {
        return this.crudService.getItemByFilter(AUTHORS_URL, filter).pipe(
            map(data => {
                const authors: any[] = [];
                data.forEach(item => {
                    authors.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                })
                return authors;
            })
        );
    }

    onComboChange(item: EntityModel) {
        console.log(item);
    }
}

