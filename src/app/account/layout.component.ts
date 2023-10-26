// Importación de módulos y componentes necesarios
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';  // Importación de un servicio personalizado

@Component({ templateUrl: 'layout.component.html' })  // Componente Angular con una plantilla HTML asociada
export class LayoutComponent {
    constructor(
        private router: Router,  // Inyección de dependencia del servicio Router
        private accountService: AccountService  // Inyección de dependencia del servicio AccountService
    ) {
        // Redirige a la página de inicio si ya se ha iniciado sesión
        if (this.accountService.accountValue) {
            this.router.navigate(['/']);
        }
    }
}
