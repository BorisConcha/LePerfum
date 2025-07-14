import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfumeListComponent } from './components/perfume-list/perfume-list.component';
import { PerfumeDetailComponent } from './components/perfume-detail/perfume-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/perfumes', pathMatch: 'full' },
  { path: 'perfumes', component: PerfumeListComponent },
  { path: 'perfumes/:id', component: PerfumeDetailComponent },
  { path: '**', redirectTo: '/perfumes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
