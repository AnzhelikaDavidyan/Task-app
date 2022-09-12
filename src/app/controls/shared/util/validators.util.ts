import {AbstractControl} from '@angular/forms';

export function isPositive(control: AbstractControl) {
    const value = +control.value;
    if (value <= 0) {
        return {isNegative: true};
    }
    return null;
}
