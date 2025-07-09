import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface FuncionarioCadastro {
  id: string;
  nome: string;
  cargo: string;
  cpf: string;
  salario: number;
  cargaHoraria: number;
  atividade: string;
  email: string;
  telefone: string;
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  bairro: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionariosCadastroService { 

  private apiUrl = 'http://localhost:8080/funcionario';

  constructor(private http: HttpClient) { }

  cadastrarFuncionario(funcionario: FuncionarioCadastro): Observable<void> {
    return this.http.post<void>(this.apiUrl, funcionario)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Um erro desconhecido ocorreu!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = `Erro do servidor: ${error.error.message}`;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = `Erro do servidor: ${error.error}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => error);
  }
}