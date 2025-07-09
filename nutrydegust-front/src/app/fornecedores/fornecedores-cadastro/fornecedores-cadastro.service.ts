import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface FornecedorCadastro {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  dataCriacao: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private apiUrl = 'http://localhost:8080/fornecedor'; // URL da API

  constructor(private http: HttpClient) { }


  cadastrarFornecedor(fornecedor: FornecedorCadastro): Observable<FornecedorCadastro> {
    return this.http.post<FornecedorCadastro>(this.apiUrl, fornecedor);
  }

}
