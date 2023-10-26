import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].includes(err.status) && this.accountService.accountValue) {
                // Cerrar sesión automáticamente si la respuesta del API es 401 o 403
                this.accountService.logout();
            }

            // Extraer el mensaje de error del objeto err o usar err.statusText si no existe
            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err); // Registrar el error en la consola
            return throwError(() => error); // Devolver el error como un observable de error
        }));
    }
}
