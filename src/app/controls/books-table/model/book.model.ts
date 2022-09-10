import {EntityModel} from "../../model/entity.model";

export class BookModel extends EntityModel {
  constructor(public override id: number,
              public title: string,
              public genreId: number,
              public publishedYear: number,
              public authorId: number) {
    super(id, title);
  }
}
