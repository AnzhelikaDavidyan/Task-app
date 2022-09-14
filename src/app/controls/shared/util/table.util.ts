import {TypeEnum} from "../enum/type.enum";
import {DeletePopupI} from "../delete-popup/delete-popup.component";
import {EntityModel} from "../../model/entity.model";


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

export function popupGeneralConfig(data: DeletePopupI) {
    return {
        disableClose: true,
        autoFocus: false,
        width: '400px',
        height: 'auto',
        data: {
            title: data.title,
            message: data.message,
            yesAction: data.yesAction,
            yesArgs: data.yesArgs
        }
    }
}

export function removeItemFromList(list: EntityModel[], item: EntityModel) {
    const index = list.indexOf(item);
    if (index > -1) {
        list.splice(index, 1);
    }
}
