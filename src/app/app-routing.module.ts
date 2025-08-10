import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CourrierListComponent} from './pages/courriers/courrier-list/courrier-list.component';
import {CourrierFormComponent} from './pages/courriers/courrier-form/courrier-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'courriers', component: CourrierListComponent },
  { path: 'courriers/nouveau', component: CourrierFormComponent },
  { path: 'courriers/modifier/:id', component: CourrierFormComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
