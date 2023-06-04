import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimpleregressionComponent } from './models/simpleregression/simpleregression.component';

const routes: Routes = [{ path: "simplemodel", component: SimpleregressionComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
