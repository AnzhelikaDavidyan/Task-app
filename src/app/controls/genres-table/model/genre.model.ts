import {EntityModel} from "../../model/entity.model";

export class GenreModel extends EntityModel {
    constructor(public override id: number, public name: string) {
        super(id);
    }
}
