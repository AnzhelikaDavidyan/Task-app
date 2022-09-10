import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map, noop, Observable, of, switchMap} from 'rxjs';
import {AuthorModel} from '../../authors-table/model/author.model';
import {GenreModel} from '../../genres-table/model/genre.model';
import {DeletePopupComponent} from '../../shared/delete-popup/delete-popup.component';
import {BookModel} from '../model/book.model';
import {CrudService} from "../../services/crud.service";
import {MenuItem} from "../../util/menu.enum";
import {URLS} from "../../util/url";
import {EntityModel} from "../../model/entity.model";

@Component({
    selector: 'app-books-popup',
    templateUrl: './books-popup.component.html',
    styleUrls: ['./books-popup.component.css']
})
export class BooksPopupComponent implements OnInit {

    public bookDetailForm!: FormGroup;
    public genres$: Observable<GenreModel[]> = of([]);
    public filteredAuthors$: Observable<AuthorModel[]> = of([]);
    public readonly BOOKS_URL: string = URLS.get(MenuItem.BOOKS) as string;
    public readonly AUTHORS_URL: string = URLS.get(MenuItem.AUTHORS) as string;
    public readonly GENRES_URL: string = URLS.get(MenuItem.GENRES) as string;

    constructor(private formBuilder: FormBuilder,
                private crudService: CrudService,
                public dialogRef: MatDialogRef<DeletePopupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { model: any, list: any[] }) {
        this.initForm(this.data?.model);
    }


    public ngOnInit(): void {
        this.genres$ = this.getGenres() as Observable<GenreModel[]>;
        this.bookDetailForm.valueChanges.subscribe(changes => {
            console.log(changes)
        })
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.crudService.getList(this.GENRES_URL).pipe(
            map((list: EntityModel[]) => {
                const genres: GenreModel[] = [];
                list.forEach((item) => {
                    genres.push(new GenreModel(item.id, item.name as string))
                });
                return genres;
            })
        );
    }

    private initForm(model: BookModel): void {
        if (!model) {
            this.bookDetailForm = this.formBuilder.group({
                title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                publishedYear: new FormControl('', Validators.maxLength(4)),
                genreId: new FormControl('', Validators.required),
                authorId: new FormControl('', Validators.required)
            });
        } else {
            this.bookDetailForm = this.formBuilder.group({
                id: new FormControl(model.id),
                title: new FormControl(model.title, [Validators.required, Validators.maxLength(50)]),
                publishedYear: new FormControl(model.publishedYear, Validators.maxLength(4)),
                genreId: new FormControl(model.genreId, Validators.required),
                authorId: new FormControl(model.authorId, Validators.required)
            });
        }

    }

    public onSave(): void {
        const model = this.bookDetailForm.value;
        if (this.bookDetailForm.valid) {
            const foundModel = this.data?.list.find(item => item.id === model.id);
            if (!foundModel) {
                this.crudService.getLastId(URLS.get(MenuItem.BOOKS) as string).pipe(
                    switchMap((id: number) => {
                        const book = new BookModel(++id, model.title, model.genreId.id, 2022, model.authorId.id);
                        return this.crudService.saveItem(this.BOOKS_URL, book);
                    })
                ).subscribe(noop, console.error);
            } else {
                this.editAction(model);
            }
        }
    }

    public editAction(model: BookModel) {
        this.crudService.editItem(this.BOOKS_URL, model).subscribe({
            next: () => {
            },
            error: () => console.error
        })
    }

    public onAuthorChange(model: AuthorModel) {
        this.setFormValue('authorId', model);
        this.bookDetailForm.controls['authorId'].setValue(model);
    }

    private setFormValue(name: string, model: any) {
        this.bookDetailForm.controls[name].setValue(model);
    }

    public onGenreChange(model: GenreModel) {
        this.setFormValue('genreId', model);
        const filter = `genreId=${model.id}`;
        this.filteredAuthors$ = this.crudService.getItemByFilter(this.AUTHORS_URL, filter).pipe(
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

