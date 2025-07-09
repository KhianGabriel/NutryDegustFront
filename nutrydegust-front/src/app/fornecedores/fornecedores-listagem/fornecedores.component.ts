import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService, Fornecedor } from './fornecedores.service';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-fornecedores',
  standalone  : true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css']
})
export class FornecedoresComponent implements OnInit{

  fornecedores: Fornecedor[] = [];
  filtroNome: string = '';
  filtroCNPJ: string = '';
  fornecedorSelecionado: Fornecedor | null = null;
  modalAberto: boolean = false;

  constructor(
    private fornecedorService: FornecedorService,
    private route: Router,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    
    this.fornecedorService.getAllFornecedor().subscribe(
      (dados) => {
        this.fornecedores = dados;
      },
      (error) => {
        console.error('Erro ao carregar fornecedores', error);
      }
    );
  }

  abrirModal(fornecedor: Fornecedor): void {
    this.fornecedorSelecionado = fornecedor;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.fornecedorSelecionado = null;
  }

  excluirFornecedor(): void {
    if (!this.fornecedorSelecionado) return;

    this.fornecedorService.excluirFornecedor(this.fornecedorSelecionado.id).subscribe(
      () => {
        this.fornecedores = this.fornecedores.filter(f => f.id !== this.fornecedorSelecionado?.id);
        this.fecharModal();
        this.toastr.success('Fornecedor excluído com sucesso!');
      },
      (error) => {
        this.toastr.error('Erro ao excluir fornecedor.');
        console.error(error);
      }
    );
  }

  get fornecedoresFiltrados(): Fornecedor[] {
    return this.fornecedores.filter(f =>
      f.nomeBusca.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
      f.cnpj.toLowerCase().includes(this.filtroCNPJ.toLowerCase())
    );
  }


  chamarCadastroFornecedores() {
    this.route.navigate(['fornecedores-cadastro']);
  }

  chamarAtualizarFornecedor(fornecedor: Fornecedor) {
    this.route.navigate(['fornecedores-atualizar', fornecedor.id]);
  }

  chamarInicio(): void {
    this.route.navigate(['/index']);
  }

  chamarEstoque(): void {
    this.route.navigate(['/estoques']); 
  }

  chamarProdutos(): void {
    this.route.navigate(['/produtos']);
  }

  chamarFornecedores(): void {
    this.route.navigate(['/fornecedores']);
  }

  chamarFuncionarios(): void {
    this.route.navigate(['/funcionarios']);
  }
  
  voltarParaLista(): void {
    this.route.navigate(['/fornecedores']);
  }

  formatarCNPJ(cnpj: string): string {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  
  formatarCEP(cep: string): string {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  
  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  
}
