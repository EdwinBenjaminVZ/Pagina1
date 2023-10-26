import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;
        if (account) {
            // Comprobar si la ruta está restringida por roles
            if (route.data.roles && !route.data.roles.includes(account.role)) {
                // Rol no autorizado, por lo que redirigimos a la página de inicio
                this.router.navigate(['/']);
                return false;
            }

            // Autorizado, así que devolvemos true
            return true;
        }

        // Si no ha iniciado sesión, redirigimos a la página de inicio de sesión con la URL de retorno
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
