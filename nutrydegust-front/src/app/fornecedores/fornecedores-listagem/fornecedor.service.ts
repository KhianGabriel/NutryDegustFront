import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  dataCriacao: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private apiUrl = 'http://localhost:8080/fornecedor'; // URL da API

  constructor(private http: HttpClient) { }

  getAllFornecedor(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  excluirFornecedor(id: string): Observable<void> {
    if (window.confirm('Deseja excluir o fornecedor?')) {
      const url = `${this.apiUrl}/${id}`; // URL do endpoint de exclusão
      return this.http.delete<void>(url);
    } else {
      window.alert('Fornecedor não excluído!');
      return new Observable<void>((observer) => {
        observer.complete();
      });
    }
  }


  
}
