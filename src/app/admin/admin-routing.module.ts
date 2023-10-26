import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' desde Angular
import { Routes, RouterModule } from '@angular/router'; // Importa los módulos 'Routes' y 'RouterModule' para la gestión de rutas

import { SubNavComponent } from './subnav.component'; // Importa el componente 'SubNavComponent'
import { LayoutComponent } from './layout.component'; // Importa el componente 'LayoutComponent'
import { OverviewComponent } from './overview.component'; // Importa el componente 'OverviewComponent'

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
// Define una función para cargar de manera dinámica el módulo 'AccountsModule' cuando sea necesario

const routes: Routes = [
    { path: '', component: SubNavComponent, outlet: 'subnav' },
    // Define una ruta vacía que utiliza el componente 'SubNavComponent' y se muestra en el outlet 'subnav'

    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverviewComponent },
            // Define una ruta vacía que utiliza el componente 'OverviewComponent'

            { path: 'accounts', loadChildren: accountsModule }
            // Define una ruta 'accounts' que carga de manera dinámica el módulo 'AccountsModule'
        ]
    }
    // Define rutas anidadas bajo el componente 'LayoutComponent'
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    // Configura las rutas y las importa como rutas secundarias

    exports: [RouterModule]
    // Exporta el módulo de enrutamiento
})
export class AdminRoutingModule { }
// Define y exporta el módulo de enrutamiento 'AdminRoutingModule'
