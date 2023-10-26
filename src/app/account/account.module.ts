// Importación de módulos y componentes necesarios
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';  // Importación del módulo de enrutamiento de cuentas
import { LayoutComponent } from './layout.component';  // Importación del componente de diseño
import { LoginComponent } from './login.component';  // Importación del componente de inicio de sesión
import { RegisterComponent } from './register.component';  // Importación del componente de registro
import { VerifyEmailComponent } from './verify-email.component';  // Importación del componente de verificación de correo electrónico
import { ForgotPasswordComponent } from './forgot-password.component';  // Importación del componente de olvido de contraseña
import { ResetPasswordComponent } from './reset-password.component';  // Importación del componente de restablecimiento de contraseña

@NgModule({
    imports: [
        CommonModule,  // Módulo de uso común
        ReactiveFormsModule,  // Módulo para el uso de formularios reactivos
        AccountRoutingModule  // Módulo de enrutamiento de cuentas
    ],
    declarations: [  // Declaración de componentes que pertenecen a este módulo
        LayoutComponent,  // Componente de diseño
        LoginComponent,  // Componente de inicio de sesión
        RegisterComponent,  // Componente de registro
        VerifyEmailComponent,  // Componente de verificación de correo electrónico
        ForgotPasswordComponent,  // Componente de olvido de contraseña
        ResetPasswordComponent  // Componente de restablecimiento de contraseña
    ]
})
export class AccountModule { }  // Declaración del módulo de cuentas
