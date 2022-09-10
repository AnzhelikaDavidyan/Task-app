import {EntityModel} from "../../model/entity.model";
import {GenreModel} from "../../genres-table/model/genre.model";
import {AuthorModel} from "../../authors-table/model/author.model";

export class BookModel extends EntityModel {
    constructor(public override id: number,
                public title: string,
                public genreId: number | GenreModel,
                public publishedYear: number,
                public authorId: number | AuthorModel) {
        super(id, title);
    }
}
