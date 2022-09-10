import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GenresTableComponent} from './genres-table.component';


const routes: Routes = [
    {
        path: '',
        component: GenresTableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenreRoutingModule {

}
