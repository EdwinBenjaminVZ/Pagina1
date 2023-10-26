import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    // Intercepta las solicitudes HTTP para agregar el encabezado de autenticación con el JWT si el usuario ha iniciado sesión y la solicitud es para la API.
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Obtener la información de la cuenta del servicio de cuentas
        const account = this.accountService.accountValue;

        // Comprobar si el usuario ha iniciado sesión (está autenticado)
        const isLoggedIn = account && account.jwtToken;

        // Comprobar si la solicitud está dirigida a la URL de la API definida en el entorno
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        // Si el usuario ha iniciado sesión y la solicitud es para la API, agregar el encabezado de autorización con el token JWT.
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
            });
        }

        // Continuar manejando la solicitud original
        return next.handle(request);
    }
}
