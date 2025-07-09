import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-estoques',
  imports: [],
  templateUrl: './estoques-atualizar.component.html',
  styleUrl: './estoques-atualizar.component.css'
})
export class EstoquesAtualizarComponent {

  constructor(
      private route: Router,
      private toastr: ToastrService
    ) { }

  chamarInicio() {
    this.route.navigate(['index']);
  }

  chamarFornecedores() {
    this.route.navigate(['fornecedores']);
   }

  chamarProdutos() {
    this.route.navigate(['produtos']);
  }

  chamarEstoque() {
    this.route.navigate(['estoques']);
  }

  chamarFuncionarios() {
    this.route.navigate(['funcionarios']);
  }
}
