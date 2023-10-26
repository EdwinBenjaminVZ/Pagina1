// Este archivo es requerido por karma.conf.js y carga recursivamente todos los archivos .spec y los archivos de marco (framework).

// Importa 'zone.js/testing' para configurar la zona de Angular para pruebas.
import 'zone.js/testing';

// Importa las funciones y clases de pruebas necesarias de Angular.
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Declara una constante 'require' que se utilizará para cargar archivos de prueba.
declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// Primero, inicializa el entorno de pruebas de Angular.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Luego, encontramos todas las pruebas.
const context = require.context('./', true, /\.spec\.ts$/);

// Y cargamos los módulos de pruebas.
context.keys().forEach(context);
