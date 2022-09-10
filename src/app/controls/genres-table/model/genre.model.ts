import {EntityModel} from "../../model/entity.model";

export class GenreModel extends EntityModel {
  constructor(public override id: number, public override name: string) {
    super(id, name);
  }
}
