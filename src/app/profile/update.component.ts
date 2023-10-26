import { Component, OnInit } from '@angular/core'; // Importa módulos necesarios de Angular
import { Router, ActivatedRoute } from '@angular/router'; // Importa el enrutador y la información de ruta
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa formularios reactivos y validadores
import { first } from 'rxjs/operators'; // Importa el operador 'first' de RxJS

import { AccountService, AlertService } from '@app/_services'; // Importa servicios personalizados de la aplicación
import { MustMatch } from '@app/_helpers'; // Importa una función personalizada para validar contraseñas

@Component({ templateUrl: 'update.component.html' }) // Define el componente con una plantilla HTML asociada
export class UpdateComponent implements OnInit {
    account = this.accountService.accountValue!; // Obtiene la información de la cuenta actual
    form!: FormGroup; // Declara un grupo de formularios
    submitting = false; // Indicador de envío de formulario
    submitted = false; // Indicador de formulario enviado
    deleting = false; // Indicador de eliminación

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // Configura el formulario con campos y validadores
        this.form = this.formBuilder.group({
            title: [this.account.title, Validators.required],
            firstName: [this.account.firstName, Validators.required],
            lastName: [this.account.lastName, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // Getter conveniente para acceder fácilmente a los campos del formulario
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // Reinicia las alertas al enviar el formulario
        this.alertService.clear();

        // Detiene aquí si el formulario es inválido
        if (this.form.invalid) {
            return;
        }

        this.submitting = true;

        // Envía una solicitud de actualización de la cuenta al servicio
        this.accountService.update(this.account.id!, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Actualización exitosa', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }

    onDelete() {
        if (confirm('¿Estás seguro?')) {
            this.deleting = true;

            // Envía una solicitud de eliminación de la cuenta al servicio
            this.accountService.delete(this.account.id!)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Cuenta eliminada exitosamente', { keepAfterRouteChange: true });
                });
        }
    }
}
