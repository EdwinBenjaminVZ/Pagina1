import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioComponent } from './formulario.component';

// Comentario: Importa las clases ComponentFixture y TestBed del módulo de pruebas de Angular.

describe('FormularioComponent', () => {
  // Comentario: Comienza un bloque de descripción de pruebas unitarias para el componente FormularioComponent.

  let component: FormularioComponent;
  // Comentario: Declara una variable llamada component para almacenar una instancia del componente a probar.

  let fixture: ComponentFixture<FormularioComponent>;
  // Comentario: Declara una variable llamada fixture para almacenar una instancia de ComponentFixture relacionada con el componente.

  beforeEach(async () => {
    // Comentario: Inicia un bloque beforeEach que se ejecutará antes de cada prueba en este bloque de descripción.

    await TestBed.configureTestingModule({
      declarations: [ FormularioComponent ]
    }).compileComponents();
    // Comentario: Configura un módulo de prueba que declara el componente FormularioComponent y lo compila.

    fixture = TestBed.createComponent(FormularioComponent);
    // Comentario: Crea una instancia de ComponentFixture para el componente FormularioComponent.

    component = fixture.componentInstance;
    // Comentario: Obtiene una referencia a la instancia del componente FormularioComponent a partir de la instancia de ComponentFixture.

    fixture.detectChanges();
    // Comentario: Inicia la detección de cambios en el componente y actualiza la vista.

  });

  it('should create', () => {
    // Comentario: Inicia una prueba con el nombre 'should create'.

    expect(component).toBeTruthy();
    // Comentario: Utiliza la función expect para verificar que la variable component (instancia del componente) exista, lo que asegura que el componente se cree correctamente.

  });
});
