import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ownerRoutes } from './owner-routing-module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ownerRoutes),
    ReactiveFormsModule
  ]
})
export class OwnerModule {}
