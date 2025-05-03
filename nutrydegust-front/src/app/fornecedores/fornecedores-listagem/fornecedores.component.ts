import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FornecedorService, Fornecedor } from './fornecedor.service';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';


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

  constructor(private fornecedorService: FornecedorService, private route: Router) { }


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

  excluirFornecedor(fornecedor: Fornecedor): void {
    this.fornecedorService.excluirFornecedor(fornecedor.id).subscribe(
      () => {
        // Ao excluir, você pode recarregar a lista ou removê-lo do array
        this.fornecedores = this.fornecedores.filter(f => f.id !== fornecedor.id);
        alert('Fornecedor excluído com sucesso!');
      },
      (error) => {
        console.error('Erro ao excluir fornecedor', error);
      }
    );
  }

  get fornecedoresFiltrados(): Fornecedor[] {
    return this.fornecedores.filter(f =>
      f.nome.toLowerCase().includes(this.filtroNome.toLowerCase())
    );
  }


  chamarCadastroFornecedores() {
    this.route.navigate(['fornecedores-cadastro']);
  }

  chamarAtualizarFornecedor(fornecedor: Fornecedor) {
    this.route.navigate(['fornecedores-atualizar', fornecedor.id]);
  }

  chamarInicio() {
    this.route.navigate(['index']);
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
  
  
}
