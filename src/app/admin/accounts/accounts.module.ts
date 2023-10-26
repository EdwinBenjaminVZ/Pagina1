import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';  // Importa el módulo de enrutamiento de cuentas
import { ListComponent } from './list.component';  // Importa el componente de lista de cuentas
import { AddEditComponent } from './add-edit.component';  // Importa el componente para agregar/editar cuentas

@NgModule({
    imports: [
        CommonModule,  // Importa el módulo CommonModule para características comunes
        ReactiveFormsModule,  // Importa el módulo ReactiveFormsModule para trabajar con formularios reactivos
        AccountsRoutingModule  // Importa el módulo de enrutamiento de cuentas para la navegación
    ],
    declarations: [
        ListComponent,  // Declara el componente de lista de cuentas
        AddEditComponent  // Declara el componente para agregar/editar cuentas
    ]
})
export class AccountsModule { }  // Define y exporta el módulo AccountsModule
