import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorsTableComponent } from './authors-table.component';


const routes: Routes = [
    {
        path: '',
        component: AuthorsTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthorRoutingModule {

}