import {Component, Inject, OnInit} from '@angular/core';
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
import {DataCommunicationService} from "../../services/data-communication.service";
import {MatOptionSelectionChange} from "@angular/material/core";

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
                private crudService: CrudService,
                private dataCommunicationService: DataCommunicationService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {
                    model: BookModel, list: any[], isNew: boolean, title: string
                }) {
        this.bookModel = this.data.model;
        this.initForm(this.bookModel);
    }


    public ngOnInit(): void {
        this.genres$ = this.getGenres() as Observable<GenreModel[]>;
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.crudService.getList(GENRES_URL).pipe(
            map((list: EntityModel[]) => {
                const genres: GenreModel[] = [];
                list.forEach((item: any) => {
                    genres.push(new GenreModel(item.id, item.name))
                });
                return genres;
            })
        );
    }

    private initForm(model?: BookModel): void {
        this.formGroup = this.formBuilder.group({
            id: new FormControl(model ? model.id : ''),
            title: new FormControl(model ? model.title : '', [Validators.required,
                Validators.maxLength(50)]),
            description: new FormControl(model ? model.description : ''),
            publishedYear: new FormControl(model ? model.publishedYear : '', Validators.minLength(4)),
            genreId: new FormControl(model ? model.genreId : '', Validators.required),
            authorId: new FormControl(model ? model.authorId : '', Validators.required)
        });
        this.genreId = this.formGroup.get('genreId') as FormControl;
        this.authorId = this.formGroup.get('authorId') as FormControl;
    }

    public onSave(): void {
        const model = this.formGroup.value;
        if (this.formGroup.valid) {
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
        const index = this.data?.list.findIndex(item => item.id === model.id);
        this.data.list[index] = model;
        return this.crudService.editItem(BOOKS_URL, model);
    }

    private createBook(model: BookModel): Observable<Object> {
        return this.crudService.getLastId(URLS.get(MenuItem.BOOKS) as string).pipe(
            switchMap((id: number) => {
                const book = new BookModel(++id, model.title, model.description, model.genreId,
                    model.publishedYear, model.authorId);
                this.data.list.push(book);
                return this.crudService.saveItem(BOOKS_URL, book);
            })
        );
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

    private filterAuthor(filter: string): Observable<any[]> {
        return this.crudService.getItemsByFilter(AUTHORS_URL, filter).pipe(
            map(data => {
                const authors: any[] = [];
                data.forEach(item => {
                    authors.push(new AuthorModel(item.id, item.firstName, item.lastName, item.genreId))
                })
                return authors;
            })
        );
    }

}

