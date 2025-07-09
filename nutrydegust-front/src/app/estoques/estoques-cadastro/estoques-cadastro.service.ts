import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EstoqueCadastro {
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class EstoqueService { 

  private apiUrl = 'http://localhost:8080/estoque';

  constructor(private http: HttpClient) { }

  cadastrarEstoque(estoque: EstoqueCadastro): Observable<void> {
    return this.http.post<void>(this.apiUrl, estoque);
  }

}