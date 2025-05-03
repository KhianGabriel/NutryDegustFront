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

  chamarFornecedores() {
    this.route.navigate(['fornecedores']);
  }
}

