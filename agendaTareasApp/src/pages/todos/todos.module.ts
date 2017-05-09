import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Todos } from './todos';

@NgModule({
  declarations: [
    Todos,
  ],
  imports: [
    IonicPageModule.forChild(Todos),
  ],
  exports: [
    Todos
  ]
})
export class TodosModule {}
