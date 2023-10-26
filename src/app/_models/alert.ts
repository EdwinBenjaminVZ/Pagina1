// Clase que representa un objeto de alerta
export class Alert {
    id?: string; // Identificador único de la alerta
    type?: AlertType; // Tipo de la alerta (éxito, error, información, advertencia)
    message?: string; // Mensaje de la alerta
    autoClose?: boolean; // Indica si la alerta se cerrará automáticamente
    keepAfterRouteChange?: boolean; // Indica si la alerta debe mantenerse después de un cambio de ruta
    fade?: boolean; // Indica si la alerta debe desvanecerse

    // Constructor de la clase Alert que acepta un objeto de inicialización parcial
    constructor(init?: Partial<Alert>) {
        Object.assign(this, init); // Asigna las propiedades del objeto de inicialización parcial a esta instancia de Alert.
    }
}

// Enumeración que define los tipos de alerta posibles
export enum AlertType {
    Success, // Éxito
    Error, // Error
    Info, // Información
    Warning // Advertencia
}

// Clase que representa opciones para configurar una alerta
export class AlertOptions {
    id?: string; // Identificador único de la alerta
    autoClose?: boolean; // Indica si la alerta se cerrará automáticamente
    keepAfterRouteChange?: boolean; // Indica si la alerta debe mantenerse después de un cambio de ruta
}
