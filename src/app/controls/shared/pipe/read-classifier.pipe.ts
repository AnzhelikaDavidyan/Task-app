import {Pipe, PipeTransform} from '@angular/core';
import {CrudService} from "../../services/crud.service";
import {map, Observable, of} from "rxjs";
import {ColumnModel} from "../util/table.util";

@Pipe({
    name: 'readClassifier'
})
export class ReadClassifierPipe implements PipeTransform {
    constructor(private crud: CrudService) {

    }

    transform(value: number, column: ColumnModel, name: string = 'name'): Observable<string> {
        return column.URL ? this.crud.getList(column.URL as string).pipe(
            map((list: any[]) => {
                const model = list.find(item => item.id === value);
                return model ? model[name] : '';
            })
        ) : of('');
    }

}
