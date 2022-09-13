import {TypeEnum} from "../enum/type.enum";


export class ColumnModel {
    constructor(public systemName: string, public type: TypeEnum, public title: string,
                public URL?: string) {

    }
}

export interface PopupInfo {
    isNew: boolean;
    title: string;
    message: string;
    model: any;
    list: any[];
}

export interface RelatedDataI {
    filter: string;
    urls: string[];
}
