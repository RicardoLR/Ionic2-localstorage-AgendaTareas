import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTaskModal } from './add-task-modal';

@NgModule({
  declarations: [
    AddTaskModal,
  ],
  imports: [
    IonicPageModule.forChild(AddTaskModal),
  ],
  exports: [
    AddTaskModal
  ]
})
export class AddTaskModalModule {}
