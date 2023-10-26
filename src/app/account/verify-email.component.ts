import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

enum EmailStatus {
    Verifying,  // Estado de verificación
    Failed      // Estado de fallo
}

@Component({ templateUrl: 'verify-email.component.html' })
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;  // Enumeración de los estados de correo electrónico
    emailStatus = EmailStatus.Verifying;  // Establece el estado inicial como "Verifying" (Verificando)

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];  // Obtiene el token de los parámetros de la URL

        // Elimina el token de la URL para evitar fugas de referer HTTP
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.verifyEmail(token)  // Llama a un servicio para verificar el correo electrónico con el token
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Verificación exitosa, ahora puedes iniciar sesión', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });  // Redirige al usuario a la página de inicio de sesión
                },
                error: () => {
                    this.emailStatus = EmailStatus.Failed;  // Si hay un error, establece el estado como "Failed" (Fallo)
                }
            });
    }
}
