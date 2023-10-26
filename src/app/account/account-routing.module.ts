// Importación de módulos y componentes necesarios
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';  // Importación del componente de diseño
import { LoginComponent } from './login.component';  // Importación del componente de inicio de sesión
import { RegisterComponent } from './register.component';  // Importación del componente de registro
import { VerifyEmailComponent } from './verify-email.component';  // Importación del componente de verificación de correo electrónico
import { ForgotPasswordComponent } from './forgot-password.component';  // Importación del componente de olvido de contraseña
import { ResetPasswordComponent } from './reset-password.component';  // Importación del componente de restablecimiento de contraseña

const routes: Routes = [  // Definición de las rutas del módulo de cuentas
    {
        path: '', component: LayoutComponent,  // Ruta raíz que utiliza el componente de diseño
        children: [  // Rutas secundarias que se cargan dentro del componente de diseño
            { path: 'login', component: LoginComponent },  // Ruta para el componente de inicio de sesión
            { path: 'register', component: RegisterComponent },  // Ruta para el componente de registro
            { path: 'verify-email', component: VerifyEmailComponent },  // Ruta para el componente de verificación de correo electrónico
            { path: 'forgot-password', component: ForgotPasswordComponent },  // Ruta para el componente de olvido de contraseña
            { path: 'reset-password', component: ResetPasswordComponent }  // Ruta para el componente de restablecimiento de contraseña
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // Configuración de las rutas utilizando el módulo de enrutamiento de Angular
    exports: [RouterModule]  // Exportación del módulo de rutas
})
export class AccountRoutingModule { }  // Declaración del módulo de enrutamiento de cuentas
