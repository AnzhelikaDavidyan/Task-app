import {EntityModel} from "../../model/entity.model";

export class BookModel extends EntityModel {
    constructor(public override id: number,
                public title: string,
                public description: string,
                public genreId: number,
                public publishedYear: number,
                public authorId: number | null) {
        super(id);
    }
}
