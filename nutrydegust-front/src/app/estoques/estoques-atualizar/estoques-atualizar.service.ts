import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fornecedor {
  id: string;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private apiUrl = 'http://localhost:8080/estoque'; // URL da API

  constructor(private http: HttpClient) { }

  getAllFornecedor(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  excluirFornecedor(id: string): Observable<void> {
      const url = `${this.apiUrl}/${id}`; // URL do endpoint de exclusão
      return this.http.delete<void>(url);
  }  
}
