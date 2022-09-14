import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {NgZone} from "@angular/core";
import {runInZone} from "../util/run-in-zone";
import {EntityModel} from "../model/entity.model";
import {ChannelEnum} from "../util/channel.enum";

interface BroadcastMessage {
    type: ChannelEnum;
    payload: EntityModel;
}

export class BroadcastService {
    private broadcastChannel: BroadcastChannel;
    private onMessage = new Subject<any>();

    constructor(broadcastChannelName: string, private ngZone: NgZone) {
        this.broadcastChannel = new BroadcastChannel(broadcastChannelName);
        this.broadcastChannel.onmessage = (message) => this.onMessage.next(message.data);
    }

    publish(message: BroadcastMessage): void {
        this.broadcastChannel.postMessage(message);
    }

    messagesOfType(type: ChannelEnum): Observable<BroadcastMessage> {
        return this.onMessage.pipe(
            // It is important that we are running in the NgZone. This will make sure that Angular
            // component changes are immediately visible in the browser when they
            // are updated after receiving messages.
            runInZone(this.ngZone),
            filter(message => message.type === type)
        );
    }
}
