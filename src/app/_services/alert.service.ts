// Importación de módulos y componentes necesarios
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertOptions, AlertType } from '@app/_models';  // Importación de modelos de alerta personalizados

@Injectable({ providedIn: 'root' })  // Decorador que marca la clase como un servicio y lo registra en el sistema de inyección de dependencias
export class AlertService {
    private subject = new Subject<Alert>();  // Objeto Subject que emite alertas
    private defaultId = 'default-alert';  // ID predeterminado para las alertas

    // Habilita la suscripción a un observable de alertas
    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));  // Filtra las alertas por ID específico
    }

    // Métodos de conveniencia para mostrar alertas de diferentes tipos
    success(message: string, options?: AlertOptions) {
        this.alert(new Alert({ ...options, type: AlertType.Success, message }));  // Muestra una alerta de éxito
    }

    error(message: string, options?: AlertOptions) {
        this.alert(new Alert({ ...options, type: AlertType.Error, message }));  // Muestra una alerta de error
    }

    info(message: string, options?: AlertOptions) {
        this.alert(new Alert({ ...options, type: AlertType.Info, message }));  // Muestra una alerta informativa
    }

    warn(message: string, options?: AlertOptions) {
        this.alert(new Alert({ ...options, type: AlertType.Warning, message }));  // Muestra una alerta de advertencia
    }

    // Método principal para mostrar alertas
    alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;  // Asigna un ID predeterminado si no se proporciona
        alert.autoClose = (alert.autoClose === undefined ? true : alert.autoClose);  // Habilita el cierre automático de la alerta si no se especifica
        this.subject.next(alert);  // Emite la alerta a través del objeto Subject
    }

    // Método para borrar alertas
    clear(id = this.defaultId) {
        this.subject.next(new Alert({ id }));  // Emite una alerta vacía con el ID específico para borrarla
    }
}
