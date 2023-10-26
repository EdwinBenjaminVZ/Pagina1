import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

// Array en el almacenamiento local para cuentas
const accountsKey = 'angular-15-signup-verification-boilerplate-accounts';
let accounts: any[] = JSON.parse(localStorage.getItem(accountsKey)!) || [];


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) { }
// Intercepta las solicitudes HTTP y emula un backend falso para pruebas
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;

        return handleRoute();

        function handleRoute() {
            // Maneja las rutas según el caso
            switch (true) {
                // Autenticación de usuario
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                // Renovación del token JWT
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                // Revocación del token
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                // Registro de usuario
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                // Verificación del correo electrónico del usuario
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                // Restablecimiento de contraseña
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                // Validación del token de restablecimiento de contraseña
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                // Restablecimiento de contraseña
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                // Obtener todas las cuentas
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                // Obtener una cuenta por ID
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                // Crear una cuenta
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                // Actualizar una cuenta
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                // Eliminar una cuenta
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();
                default:
                    // Pasar cualquier solicitud que no se maneje específicamente arriba
                    return next.handle(request);
            }    
        }

         // Funciones de rutas

        // Función para la autenticación
        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password &&x.isVerified);
            
            if (!account) return error('El correo o la contraseña son incorrectos');

            // Agregar un token de renovación a la cuenta
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        // Función para renovar el token JWT
        function refreshToken() {
            const refreshToken =  getRefreshToken();
            
            if (!refreshToken) return unauthorized();

            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            
            if (!account) return unauthorized();

            // Reemplazar el antiguo token de renovación por uno nuevo y guardar
            account.refreshTokens = account.refreshTokens.filter((x: any) => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
            
            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            
            // Revocar el token y guardar
            account.refreshTokens = account.refreshTokens.filter((x: any) => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok();
        }

        // Función para el registro de usuario
        function register() {
            const account = body;

            if (accounts.find(x => x.email === account.email)) {
                // Mostrar un mensaje indicando que el correo ya está registrado
                setTimeout(() => {
                    alertService.info(`
                        <h4>Correo Electrónico Ya Registrado</h4>
                        <p>Tu correo ${account.email} ya está registrado.</p>
                        <p>Si no conoces tu contraseña, visita la página <a href="${location.origin}/account/forgot-password">olvidé mi contraseña</a>.</p>
                        <div><strong>NOTA:</strong> El backend falso muestra este "correo" para que puedas hacer pruebas sin una API real. Un backend real enviaría un correo electrónico real.</div>
                    `, { autoClose: false });
                }, 1000);

                // Siempre devuelve una respuesta "ok()" para prevenir la enumeración de correos electrónicos
                return ok();
            }

            // Asigna un ID de cuenta y algunas otras propiedades y luego guarda
            account.id = newAccountId();
            if (account.id === 1) {
                // La primera cuenta registrada es un administrador
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            // Mostrar un correo de verificación en un mensaje de alerta
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(`
                    <h4>Correo de Verificación</h4>
                    <p>¡Gracias por registrarte!</p>
                    <p>Por favor, haz clic en el enlace de abajo para verificar tu dirección de correo electrónico:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTA:</strong> El backend falso muestra este "correo" para que puedas hacer pruebas sin una API real. Un backend real enviaría un correo electrónico real.</div>
                `, { autoClose: false });
            }, 1000);

            return ok();
        };
        function verifyEmail() {
            const { token } = body;
            // Busca la cuenta que coincida con el token de verificación
            const account = accounts.find(x => !!x.verificationToken && x.verificationToken === token);
            
            if (!account) return error('Verification failed');
            
            // Establece la bandera "isVerified" en verdadero si el token es válido
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function forgotPassword() {
            const { email } = body;
            // Busca la cuenta que coincida con el correo electrónico
            const account = accounts.find(x => x.email === email);
            
            // Si la cuenta no existe, siempre devuelve una respuesta "ok()" para prevenir la enumeración de correos electrónicos
            if (!account) return ok();
            
            // Crea un token de reinicio que expira después de 24 horas
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // Muestra un correo de restablecimiento de contraseña en un mensaje de alerta
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(`
                    <h4>Correo de Restablecimiento de Contraseña</h4>
                    <p>Por favor, haz clic en el enlace de abajo para restablecer tu contraseña; el enlace será válido por 1 día:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTA:</strong> El backend falso muestra este "correo" para que puedas hacer pruebas sin una API real. Un backend real enviaría un correo electrónico real.</div>
                `, { autoClose: false });
            }, 1000);
        
            return ok();
        }
        
        function validateResetToken() {
            const { token } = body;
            // Busca la cuenta que tiene un token de reinicio válido
            const account = accounts.find(x =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
            
            if (!account) return error('Invalid token');
            
            return ok();
        }
        
        function resetPassword() {
            const { token, password } = body;
            // Busca la cuenta que tiene un token de reinicio válido
            const account = accounts.find(x =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
            
            if (!account) return error('Invalid token');
            
            // Actualiza la contraseña y elimina el token de reinicio
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok();
        }
        
        function getAccounts() {
            // Verifica si el usuario está autenticado
            if (!isAuthenticated()) return unauthorized();
            
            // Devuelve una respuesta "ok()" con una lista de cuentas, solo incluyendo detalles básicos
            return ok(accounts.map(x => basicDetails(x)));
        }
        
        function getAccountById() {
            // Verifica si el usuario está autenticado
            if (!isAuthenticated()) return unauthorized();
        
            // Encuentra la cuenta por su ID en la URL
            let account = accounts.find(x => x.id === idFromUrl());
        
            // Las cuentas de usuario pueden obtener su propio perfil, y las cuentas de administrador pueden obtener todos los perfiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
        
            // Devuelve una respuesta "ok()" con detalles básicos de la cuenta
            return ok(basicDetails(account));
        }
        
        function createAccount() {
            // Verifica si el usuario está autorizado como administrador
            if (!isAuthorized(Role.Admin)) return unauthorized();
        
            const account = body;
            
            // Verifica si ya existe una cuenta con el mismo correo electrónico
            if (accounts.find(x => x.email === account.email)) {
                return error(`Gmail ${account.email} Ya se encuentra Registrado`);
            }
        
            // Asigna un ID a la cuenta y otras propiedades, luego la guarda
            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // Devuelve una respuesta "ok()"
            return ok();
        }
        
        function updateAccount() {
            // Verifica si el usuario está autenticado
            if (!isAuthenticated()) return unauthorized();
        
            let params = body;
            let account = accounts.find(x => x.id === idFromUrl());
        
            // Las cuentas de usuario pueden actualizar su propio perfil, y las cuentas de administrador pueden actualizar todos los perfiles
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
        
            // Solo actualiza la contraseña si se incluye
            if (!params.password) {
                delete params.password;
            }
            // No guarda la confirmación de la contraseña
            delete params.confirmPassword;
        
            // Actualiza y guarda la cuenta
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // Devuelve una respuesta "ok()" con detalles básicos de la cuenta actualizada
            return ok(basicDetails(account));
        }
        
        function deleteAccount() {
            // Verifica si el usuario está autenticado
            if (!isAuthenticated()) return unauthorized();
        
            let account = accounts.find(x => x.id === idFromUrl());
        
            // Las cuentas de usuario pueden eliminar su propia cuenta, y las cuentas de administrador pueden eliminar cualquier cuenta
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
        
            // Elimina la cuenta y la guarda
            accounts = accounts.filter(x => x.id !== idFromUrl());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            // Devuelve una respuesta "ok()"
            return ok();
        }
        
        
        // Funciones de ayuda

function ok(body?: any) {
    // Devuelve una respuesta HTTP 200 con un cuerpo opcional
    return of(new HttpResponse({ status: 200, body }))
        .pipe(delay(500)); // Retrasa el observable para simular una llamada a la API del servidor
}

function error(message: string) {
    // Devuelve un error con un mensaje especificado
    return throwError(() => ({ error: { message } }))
        .pipe(materialize(), delay(500), dematerialize()); // Llama a materialize y dematerialize para asegurar un retraso incluso si se lanza un error (https://github.com/Reactive-Extensions/RxJS/issues/648);
}

function unauthorized() {
    // Devuelve un error 401 (No autorizado) con un mensaje
    return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
        .pipe(materialize(), delay(500), dematerialize());
}

function basicDetails(account: any) {
    // Extrae detalles básicos de una cuenta
    const { id, title, firstName, lastName, email, role, dateCreated, isVerified } = account;
    return { id, title, firstName, lastName, email, role, dateCreated, isVerified };
}

function isAuthenticated() {
    // Verifica si el usuario está autenticado llamando a currentAccount()
    return !!currentAccount();
}

function isAuthorized(role: any) {
    // Verifica si el usuario actual tiene el rol especificado
    const account = currentAccount();
    if (!account) return false;
    return account.role === role;
}

function idFromUrl() {
    // Obtiene el ID de la URL actual
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
}

function newAccountId() {
    // Genera un nuevo ID para una cuenta
    return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
}

function currentAccount() {
    // Comprueba si hay un token JWT en el encabezado de autenticación
    const authHeader = headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;

    // Comprueba si el token ha caducado
    const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
    const tokenExpired = Date.now() > (jwtToken.exp * 1000);
    if (tokenExpired) return;

    // Encuentra la cuenta correspondiente al ID del token
    const account = accounts.find(x => x.id === jwtToken.id);
    return account;
}

function generateJwtToken(account: any) {
    // Crea un token que caduca en 15 minutos
    const tokenPayload = { 
        exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
        id: account.id
    }
    return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
}

function generateRefreshToken() {
    const token = new Date().getTime().toString();

    // Agrega una cookie de token que caduca en 7 días
    const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
    document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;

    return token;
}

function getRefreshToken() {
    // Obtiene el token de actualización de las cookies
    return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
}}}

// Configuración del proveedor fakeBackendProvider

export let fakeBackendProvider = {
    // Utiliza un backend falso en lugar del servicio HTTP para el desarrollo sin servidor real
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
