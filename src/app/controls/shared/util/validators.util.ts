import {AbstractControl, ValidationErrors} from '@angular/forms';

export function isPositive(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value <= 0) {
        return {isNegative: true};
    }
    return null;
}

export function includeNCharacter(n: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value + '';
        if (value.length !== n) {
            return {characterCount: true, requiredValue: n}
        }
        return null;
    }

}
