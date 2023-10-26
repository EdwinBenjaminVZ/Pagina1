// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';  // Importación de servicios personalizados
import { MustMatch } from '@app/_helpers';  // Importación de una función personalizada

// Declaración de un enumerador llamado TokenStatus para representar el estado del token
enum TokenStatus {
    Validating,  // Validando
    Valid,       // Válido
    Invalid      // Inválido
}

@Component({ templateUrl: 'reset-password.component.html' })  // Componente Angular con una plantilla HTML asociada
export class ResetPasswordComponent implements OnInit {
    TokenStatus = TokenStatus;  // Asignación del enumerador a una propiedad
    tokenStatus = TokenStatus.Validating;  // Estado inicial del token: Validando
    token?: string;  // Token (puede estar indefinido)
    form!: FormGroup;  // Declaración de un objeto FormGroup para el formulario
    loading = false;  // Indicador de carga
    submitted = false;  // Indica si el formulario se ha enviado

    constructor(
        private formBuilder: FormBuilder,  // Inyección de dependencia del servicio FormBuilder
        private route: ActivatedRoute,  // Inyección de dependencia del servicio ActivatedRoute
        private router: Router,  // Inyección de dependencia del servicio Router
        private accountService: AccountService,  // Inyección de dependencia del servicio AccountService
        private alertService: AlertService  // Inyección de dependencia del servicio AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],  // Campo de contraseña con validaciones
            confirmPassword: ['', Validators.required],  // Campo de confirmación de contraseña
        }, {
            validator: MustMatch('password', 'confirmPassword')  // Validador personalizado para verificar si las contraseñas coinciden
        });

        const token = this.route.snapshot.queryParams['token'];  // Obtención del token de la URL

        // Elimina el token de la URL para evitar la fuga de referencias HTTP
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        // Validación del token llamando a un servicio y manejando la respuesta
        this.accountService.validateResetToken(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.token = token;  // Token válido
                    this.tokenStatus = TokenStatus.Valid;  // Cambio de estado a "Válido"
                },
                error: () => {
                    this.tokenStatus = TokenStatus.Invalid;  // Cambio de estado a "Inválido" en caso de error
                }
            });
    }

    // Función getter para facilitar el acceso a los campos del formulario
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;  // Indica que se ha enviado el formulario

        // Limpia las alertas antes de enviar el formulario
        this.alertService.clear();

        // Detiene la ejecución si el formulario es inválido
        if (this.form.invalid) {
            return;
        }

        this.loading = true;  // Inicia la carga

        // Reinicio de la contraseña llamando a un servicio y manejando la respuesta
        this.accountService.resetPassword(this.token!, this.f.password.value, this.f.confirmPassword.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Contraseña restablecida con éxito, ahora puedes iniciar sesión', { keepAfterRouteChange: true });  // Muestra un mensaje de éxito
                    this.router.navigate(['../login'], { relativeTo: this.route });  // Redirecciona al componente de inicio de sesión
                },
                error: error => {
                    this.alertService.error(error);  // Muestra un mensaje de error en caso de error
                    this.loading = false;  // Detiene la carga
                }
            });
    }
}
