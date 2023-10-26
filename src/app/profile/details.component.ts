import { Component } from '@angular/core'; // Importa el decorador 'Component' desde Angular

import { AccountService } from '@app/_services'; // Importa el servicio 'AccountService' desde la ruta especificada

@Component({ templateUrl: 'details.component.html' })
// Define un componente llamado 'DetailsComponent' con una plantilla HTML asociada

export class DetailsComponent {
    account = this.accountService.accountValue; 
    // Crea una propiedad 'account' que se inicializa con el valor de 'accountValue' del servicio 'AccountService'

    constructor(private accountService: AccountService) { }
    // Constructor del componente que inyecta el servicio 'AccountService'
}
