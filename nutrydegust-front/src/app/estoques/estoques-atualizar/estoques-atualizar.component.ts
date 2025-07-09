import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; // Adicionado Validators e ReactiveFormsModule
import { ToastrService } from 'ngx-toastr';
import { EstoqueService, EstoqueAtualizar } from './estoques-atualizar.service'; // Importando o serviço correto

@Component({
  selector: 'app-estoques-atualizar', // Selector mais específico para o componente de atualização
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], // Adicionado ReactiveFormsModule
  templateUrl: './estoques-atualizar.component.html',
  styleUrl: './estoques-atualizar.component.css'
})
export class EstoquesAtualizarComponent implements OnInit {

  // Removido: estoques: EstoqueAtualizar[] = []; // Não é necessário para um componente de atualização de item único
  estoqueForm: FormGroup;
  id: string = ''; // Usando 'string' para o ID
  errosServidor: any;

  constructor(
    private estoqueService: EstoqueService, // Usando o EstoqueService correto
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.estoqueForm = this.fb.group({
      // Adicionado Validators.required para o nome
      nome: ['', Validators.required],
      // O ID não precisa ser um FormControl se você só o usa da rota e não o edita diretamente no formulário
      // id: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!; // O '!' afirma que o valor não será nulo

    this.estoqueService.getEstoqueById(this.id).subscribe({
      next: (estoque) => {
        this.estoqueForm.patchValue(estoque); // Preenche o formulário com os dados do estoque
        this.toastr.success('Estoque carregado para edição.');
      },
      error: (err) => {
        console.error('Erro ao buscar estoque:', err);
        this.toastr.error('Erro ao carregar estoque para edição.');
        this.router.navigate(['/estoque']); // Redireciona em caso de erro
      }
    });
  }

  atualizarEstoque(): void {
    // Verifica se o formulário é válido
    if (this.estoqueForm.valid) {
      // Cria o objeto com o tipo RequestEstoquePut, contendo apenas o 'nome'
      const estoqueParaAtualizar: EstoqueAtualizar = {
        nome: this.estoqueForm.value.nome
      };

      this.estoqueService.atualizarEstoque(this.id, estoqueParaAtualizar).subscribe({
        next: (response: EstoqueAtualizar) => { // O tipo de resposta é Estoque (a entidade completa)
          this.toastr.success('Estoque atualizado com sucesso!');
          this.router.navigate(['/estoque']); // Redireciona para a lista de estoques
        },
        error: (error) => {
          console.error('Erro ao atualizar estoque:', error);
          this.toastr.error('Erro ao atualizar estoque.');
          // Se o erro tiver detalhes do servidor, você pode exibi-los
          this.errosServidor = error.error; // Assumindo que o backend retorna erros no corpo 'error.error'
        }
      });
    } else {
      this.toastr.warning('Por favor, preencha o nome do estoque.');
      this.estoqueForm.markAllAsTouched(); // Marca os campos para exibir mensagens de validação
    }
  }

  // Métodos de navegação
  chamarInicio() {
    this.router.navigate(['index']);
  }

  chamarFornecedores() {
    this.router.navigate(['fornecedores']);
  }

  chamarProdutos() {
    this.router.navigate(['produtos']);
  }

  chamarEstoque() {
    this.router.navigate(['estoque']); // Rota para a listagem de estoques
  }

  chamarFuncionarios() {
    this.router.navigate(['funcionarios']); 
  }

  // Métodos de formatação (se ainda forem necessários neste componente, caso contrário podem ser removidos)
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