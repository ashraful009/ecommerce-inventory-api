export type UserRole = 'customer | admin'

export interface IUser {
    id: number;
    name: string;
    email: string;
    Role: UserRole;
    created_at: Date;
}

export interface ICreateUserPayload {
    name: string;
    email: string;
    role?: UserRole;
}

export interface IUpdateUserPayload{
    name?: string;
    email?: string;
    role?: UserRole;
}