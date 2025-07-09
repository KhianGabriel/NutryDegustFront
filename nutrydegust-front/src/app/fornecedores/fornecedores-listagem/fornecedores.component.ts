import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs'; // Importar Observable

// --- Interfaces e Serviço para Funcionário (adaptados do FuncionarioService anterior) ---

// Interface para representar um Funcionário (baseada na sua entidade Funcionario do backend)
export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: string;
  dataContratacao: Date;
  dataCriacao: Date;
}

// Serviço simplificado para Funcionário (listar e excluir)
@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private apiUrl = 'http://localhost:8080/funcionario'; // URL da API para funcionários

  constructor(private http: HttpClient) { } // HttpClient é injetado aqui

  // Método para obter todos os funcionários
  getAllFuncionarios(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  // Método para excluir um funcionário
  excluirFuncionario(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
// --- Fim das Interfaces e Serviço ---


@Component({
  selector: 'app-funcionarios', // Selector alterado
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit { // Nome da classe alterado

  funcionarios: Funcionario[] = []; // Propriedade de dados alterada
  filtroNome: string = '';
  filtroCPF: string = ''; // Filtro para CPF (alterado de CNPJ)
  funcionarioSelecionado: Funcionario | null = null; // Propriedade de seleção alterada
  modalAberto: boolean = false;

  constructor(
    private funcionarioService: FuncionarioService, // Serviço injetado alterado
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.funcionarioService.getAllFuncionarios().subscribe( // Chamada ao serviço alterada
      (dados) => {
        this.funcionarios = dados; // Atribuição de dados alterada
      },
      (error) => {
        console.error('Erro ao carregar funcionários', error); // Mensagem de erro alterada
      }
    );
  }

  abrirModal(funcionario: Funcionario): void { // Parâmetro alterado
    this.funcionarioSelecionado = funcionario; // Atribuição alterada
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.funcionarioSelecionado = null;
  }

  excluirFuncionario(): void { // Nome do método alterado
    if (!this.funcionarioSelecionado) return;

    this.funcionarioService.excluirFuncionario(this.funcionarioSelecionado.id).subscribe( // Chamada ao serviço alterada
      () => {
        this.funcionarios = this.funcionarios.filter(f => f.id !== this.funcionarioSelecionado?.id); // Filtro alterado
        this.fecharModal();
        this.toastr.success('Funcionário excluído com sucesso!'); // Mensagem alterada
      },
      (error) => {
        this.toastr.error('Erro ao excluir funcionário.'); // Mensagem alterada
        console.error(error);
      }
    );
  }

  get funcionariosFiltrados(): Funcionario[] { // Nome do getter alterado
    return this.funcionarios.filter(f =>
      // Filtro por nome e CPF (alterado de CNPJ)
      f.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
      f.cpf.toLowerCase().includes(this.filtroCPF.toLowerCase())
    );
  }

  chamarCadastroFuncionarios() { // Nome do método alterado
    this.route.navigate(['funcionarios-cadastro']); // Rota alterada
  }

  chamarAtualizarFuncionario(funcionario: Funcionario) { // Nome do método e parâmetro alterados
    this.route.navigate(['funcionarios-atualizar', funcionario.id]); // Rota alterada
  }

  chamarInicio() {
    this.route.navigate(['index']);
  }

  // Métodos de formatação relevantes para Funcionário (CPF, Telefone)
  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  // Métodos de formatação não relevantes para Funcionário (CNPJ, CEP) foram removidos
}