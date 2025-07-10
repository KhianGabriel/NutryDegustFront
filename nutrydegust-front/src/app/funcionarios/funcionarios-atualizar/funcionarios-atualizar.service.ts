import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interface que representa a estrutura completa de um Funcionário,
 * conforme retornado pela API do backend para operações de listagem e detalhes.
 */
export interface FuncionarioAtualizar {
  nome: string;
  cargo: string;
  cpf: string;
  email: string;
  telefone: string;
  salario: number;
  cargaHoraria: number;
  atividade: string;
  cep: string;
  estado: string;
  cidade: string;
  rua: string;
  numero: string;
  bairro: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private apiUrl = 'http://localhost:8080/funcionario';

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os funcionários cadastrados na API.
   * @returns Um Observable de um array de objetos Funcionario.
   */
  getAllFuncionarios(): Observable<FuncionarioAtualizar[]> {
    return this.http.get<FuncionarioAtualizar[]>(this.apiUrl)
  }

  /**
   * Busca um funcionário específico pelo seu ID.
   * @param id O ID do funcionário a ser buscado.
   * @returns Um Observable de um objeto Funcionario.
   */
  buscarProdutoPorId(id: string): Observable<FuncionarioAtualizar> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<FuncionarioAtualizar>(url)
  }

  /**
   * Cadastra um novo funcionário na API.
   * @param funcionario Os dados do funcionário a serem cadastrados, conforme RequestFuncionarioCreate.
   * @returns Um Observable de void, indicando a conclusão da operação.
   */
  cadastrarFuncionario(funcionario: FuncionarioAtualizar): Observable<void> {
    return this.http.post<void>(this.apiUrl, funcionario)
  }

  /**
   * Atualiza os dados de um funcionário existente na API.
   * @param id O ID do funcionário a ser atualizado.
   * @param funcionario Os novos dados do funcionário, conforme RequestFuncionarioPut.
   * @returns Um Observable do objeto Funcionario atualizado.
   */
  atualizarFuncionario(id: string, funcionario: FuncionarioAtualizar): Observable<FuncionarioAtualizar> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<FuncionarioAtualizar>(url, funcionario)
  }

  /**
   * Exclui um funcionário da API pelo seu ID.
   * @param id O ID do funcionário a ser excluído.
   * @returns Um Observable de void, indicando a conclusão da operação.
   */
  excluirFuncionario(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
  }

}