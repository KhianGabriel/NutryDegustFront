import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService, Produto } from './produto.service';

@Component({
  selector: 'app-produtos-listagem',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './produtos.component.html', 
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit { 
  produtos: Produto[] = []; 
  filtroNome: string = '';
  filtroCategoria: string = ''; 
  produtoSelecionado: Produto | null = null; 
  modalAberto: boolean = false;

  constructor(
    private produtoService: ProdutoService, 
    private router: Router, 
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    this.carregarProdutos(); 
  }

  carregarProdutos(): void {
    this.produtoService.getAllProdutos().subscribe( 
      (dados) => {
        this.produtos = dados; 
      },
      (error) => {
        console.error('Erro ao carregar produtos', error); 
        this.toastr.error('Erro ao carregar produtos.');
      }
    );
  }

  abrirModal(produto: Produto): void {
    this.produtoSelecionado = produto; 
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.produtoSelecionado = null;
  }

  excluirProduto(): void { 
    if (!this.produtoSelecionado) return;

    this.produtoService.excluirProduto(this.produtoSelecionado.id).subscribe(
      () => {
        this.produtos = this.produtos.filter(p => p.id !== this.produtoSelecionado?.id); 
        this.fecharModal();
        this.toastr.success('Produto excluído com sucesso!');
      },
      (error) => {
        this.toastr.error('Erro ao excluir produto.'); 
        console.error(error);
      }
    );
  }

  get produtosFiltrados(): Produto[] { 
    return this.produtos.filter(p =>
      (p.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
       p.nomeBusca.toLowerCase().includes(this.filtroNome.toLowerCase())) && 
      p.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())
    );
  }

  chamarCadastroProduto() {
    this.router.navigate(['produtos-cadastro']);
  }

  chamarAtualizarProduto(produto: Produto) {
    this.router.navigate(['produtos-atualizar', produto.id]);
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
    this.router.navigate(['/produtos']);
  }
  
  formatarData(data: Date | string | undefined): string {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  }

  formatarMoeda(valor: number | undefined): string {
    if (valor === undefined || valor === null) return '';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

}