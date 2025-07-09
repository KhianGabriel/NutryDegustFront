import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para representar um Funcionário (baseada na sua entidade Funcionario do backend)
export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: string;
  dataContratacao: Date; // Usar tipo Date para datas
  dataCriacao: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private apiUrl = 'http://localhost:8080/funcionario'; // URL da API para funcionários

  constructor(private http: HttpClient) { }

  // Método para obter todos os funcionários
  getAllFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  // Método para excluir um funcionário
  excluirFuncionario(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}