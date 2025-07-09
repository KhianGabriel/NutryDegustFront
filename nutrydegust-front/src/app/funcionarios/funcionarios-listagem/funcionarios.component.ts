import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FuncionarioService } from './funcionarios.service';


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


@Component({
  selector: 'app-funcionarios', 
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit { 

  funcionarios: Funcionario[] = []; 
  filtroNome: string = '';
  filtroCPF: string = ''; 
  funcionarioSelecionado: Funcionario | null = null; 
  modalAberto: boolean = false;

  constructor(
    private funcionarioService: FuncionarioService, 
    private route: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.funcionarioService.getAllFuncionarios().subscribe( 
      (dados) => {
        this.funcionarios = dados; 
      },
      (error) => {
        console.error('Erro ao carregar funcionários', error); 
      }
    );
  }

  abrirModal(funcionario: Funcionario): void { 
    this.funcionarioSelecionado = funcionario; 
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

  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

}