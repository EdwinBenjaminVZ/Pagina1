// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';  // Importación de servicios personalizados

@Component({ templateUrl: 'forgot-password.component.html' })  // Componente Angular con una plantilla HTML asociada
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;  // Declaración de un objeto FormGroup para el formulario
    loading = false;  // Indicador de carga
    submitted = false;  // Indica si el formulario se ha enviado

    constructor(
        private formBuilder: FormBuilder,  // Inyección de dependencia del servicio FormBuilder
        private accountService: AccountService,  // Inyección de dependencia del servicio AccountService
        private alertService: AlertService  // Inyección de dependencia del servicio AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]  // Campo de correo electrónico con validaciones requeridas y de formato de correo
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

        this.loading = true;  // Inicia el proceso de carga

        // Llamada a la función de recuperación de contraseña del servicio, con manejo de la respuesta
        this.accountService.forgotPassword(this.f.email.value)
            .pipe(first())
            .pipe(finalize(() => this.loading = false))  // Finaliza la carga, independientemente del resultado
            .subscribe({
                next: () => this.alertService.success('Por favor, revise su Gmail para las instrucciones de restablecimiento de contraseña'),  // Muestra un mensaje de éxito si la operación tiene éxito
                error: error => this.alertService.error(error)  // Muestra un mensaje de error en caso de error
            });
    }
}
