import { Component } from '@angular/core'; // Importa el módulo 'Component' desde Angular core

import { AccountService } from './_services'; // Importa el servicio 'AccountService' desde el archivo './_services'
import { Account, Role } from './_models'; // Importa las clases 'Account' y 'Role' desde el archivo './_models'

@Component({ selector: 'app-root', templateUrl: 'app.component.html' }) // Define un componente de Angular con un selector y una plantilla HTML asociada
export class AppComponent {
    Role = Role; // Asigna la clase 'Role' a la propiedad 'Role' para que esté disponible en la plantilla
    account?: Account | null; // Declara una variable 'account' que puede ser de tipo 'Account' o nula

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x); // Suscribe al servicio de cuentas para obtener el valor actual y asignarlo a 'account'
    }

    logout() {
        this.accountService.logout(); // Llama al método 'logout' del servicio de cuentas para cerrar sesión
    }
}
