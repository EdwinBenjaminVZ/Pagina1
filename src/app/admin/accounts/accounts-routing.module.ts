import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list.component';  // Importa el componente de lista de cuentas
import { AddEditComponent } from './add-edit.component';  // Importa el componente para agregar/editar cuentas

const routes: Routes = [
    { path: '', component: ListComponent },  // Ruta para mostrar la lista de cuentas
    { path: 'add', component: AddEditComponent },  // Ruta para agregar una nueva cuenta
    { path: 'edit/:id', component: AddEditComponent }  // Ruta para editar una cuenta existente, se espera un parámetro 'id'
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // Configura las rutas para ser importadas como parte del módulo
    exports: [RouterModule]  // Exporta el módulo de enrutamiento
})
export class AccountsRoutingModule { }  // Define y exporta el módulo de enrutamiento de cuentas
