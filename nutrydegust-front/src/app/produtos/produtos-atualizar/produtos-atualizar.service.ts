import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Produto {
  id: string;
  nome: string;
  nomeBusca: string;
  descricao: string;
  precoVenda: number;
  precoCompra: number;
  dataValidade: Date;
  categoria: string;
  quantidadeEmEstoque: number;
  loteAtual: string;
  dataCriacao: Date;
  nomeFornecedor: string;
  nomeEstoque: string;
  codigo: string; // Adicionado 'codigo'
}

export interface RequestProdutoPut {
  nome: string;
  descricao?: string;
  precoVenda: number;
  precoCompra: number;
  dataValidade: string;
  categoria: string;
  nomeFornecedor: string;
  nomeEstoque: string;
  quantidadeEmEstoque: number;
  loteAtual: string;
  codigo: string; // Adicionado 'codigo'
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoAtualizarService {

  private apiUrl = 'http://localhost:8080/produto';

  constructor(private http: HttpClient) { }

  getProdutoById(id: string): Observable<Produto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Produto>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  atualizarProduto(id: string, produto: RequestProdutoPut): Observable<Produto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Produto>(url, produto)
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