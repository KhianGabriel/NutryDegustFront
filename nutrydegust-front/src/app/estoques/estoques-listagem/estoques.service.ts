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
  }

  getEstoqueById(id: string): Observable<Estoque> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Estoque>(url)
  }

  excluirEstoque(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
  }
}