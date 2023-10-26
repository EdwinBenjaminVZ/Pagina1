// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';  // Importación de servicios personalizados
import { MustMatch } from '@app/_helpers';  // Importación de una función personalizada

@Component({ templateUrl: 'register.component.html' })  // Componente Angular con una plantilla HTML asociada
export class RegisterComponent implements OnInit {
    form!: FormGroup;  // Declaración de un objeto FormGroup para el formulario
    submitting = false;  // Indicador de envío del formulario
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
            title: ['', Validators.required],  // Campo de título con validación requerida
            firstName: ['', Validators.required],  // Campo de nombre con validación requerida
            lastName: ['', Validators.required],  // Campo de apellido con validación requerida
            email: ['', [Validators.required, Validators.email]],  // Campo de correo electrónico con validaciones requeridas y de formato de correo
            password: ['', [Validators.required, Validators.minLength(6)]],  // Campo de contraseña con validaciones requeridas y longitud mínima
            confirmPassword: ['', Validators.required],  // Campo de confirmación de contraseña con validación requerida
            acceptTerms: [false, Validators.requiredTrue]  // Campo de aceptación de términos con validación requerida y valor booleano
        }, {
            validator: MustMatch('password', 'confirmPassword')  // Validador personalizado para verificar si las contraseñas coinciden
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

        this.submitting = true;  // Inicia el proceso de envío

        // Registro de un nuevo usuario llamando a un servicio y manejando la respuesta
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registro exitoso, por favor verifica tu correo electrónico para obtener instrucciones de verificación', { keepAfterRouteChange: true });  // Muestra un mensaje de éxito
                    this.router.navigate(['../login'], { relativeTo: this.route });  // Redirecciona al componente de inicio de sesión
                },
                error: error => {
                    this.alertService.error(error);  // Muestra un mensaje de error en caso de error
                    this.submitting = false;  // Detiene el proceso de envío
                }
            });
    }
}
