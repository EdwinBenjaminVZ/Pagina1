import { NgModule, APP_INITIALIZER } from '@angular/core'; // Importa los módulos necesarios de Angular
import { BrowserModule } from '@angular/platform-browser'; // Importa el módulo para aplicaciones web
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa los módulos para formularios
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importa los módulos para hacer solicitudes HTTP

// Importa el proveedor para crear una falsa capa de backend (utilizada para pruebas)
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module'; // Importa el módulo de enrutamiento
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers'; // Importa los interceptores para autenticación y manejo de errores
import { AccountService } from './_services'; // Importa el servicio de cuentas
import { AppComponent } from './app.component'; // Importa el componente raíz
import { AlertComponent } from './_components'; // Importa el componente de alertas
import { HomeComponent } from './home'; // Importa el componente de inicio
import { FormularioComponent } from './formulario/formulario.component'; // Importa el componente de formulario

@NgModule({
    imports: [
        BrowserModule, // Configura el módulo para aplicaciones web en el navegador
        ReactiveFormsModule, // Configura el módulo para formularios reactivos
        HttpClientModule, // Configura el módulo para hacer solicitudes HTTP
        FormsModule, // Configura el módulo para formularios
        AppRoutingModule // Configura el módulo de enrutamiento
    ],
    declarations: [
        AppComponent, // Declara el componente raíz
        AlertComponent, // Declara el componente de alertas
        HomeComponent, // Declara el componente de inicio
        FormularioComponent // Declara el componente de formulario
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] }, // Proveedor para ejecutar una función de inicialización al cargar la aplicación
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, // Proveedor para el interceptor de JWT (autenticación)
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, // Proveedor para el interceptor de errores

        // Proveedor utilizado para crear una falsa capa de backend (utilizada para pruebas)
        fakeBackendProvider
    ],
    bootstrap: [AppComponent] // Configura el componente raíz de la aplicación
})
export class AppModule { }
