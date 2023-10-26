import { catchError, of } from 'rxjs';

import { AccountService } from '@app/_services';

// Define una función llamada 'appInitializer' que toma 'accountService' como argumento.
export function appInitializer(accountService: AccountService) {
    // Devuelve una función que se ejecutará durante la inicialización de la aplicación.
    return () => accountService.refreshToken()
        .pipe(
            // Captura errores para iniciar la aplicación tanto en caso de éxito como de fallo.
            catchError(() => of())
        );
}