import { NgModule } from '@angular/core'; // Importa el módulo 'NgModule' de Angular
import { FormsModule } from '@angular/forms'; // Importa el módulo 'FormsModule' para la manipulación de formularios



@NgModule({
  declarations: [
    // ... tus componentes (otros componentes pueden estar aquí)
  ],
  imports: [
    // ... otros módulos (otros módulos pueden estar aquí)
    FormsModule, // Agrega el módulo 'FormsModule' aquí para habilitar el uso de formularios
  ],
  providers: [],
  // bootstrap: [AppComponent], (posiblemente se omite si no se ha definido un componente principal)
})
export class AppModule { }

import { Component } from '@angular/core'; // Importa el decorador 'Component' desde Angular

@Component({
  selector: 'app-formulario', // Define el selector del componente
  templateUrl: './formulario.component.html', // Especifica la plantilla HTML asociada
  styleUrls: ['./formulario.component.css'] // Especifica las hojas de estilo asociadas
})
export class FormularioComponent {
  nombre: string = ''; // Inicializa la variable 'nombre' como una cadena vacía
  apellido: string = ''; // Inicializa la variable 'apellido' como una cadena vacía
  oficio: string = ''; // Inicializa la variable 'oficio' como una cadena vacía
  genero: string = ''; // Inicializa la variable 'genero' como una cadena vacía
  ciudad: string = ''; // Inicializa la variable 'ciudad' como una cadena vacía

  datosGuardados: string = ''; // Inicializa la variable 'datosGuardados' como una cadena vacía

  guardarDatos() {
    // Define una función 'guardarDatos' que se ejecuta al presionar un botón
    this.datosGuardados = `
      Nombre: ${this.nombre}
      Apellido: ${this.apellido}
      Oficio: ${this.oficio}
      Género: ${this.genero}
      Ciudad: ${this.ciudad}
    `;
  }
}



