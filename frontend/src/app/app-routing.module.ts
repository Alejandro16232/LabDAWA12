import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { MovieComponent } from './movie/movie.component';

const routes: Routes = [
    { path: 'items', component: ItemComponent }, 
    { path: 'peliculas', component: MovieComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule] 
})

export class AppRoutingModule { }