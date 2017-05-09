import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { TodoModel } from '../../shared/todo-model';

/*
  Generated class for the AddTaskModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-task-modal',
  templateUrl: 'add-task-modal.html'
})
export class AddTaskModalPage {

  public model:TodoModel;
  public title:string = "Add new task";
  public buttonText:string = "ADD";

  /**
  ViewController:  Acceda a varias funciones e información sobre la vista actual.

  NavParams es un objeto que existe en una página y puede contener datos para esa vista en particular.
   Similar a cómo se pasaban los datos a una vista en V1 con $ stateParams,
   NavParams ofrece una opción mucho más flexible con un simple método get
  */
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {

    /** recibimos  de todos.ts

    If para editar
    */
    if(this.navParams.get('todo')){

      /**
      creamos metodo clone   porque aqui asignando por referencia a this.model
      y aunque cancele, guardara los cambios

      recibimos de:
      showEditTodo(todo: TodoModel){
          let modal = this.modalCtrl.create(AddTaskModalPage, {todo});
      */
      this.model = TodoModel.clone(this.navParams.get('todo'));
      this.title = "Edit task";
      this.buttonText = "Save changes";

    /** el  */
    }else{
      let listId = this.navParams.get('listId');
      this.model = new TodoModel('', listId);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTaskModalPage');
  }

  /** metodos que pose   viewCtrl  (inyectado)  */
  dismiss(){
    this.viewCtrl.dismiss();
  }

  /** Lllamado en vista por <form ... (ngSubmit)="submit()">

  que recibe viewCtrl   en mi   public model:TodoModel  :
  [(ngModel)]="model.description"
  [(ngModel)]="model.isImportant"
 */
  submit(){
    this.viewCtrl.dismiss(this.model);
  }

}
