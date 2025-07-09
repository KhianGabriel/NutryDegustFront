import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estoque {
  id: string;
  nome: string;
}

export interface RequestEstoqueCreate {
  nome: string;
}

export interface RequestEstoquePut {
  nome: string;
}


@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private apiUrl = 'http://localhost:8080/estoque'; 

  constructor(private http: HttpClient) { }

  getAllEstoques(): Observable<Estoque[]> { 
    return this.http.get<Estoque[]>(this.apiUrl);
  }

  getEstoqueById(id: string): Observable<Estoque> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Estoque>(url);
  }

  cadastrarEstoque(estoque: RequestEstoqueCreate): Observable<void> {
    return this.http.post<void>(this.apiUrl, estoque);
  }

  atualizarEstoque(id: string, estoque: RequestEstoquePut): Observable<Estoque> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Estoque>(url, estoque);
  }

  excluirEstoque(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}