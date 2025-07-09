import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Estoque {
  id: string;
  nome: string;
  dataCriacao: Date;
  categoria: string; // Adicionado para filtro
  quantidadeItens: number; // Adicionado para condição de exclusão e talvez detalhes
  status: string; // Adicionado para completude
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private apiUrl = 'http://localhost:8080/estoque';

  constructor(private http: HttpClient) { }

  getAllEstoques(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEstoqueById(id: string): Observable<Estoque> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Estoque>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  excluirEstoque(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
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