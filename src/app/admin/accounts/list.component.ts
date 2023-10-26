import { Component, OnInit } from '@angular/core'; // Importa el módulo 'Component' y 'OnInit' desde Angular
import { first } from 'rxjs/operators'; // Importa el operador 'first' desde RxJS

import { AccountService } from '@app/_services'; // Importa el servicio 'AccountService' desde la ubicación especificada

@Component({ templateUrl: 'list.component.html' })
// Define un componente con una plantilla de vista en 'list.component.html'
export class ListComponent implements OnInit {
    accounts?: any[];
    // Declara una variable 'accounts' como un arreglo que contendrá datos de cuentas

    constructor(private accountService: AccountService) { }
    // Constructor del componente que inyecta el servicio 'AccountService'

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
        // En el método 'ngOnInit', se llama al servicio 'getAll' para obtener cuentas y se asigna el resultado a 'accounts'
    }

    deleteAccount(id: string) {
        const account = this.accounts!.find(x => x.id === id);
        // Busca una cuenta dentro del arreglo 'accounts' con un ID específico

        account.isDeleting = true;
        // Establece la propiedad 'isDeleting' de la cuenta como 'true', indicando que se está eliminando

        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts!.filter(x => x.id !== id)
            });
        // Llama al servicio 'delete' para eliminar una cuenta y actualiza la lista de cuentas después de la eliminación
    }
}
