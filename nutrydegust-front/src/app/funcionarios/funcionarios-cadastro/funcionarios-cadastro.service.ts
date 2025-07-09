import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: string;
  dataContratacao: Date; 
  dataCriacao: Date;
}

export interface RequestFuncionarioCreate {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: string;
  dataContratacao: string; 
}

@Injectable({
  providedIn: 'root'
})
export class FuncionariosCadastroService { 

  private apiUrl = 'http://localhost:8080/funcionario';

  constructor(private http: HttpClient) { }

  cadastrarFuncionario(funcionario: RequestFuncionarioCreate): Observable<void> {
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