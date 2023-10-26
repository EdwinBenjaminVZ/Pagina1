import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' de Angular
import { ReactiveFormsModule } from '@angular/forms'; // Importa el módulo 'ReactiveFormsModule' para formularios reactivos
import { CommonModule } from '@angular/common'; // Importa el módulo 'CommonModule' de Angular

import { ProfileRoutingModule } from './profile-routing.module'; // Importa el módulo de enrutamiento para el perfil
import { LayoutComponent } from './layout.component'; // Importa el componente 'LayoutComponent' para el perfil
import { DetailsComponent } from './details.component'; // Importa el componente 'DetailsComponent' para ver detalles del perfil
import { UpdateComponent } from './update.component'; // Importa el componente 'UpdateComponent' para actualizar el perfil

@NgModule({
    imports: [
        CommonModule, // Importa el módulo 'CommonModule'
        ReactiveFormsModule, // Importa el módulo 'ReactiveFormsModule' para formularios reactivos
        ProfileRoutingModule // Importa el módulo de enrutamiento del perfil
    ],
    declarations: [
        LayoutComponent, // Declaración del componente 'LayoutComponent'
        DetailsComponent, // Declaración del componente 'DetailsComponent'
        UpdateComponent // Declaración del componente 'UpdateComponent'
    ]
})
export class ProfileModule { }
