import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstoqueService, Estoque } from './estoques.service';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-estoques',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './estoques.component.html',
  styleUrls: ['./estoques.component.css']
})
export class EstoquesComponent implements OnInit {

  estoques: Estoque[] = [];
  filtroBusca: string = ''; // Renomeado de filtroNome para filtroBusca
  estoqueSelecionado: Estoque | null = null;
  modalAberto: boolean = false;

  constructor(
    private estoqueService: EstoqueService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarEstoques();
  }

  carregarEstoques(): void {
    this.estoqueService.getAllEstoques().subscribe(
      (dados) => {
        this.estoques = dados;
      },
      (error) => {
        console.error('Erro ao carregar estoques', error);
        this.toastr.error('Erro ao carregar estoques.');
      }
    );
  }

  abrirModal(estoque: Estoque): void {
    this.estoqueSelecionado = estoque;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.estoqueSelecionado = null;
  }

  excluirEstoque(): void {
    if (!this.estoqueSelecionado) return;

    // Condição para exclusão: só permite se quantidadeItens for 0
    if (this.estoqueSelecionado.quantidadeItens && this.estoqueSelecionado.quantidadeItens > 0) {
      this.toastr.error('Este estoque contém itens e não pode ser excluído.');
      this.fecharModal(); // Fecha o modal após a mensagem de erro
      return; // Impede a continuação da exclusão
    }

    this.estoqueService.excluirEstoque(this.estoqueSelecionado.id).subscribe(
      () => {
        this.estoques = this.estoques.filter(e => e.id !== this.estoqueSelecionado?.id);
        this.fecharModal();
        this.toastr.success('Estoque excluído com sucesso!');
      },
      (error) => {
        this.toastr.error('Erro ao excluir estoque.');
        console.error(error);
      }
    );
  }

  get estoquesFiltrados(): Estoque[] {
    const termoBusca = this.filtroBusca.toLowerCase();
    return this.estoques.filter(e =>
      // Filtra por nome ou categoria usando o termoBusca
      !termoBusca ||
      e.nome.toLowerCase().includes(termoBusca) ||
      e.categoria.toLowerCase().includes(termoBusca) // Inclui busca por categoria
    );
  }

  chamarCadastroEstoque() {
    this.router.navigate(['estoques-cadastro']);
  }

  chamarAtualizarEstoque(estoque: Estoque) {
    this.router.navigate(['estoques-atualizar', estoque.id]);
  }

  chamarDetalhesEstoque(estoque: Estoque): void {
    this.router.navigate(['/produtos'], { queryParams: { estoqueId: estoque.id } });
  }

  // Métodos de navegação do cabeçalho
  chamarInicio(): void {
    this.router.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.router.navigate(['/estoques']);
  }

  chamarProdutos(): void {
    this.router.navigate(['/produtos']);
  }

  chamarFornecedores(): void {
    this.router.navigate(['/fornecedores']);
  }

  chamarFuncionarios(): void {
    this.router.navigate(['/funcionarios']);
  }

  voltarParaLista(): void {
    this.router.navigate(['/estoques']);
  }
}