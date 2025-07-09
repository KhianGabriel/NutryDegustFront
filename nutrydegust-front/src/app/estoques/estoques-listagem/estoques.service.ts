import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estoque {
  id: string;
  nome: string; 
  dataCriacao: Date;
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

  excluirEstoque(id: string): Observable<void> { 
    const url = `${this.apiUrl}/${id}`; 
    return this.http.delete<void>(url);
  }
}