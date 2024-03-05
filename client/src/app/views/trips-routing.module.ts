import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripsComponent } from './trips/trips.component';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../guards/auth-activate.guard';

import { AuthActivate } from '../../core/guards/auth.acivate';

const routes: Routes = [
    {
        path: '',
         pathMatch: 'full',
        component: TripsComponent,      
    },
    {
        path: 'create',
        component: CreateComponent,
        canActivate: [AuthGuard],
    },
    {
        path: ':tripId',
        component: DetailsComponent,
    },
    {
      path: ':tripId/edit',
      component: EditComponent,
      canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TripsRoutingModule { }

