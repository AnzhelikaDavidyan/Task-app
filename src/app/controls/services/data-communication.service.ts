import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataCommunicationService {
    private notifier: Subject<object> = new Subject();

    public notify(value: object): void {
        this.notifier.next(value);
    }

    public getNotifier(): Observable<object> {
        return this.notifier;
    }
}

export interface DataCommunicationModel {
    isDeleted: boolean;
}
