    import { Injectable } from '@angular/core';
    import { Router } from '@angular/router';
    import { HttpClient } from '@angular/common/http';
    import { BehaviorSubject, Observable } from 'rxjs';
    import { map, finalize } from 'rxjs/operators';

    import { environment } from '@environments/environment'; // Importa la configuración del entorno
    import { Account } from '@app/_models'; // Importa el modelo personalizado de cuenta


    const baseUrl = `${environment.apiUrl}/accounts`; // URL base para las solicitudes a la API de cuentas

    @Injectable({ providedIn: 'root' }) // Define que este servicio estará disponible para toda la aplicación
    export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>; // Sujeto para gestionar el estado de la cuenta
    public account: Observable<Account | null>; // Observable para acceder al estado de la cuenta

    constructor(
        private router: Router, // Servicio de enrutamiento de Angular
        private http: HttpClient // Servicio para realizar solicitudes HTTP
    ) {
        this.accountSubject = new BehaviorSubject<Account | null>(null); // Inicializa el sujeto de cuenta
        this.account = this.accountSubject.asObservable(); // Crea el observable de cuenta
    }

    public get accountValue() {
        return this.accountSubject.value; // Método para obtener el valor actual de la cuenta
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account); // Almacena la cuenta en el sujeto de cuenta
                this.startRefreshTokenTimer(); // Inicia el temporizador para refrescar el token
                return account; // Retorna la cuenta autenticada
            }));
    }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe(); // Revoca el token de acceso
        this.stopRefreshTokenTimer(); // Detiene el temporizador de refresco del token
        this.accountSubject.next(null); // Borra el estado de la cuenta
        this.router.navigate(['/account/login']); // Redirige al usuario a la página de inicio de sesión
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account); // Almacena la cuenta actualizada
                this.startRefreshTokenTimer(); // Inicia el temporizador para refrescar el token
                return account; // Retorna la cuenta actualizada
            }));
        }
// Registro de un nuevo usuario
register(account: Account) {
    return this.http.post(`${baseUrl}/register`, account); // Realiza una solicitud POST para registrar un nuevo usuario.
}

// Verificación de la dirección de correo electrónico del usuario
verifyEmail(token: string) {
    return this.http.post(`${baseUrl}/verify-email`, { token }); // Realiza una solicitud POST para verificar la dirección de correo electrónico del usuario.
}

// Solicitud de restablecimiento de contraseña basada en la dirección de correo electrónico
forgotPassword(email: string) {
    return this.http.post(`${baseUrl}/forgot-password`, { email }); // Realiza una solicitud POST para solicitar el restablecimiento de contraseña basado en la dirección de correo electrónico.
}

// Validación del token de restablecimiento de contraseña
validateResetToken(token: string) {
    return this.http.post(`${baseUrl}/validate-reset-token`, { token }); // Realiza una solicitud POST para validar un token de restablecimiento de contraseña.
}

// Restablecimiento de contraseña
resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword }); // Realiza una solicitud POST para restablecer la contraseña.
}

// Obtener todos los usuarios (posiblemente solo accesible para administradores)
getAll() {
    return this.http.get<Account[]>(baseUrl); // Realiza una solicitud GET para obtener la lista de todos los usuarios.
}

// Obtener un usuario por su ID
getById(id: string) {
    return this.http.get<Account>(`${baseUrl}/${id}`); // Realiza una solicitud GET para obtener un usuario específico por su ID.
}

// Crear un nuevo usuario (posiblemente solo accesible para administradores)
create(params: any) {
    return this.http.post(baseUrl, params); // Realiza una solicitud POST para crear un nuevo usuario.
}

// Actualiza la información de un usuario específico
update(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params)
        .pipe(map((account: any) => {
            // Actualiza la cuenta actual si fue modificada
            if (account.id === this.accountValue?.id) {
                // Publica la cuenta actualizada a los suscriptores
                account = { ...this.accountValue, ...account };
                this.accountSubject.next(account);
            }
            return account; // Retorna la cuenta actualizada.
        }));
}

// Elimina un usuario por su ID
delete(id: string) {
    return this.http.delete(`${baseUrl}/${id}`)
        .pipe(finalize(() => {
            // Cierra automáticamente la sesión si se elimina el usuario conectado
            if (id === this.accountValue?.id)
                this.logout();
        }));
}

// Métodos auxiliares para manejar el token de actualización

private refreshTokenTimeout?: any;

private startRefreshTokenTimer() {
    // Analiza un objeto JSON desde el token JWT codificado en base64
    const jwtBase64 = this.accountValue!.jwtToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // Configura un temporizador para refrescar el token un minuto antes de que expire
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
}

private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout); // Detiene el temporizador de refresco del token
}
}
