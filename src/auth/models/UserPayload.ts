export interface UserPayload {
  sub: number;
  email: string;
  name: string;
  roles: [];
  iat?: number;
  exp?: number;
}
