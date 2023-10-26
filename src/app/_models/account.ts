import { Role } from './role';
// Clase que representa una cuenta de usuario
export class Account {
    id?: string; // Identificador único de la cuenta
    title?: string; // Título (por ejemplo, "Mr", "Mrs", etc.)
    firstName?: string; // Nombre del usuario
    lastName?: string; // Apellido del usuario
    email?: string; // Dirección de correo electrónico de la cuenta
    role?: Role; // Rol de usuario asociado a la cuenta
    jwtToken?: string; // Token JWT (JSON Web Token) utilizado para autenticación
}
