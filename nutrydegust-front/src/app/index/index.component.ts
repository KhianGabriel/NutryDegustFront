import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  imports: [CommonModule]
})
export class IndexComponent {
  
  constructor(private route: Router) { }

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
    this.route.navigate(['/estoque']);
  }

}

