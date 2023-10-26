// Importa la función 'enableProdMode' del módulo '@angular/core' para habilitar el modo de producción.
import { enableProdMode } from '@angular/core';

// Importa la función 'platformBrowserDynamic' del módulo '@angular/platform-browser-dynamic' para inicializar la aplicación Angular en un navegador web.
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Importa el módulo raíz de la aplicación, 'AppModule', desde el archivo './app/app.module'.
import { AppModule } from './app/app.module';

// Importa la configuración de entorno desde el archivo './environments/environment'.
import { environment } from './environments/environment';

// Si la aplicación se encuentra en modo de producción según la configuración del entorno...
if (environment.production) {
    // Habilita el modo de producción de Angular, lo que puede mejorar el rendimiento y la eficiencia de la aplicación.
    enableProdMode();
}

// Inicializa la aplicación Angular utilizando 'platformBrowserDynamic' y carga el módulo raíz 'AppModule'.
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err)); // Captura y maneja cualquier error que pueda ocurrir durante la inicialización de la aplicación.
