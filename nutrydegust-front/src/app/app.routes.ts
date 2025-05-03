import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { FornecedoresComponent } from './fornecedores/fornecedores-listagem/fornecedores.component';
import { FornecedoresCadastroComponent } from './fornecedores/fornecedores-cadastro/fornecedores-cadastro.component';
import { FornecedoresAtualizarComponent} from './fornecedores/fornecedores-atualizar/fornecedores-atualizar.component';


export const routes: Routes = [
    {path: '', redirectTo: '/index', pathMatch: 'full'},
    {path: 'index', component: IndexComponent},
    {path: 'fornecedores', component: FornecedoresComponent},
    {path: 'fornecedores-cadastro', component: FornecedoresCadastroComponent},
    {path: 'fornecedores-atualizar/:id', component: FornecedoresAtualizarComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
