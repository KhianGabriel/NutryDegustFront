import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

import { FornecedoresComponent } from './fornecedores/fornecedores-listagem/fornecedores.component';
import { FornecedoresCadastroComponent } from './fornecedores/fornecedores-cadastro/fornecedores-cadastro.component';
import { FornecedoresAtualizarComponent} from './fornecedores/fornecedores-atualizar/fornecedores-atualizar.component';
import { FuncionariosComponent } from './funcionarios/funcionarios-listagem/funcionarios.component';
import { FuncionariosCadastroComponent } from './funcionarios/funcionarios-cadastro/funcionarios-cadastro.component';
import { FuncionariosAtualizarComponent } from './funcionarios/funcionarios-atualizar/funcionarios-atualizar.component';
import { ProdutosComponent } from './produtos/produtos-listagem/produtos.component';
import { ProdutosCadastroComponent } from './produtos/produtos-cadastrar/produtos-cadastro.component';
import { ProdutosAtualizarComponent } from './produtos/produtos-atualizar/produtos-atualizar.component';
import { EstoquesComponent } from './estoques/estoques-listagem/estoques.component';
import { EstoquesCadastroComponent } from './estoques/estoques-cadastro/estoques-cadastro.component';
import { EstoquesAtualizarComponent } from './estoques/estoques-atualizar/estoques-atualizar.component';

export const routes: Routes = [
    {path: '', redirectTo: '/index', pathMatch: 'full'},
    {path: 'index', component: IndexComponent},
    {path: 'fornecedores', component: FornecedoresComponent},
    {path: 'fornecedores-cadastro', component: FornecedoresCadastroComponent},
    {path: 'fornecedores-atualizar/:id', component: FornecedoresAtualizarComponent, data: { renderMode: 'server' }},
    {path: 'funcionarios', component: FuncionariosComponent},
    {path: 'funcionarios-cadastro', component: FuncionariosCadastroComponent},
    {path: 'funcionarios-atualizar/:id', component: FuncionariosAtualizarComponent}, // Atualizar por ID
    {path: 'produtos', component: ProdutosComponent},
    {path: 'produtos-cadastro', component: ProdutosCadastroComponent},
    {path: 'produtos-atualizar/:id', component: ProdutosAtualizarComponent}, // Atualizar por ID
    {path: 'estoque', component: EstoquesComponent},
    {path: 'estoque-cadastro', component: EstoquesCadastroComponent},
    {path: 'estoque-atualizar/:id', component: EstoquesAtualizarComponent}, // Atualizar por ID
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }