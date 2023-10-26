import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' desde Angular
import { Routes, RouterModule } from '@angular/router'; // Importa módulos para manejar rutas y enrutamiento

import { HomeComponent } from './home'; // Importa el componente 'Home' desde el archivo './home'
import { AuthGuard } from './_helpers'; // Importa el guardián de autenticación 'AuthGuard' desde el archivo './_helpers'
import { Role } from './_models'; // Importa la clase 'Role' desde el archivo './_models'
import { FormularioComponent } from './formulario/formulario.component'; // Importa el componente 'FormularioComponent' desde el archivo './formulario/formulario.component'

// Funciones para cargar módulos de forma dinámica
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

// Definición de las rutas de la aplicación
const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    // Ruta raíz que carga el componente 'Home' y requiere autenticación
    { path: 'account', loadChildren: accountModule },
    // Ruta 'account' que carga un módulo de forma dinámica
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    // Ruta 'profile' que carga un módulo de perfil de forma dinámica y requiere autenticación
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    // Ruta 'admin' que carga un módulo de administrador de forma dinámica y requiere autenticación con rol de administrador
    { path: 'formulario', component: FormularioComponent },
    // Nueva ruta 'formulario' que carga el componente 'FormularioComponent'
    { path: '**', redirectTo: '' }
    // Redirige a la ruta raíz si la ruta no coincide con ninguna ruta definida anteriormente
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    // Configura el módulo de rutas de la aplicación con las rutas definidas
    exports: [RouterModule]
    // Exporta el módulo de rutas para que esté disponible en otros componentes
})
export class AppRoutingModule { }
