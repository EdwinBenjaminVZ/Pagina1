import { AbstractControl } from '@angular/forms';

// Validador personalizado para verificar que dos campos coincidan
export function MustMatch(controlName: string, matchingControlName: string) {
    return (group: AbstractControl) => {
        const control = group.get(controlName); // Obtiene el control del primer campo
        const matchingControl = group.get(matchingControlName); // Obtiene el control del campo que debe coincidir

        if (!control || !matchingControl) {
            return null; // Retorna nulo si no se encuentran los controles
        }

        // Retorna nulo si otro validador ya ha encontrado un error en matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return null;
        }

        // Establece un error en matchingControl si la validación falla
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true }); // Establece un error personalizado llamado "mustMatch"
        } else {
            matchingControl.setErrors(null); // Elimina cualquier error si los valores coinciden
        }
        return null; // Retorna nulo al final de la función
    }
}
