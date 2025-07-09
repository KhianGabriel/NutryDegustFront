import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstoqueAtualizar {
  //id: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private apiUrl = 'http://localhost:8080/estoque'; 

  constructor(private http: HttpClient) { }

  getEstoqueById(id: string): Observable<EstoqueAtualizar> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<EstoqueAtualizar>(url);
  }

  atualizarEstoque(id: string, estoque: EstoqueAtualizar): Observable<EstoqueAtualizar> { 
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<EstoqueAtualizar>(url, estoque);
  }
}