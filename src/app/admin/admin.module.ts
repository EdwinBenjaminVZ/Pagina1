import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' desde Angular
import { ReactiveFormsModule } from '@angular/forms'; // Importa el módulo 'ReactiveFormsModule' desde Angular
import { CommonModule } from '@angular/common'; // Importa el módulo 'CommonModule' desde Angular

import { AdminRoutingModule } from './admin-routing.module'; // Importa el módulo de enrutamiento 'AdminRoutingModule'
import { SubNavComponent } from './subnav.component'; // Importa el componente 'SubNavComponent'
import { LayoutComponent } from './layout.component'; // Importa el componente 'LayoutComponent'
import { OverviewComponent } from './overview.component'; // Importa el componente 'OverviewComponent'

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminRoutingModule
    ],
    // Declara los módulos e importaciones necesarios para este módulo

    declarations: [
        SubNavComponent,
        LayoutComponent,
        OverviewComponent
    ]
    // Declara los componentes que forman parte de este módulo
})
export class AdminModule { }
// Define y exporta el módulo 'AdminModule'
