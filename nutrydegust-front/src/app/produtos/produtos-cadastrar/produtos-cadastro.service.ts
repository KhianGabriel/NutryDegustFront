import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ProdutoCadastro {
  nome: string;
  descricao: string;
  precoVenda: number;
  precoCompra: number;
  dataValidade: Date;
  categoria: string;
  quantidadeEstoque: number;
  loteAtual: string;
  nomeFornecedor: string;
  nomeEstoque: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoCadastrarService {

  private apiUrl = 'http://localhost:8080/produto';
  constructor(private http: HttpClient) { }

  cadastrarProduto(produto: ProdutoCadastro): Observable<void> {
    return this.http.post<void>(this.apiUrl, produto)
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