import {EntityModel} from "../../model/entity.model";

export class AuthorModel extends EntityModel {
  constructor(public override id: number,
              public firstName: string,
              public lastName: string,
              public genreId: number) {
    super(id);
  }
}
