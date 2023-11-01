import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { AccountingFormComponent } from './accounting-form/accounting-form.component';

const routes: Routes = [
  { path: '', component: StudentsComponent },
  { path: 'send-accounting', component: AccountingFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
