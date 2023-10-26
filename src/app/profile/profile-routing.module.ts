import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' de Angular
import { Routes, RouterModule } from '@angular/router'; // Importa el módulo 'Routes' y 'RouterModule' para la configuración de rutas

import { LayoutComponent } from './layout.component'; // Importa el componente 'LayoutComponent' para la disposición del perfil
import { DetailsComponent } from './details.component'; // Importa el componente 'DetailsComponent' para ver detalles del perfil
import { UpdateComponent } from './update.component'; // Importa el componente 'UpdateComponent' para actualizar el perfil

const routes: Routes = [
    // Define las rutas para el módulo del perfil
    {
        path: '', component: LayoutComponent,
        // Ruta raíz, usa el componente 'LayoutComponent' como diseño principal del perfil
        children: [
            // Rutas secundarias dentro del diseño
            { path: '', component: DetailsComponent },
            // Ruta predeterminada, muestra el componente 'DetailsComponent' para ver detalles del perfil
            { path: 'update', component: UpdateComponent }
            // Ruta 'update', muestra el componente 'UpdateComponent' para actualizar el perfil
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)], // Configura las rutas y las importa como rutas secundarias
    exports: [RouterModule] // Exporta el módulo de rutas
})
export class ProfileRoutingModule { }
