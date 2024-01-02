import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';

const routes: Routes = [
  { path: 'customer-form', component: CustomerFormComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'customer-edit/:id', component: CustomerEditComponent },
  { path: '', redirectTo: '/customer-list', pathMatch: 'full' }, // Rota padrão redireciona para customer-list
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
