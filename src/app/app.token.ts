import {inject, InjectionToken, NgZone} from '@angular/core';
import {BroadcastService} from "./controls/services/broadcast.service";

export const BROADCAST_SERVICE = new InjectionToken<BroadcastService>('broadCastService', {
    factory: () => new BroadcastService('sample-broadcast-service', inject(NgZone))
});
