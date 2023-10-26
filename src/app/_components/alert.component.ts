import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '@app/_models';
import { AlertService } from '@app/_services';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    // Define propiedades de entrada, id y fade, para el componente.
    @Input() id = 'default-alert';
    @Input() fade = true;

    // Define una matriz para almacenar las alertas.
    alerts: Alert[] = [];
    alertSubscription!: Subscription;
    routeSubscription!: Subscription;

    // Inicializa el componente con el servicio de enrutamiento y el servicio de alerta.
    constructor(private router: Router, private alertService: AlertService) { }

    ngOnInit() {
        // Suscríbete a las notificaciones de alerta.
        this.alertSubscription = this.alertService.onAlert(this.id)
            .subscribe(alert => {
                // Borra las alertas cuando se recibe una alerta vacía.
                if (!alert.message) {
                    // Filtra las alertas que no tienen la bandera 'keepAfterRouteChange'.
                    this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                    // Quita la bandera 'keepAfterRouteChange' en el resto.
                    this.alerts.forEach(x => delete x.keepAfterRouteChange);
                    return;
                }

                // Agrega la alerta a la matriz.
                this.alerts.push(alert);

                // Cierra automáticamente la alerta si es necesario.
                if (alert.autoClose) {
                    setTimeout(() => this.removeAlert(alert), 3000);
                }
            });

        // Borra las alertas al cambiar de ubicación.
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });
    }

    ngOnDestroy() {
        // Desuscribe para evitar pérdida de memoria.
        this.alertSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    removeAlert(alert: Alert) {
        // Verifica si la alerta ya se eliminó para evitar errores en el cierre automático.
        if (!this.alerts.includes(alert)) return;

        if (this.fade) {
            // Desvanece la alerta.
            alert.fade = true;

            // Elimina la alerta después de que se desvanezca.
            setTimeout(() => {
                this.alerts = this.alerts.filter(x => x !== alert);
            }, 250);
        } else {
            // Elimina la alerta.
            this.alerts = this.alerts.filter(x => x !== alert);
        }
    }

    cssClasses(alert: Alert) {
        if (!alert) return;

        // Define clases CSS para diferentes tipos de alerta y animación.
        const classes = ['alert', 'alert-dismissible', 'mt-4', 'container'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        }

        if (alert.type !== undefined) {
            classes.push(alertTypeClass[alert.type]);
        }

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }
}
