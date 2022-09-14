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

export function duplicate(list: any[], name: string = 'name') {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value.trim();
        const index = list.findIndex(item => item[name] === value);
        return index > -1 ? {duplicate: true} : null;
    }
}
