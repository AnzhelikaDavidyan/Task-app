import {ColumnModel} from "../table/table.component";
import {EntityModel} from "../../model/entity.model";
import {GenreModel} from "../../genres-table/model/genre.model";
import {BookModel} from "../../books-table/model/book.model";
import {AuthorModel} from "../../authors-table/model/author.model";

export function createColumnModels(displayedColumns: string[]) {
    return displayedColumns.map((item, index) => {
        return {id: index, systemName: item, title: item.toUpperCase()} as ColumnModel;
    });
}

export interface PopupInfo {
    isNew: boolean;
    title: string;
    model: CommonModel;
    list: CommonModel[];
}

export type CommonModel = GenreModel | BookModel | AuthorModel;
