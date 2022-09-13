import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataCommunicationService {
    private notifier: Subject<DataCommunicationModel> = new Subject();

    public notify(value: DataCommunicationModel): void {
        this.notifier.next(value);
    }

    public getNotifier(): Observable<DataCommunicationModel> {
        return this.notifier;
    }
}

export interface DataCommunicationModel {
    isDeleted: boolean;
    isCreated: boolean;
    isEdited: boolean;
    model: any;
}
