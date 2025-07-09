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
  filtroNome: string = '';
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
    return this.estoques.filter(e =>

      e.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }

  chamarCadastroEstoque() {
    this.router.navigate(['estoque-cadastro']); 
  }

  chamarAtualizarEstoque(estoque: Estoque) { 
    this.router.navigate(['estoque-atualizar', estoque.id]); 
  }

  chamarInicio(): void {
    this.router.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.router.navigate(['/estoque']); 
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
    this.router.navigate(['/estoque']);
  }
}