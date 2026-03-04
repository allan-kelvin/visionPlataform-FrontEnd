export interface User {
  id: number;
  nome: string;
  email: string;
  roleId: number;
  role: string;
  ativo: boolean;
}

export interface CreateUser {
  nome: string;
  email: string;
  senha: string;
  roleId: number;
}

export interface UpdateUser {
  nome: string;
  roleId: number;
  ativo: boolean;
}
