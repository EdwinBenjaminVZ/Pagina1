import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup; // Declaración de una variable 'form' de tipo FormGroup
    id?: string; // Declaración de una variable 'id' opcional de tipo string
    title!: string; // Declaración de una variable 'title' de tipo string
    loading = false; // Inicialización de la variable 'loading' como falso
    submitting = false; // Inicialización de la variable 'submitting' como falso
    submitted = false; // Inicialización de la variable 'submitted' como falso

    constructor(
        private formBuilder: FormBuilder, // Inyección del servicio FormBuilder para construir formularios
        private route: ActivatedRoute, // Inyección del servicio ActivatedRoute para acceder a la ruta activa
        private router: Router, // Inyección del servicio Router para la navegación
        private accountService: AccountService, // Inyección del servicio AccountService
        private alertService: AlertService // Inyección del servicio AlertService para mostrar alertas
    ) { }

    ngOnInit() { // Método que se ejecuta al iniciar el componente
        this.id = this.route.snapshot.params['id']; // Obtiene el parámetro 'id' de la ruta actual

        this.form = this.formBuilder.group({ // Creación de un FormGroup llamado 'form'
            title: ['', Validators.required], // Campo 'title' inicializado con una cadena vacía y validación requerida
            firstName: ['', Validators.required], // Campo 'firstName' inicializado con una cadena vacía y validación requerida
            lastName: ['', Validators.required], // Campo 'lastName' inicializado con una cadena vacía y validación requerida
            email: ['', [Validators.required, Validators.email]], // Campo 'email' inicializado con una cadena vacía y validación de formato de correo electrónico
            role: ['', Validators.required], // Campo 'role' inicializado con una cadena vacía y validación requerida
            // password solo es requerido en modo de creación (no en edición)
            password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]], // Campo 'password' inicializado con una cadena vacía y validación de longitud mínima de 6 caracteres si no está en modo de edición
            confirmPassword: [''] // Campo 'confirmPassword' inicializado con una cadena vacía
        }, {
            validator: MustMatch('password', 'confirmPassword') // Validación personalizada para asegurarse de que 'password' y 'confirmPassword' coincidan
        });

        this.title = 'Create Account'; // Título de la página para agregar una cuenta
        if (this.id) {
            // modo de edición
            this.title = 'Edit Account'; // Título de la página para editar una cuenta
            this.loading = true; // Establece 'loading' en verdadero durante la carga de datos de la cuenta existente
            this.accountService.getById(this.id) // Obtiene los datos de la cuenta existente por su ID
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x); // Rellena el formulario con los datos de la cuenta
                    this.loading = false; // Establece 'loading' en falso una vez que se cargan los datos
                });
        }
    }

    // Getter de conveniencia para acceder fácilmente a los campos del formulario
    get f() { return this.form.controls; }

    onSubmit() {
        // Marcar el formulario como enviado
        this.submitted = true;
    
        // Limpiar alertas previas al enviar el formulario
        this.alertService.clear();
    
        // Detener el proceso si el formulario es inválido
        if (this.form.invalid) {
            return;
        }
    
        // Establecer la variable de envío a verdadera
        this.submitting = true;
    
        // Crear o actualizar la cuenta basándose en el parámetro 'id'
        let saveAccount;
        let message: string;
        if (this.id) {
            // Si 'id' existe, actualizar la cuenta
            saveAccount = () => this.accountService.update(this.id!, this.form.value);
            message = 'Cuenta actualizada';
        } else {
            // Si 'id' no existe, crear una nueva cuenta
            saveAccount = () => this.accountService.create(this.form.value);
            message = 'Cuenta creada';
        }
    
        // Realizar la operación de creación o actualización de la cuenta
        saveAccount()
            .pipe(first())
            .subscribe({
                next: () => {
                    // Mostrar un mensaje de éxito y redirigir al usuario a la lista de cuentas
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/accounts');
                },
                error: error => {
                    // Manejar errores y mostrar alertas de error
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
}