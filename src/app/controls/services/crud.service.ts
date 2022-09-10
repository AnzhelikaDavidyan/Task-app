import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {EntityModel} from "../model/entity.model";

@Injectable({
  'providedIn': 'root'
})
export class CrudService {
  constructor(private httpClient: HttpClient) {
  }

  public getList(url: string): Observable<EntityModel[]> {
    return this.httpClient.get<EntityModel[]>(url);
  }

  public removeItem(url: string, model: EntityModel): Observable<Object> {
    return this.httpClient.delete(`${url}/${model.id}`);
  }

  public saveItem(url: string, model: EntityModel): Observable<Object> {
    const headers = {'content-type': 'application/json'};
    return this.httpClient.post(`${url}`, JSON.stringify(model), {
      headers
    });
  }

  public editItem(url: string, model: EntityModel): Observable<Object> {
    const headers = {'content-type': 'application/json'};
    return this.httpClient.put(`${url}/${model.id}`, JSON.stringify(model), {
      headers
    });
  }

  public getLastId(url: string): Observable<number> {
    return this.getList(url).pipe(
      map((list: EntityModel[]) => {
        const ids: number[] = list.map(item => item.id);
        return Math.max(...ids);
      })
    )
  }

  public getItemByFilter(url: string, filter: string): Observable<any[]> {
    // genreId=${genreId}
    return this.httpClient.get<EntityModel[]>(`${url}?${filter}`);
  }
}