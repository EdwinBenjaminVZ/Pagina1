// Importación de módulos y componentes necesarios
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';  // Importación de servicios personalizados

@Component({ templateUrl: 'login.component.html' })  // Componente Angular con una plantilla HTML asociada
export class LoginComponent implements OnInit {
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
            email: ['', [Validators.required, Validators.email]],  // Campo de correo electrónico con validaciones requeridas y de formato de correo
            password: ['', Validators.required]  // Campo de contraseña con validación requerida
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

        // Inicio de sesión llamando a un servicio y manejando la respuesta
        this.accountService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // Obtén la URL de retorno desde los parámetros de consulta o utiliza la página de inicio de forma predeterminada
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl);  // Redirige a la URL de retorno
                },
                error: error => {
                    this.alertService.error(error);  // Muestra un mensaje de error en caso de error
                    this.submitting = false;  // Detiene el proceso de envío
                }
            });
    }
}
