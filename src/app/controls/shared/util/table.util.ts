import {TypeEnum} from "../enum/type.enum";


export class ColumnModel {
    constructor(public systemName: string, public type: TypeEnum, public title: string,
                public URL?: string) {

    }
}

export interface PopupInfo {
    isNew: boolean;
    title: string;
    model: any;
    list: any[];
}
