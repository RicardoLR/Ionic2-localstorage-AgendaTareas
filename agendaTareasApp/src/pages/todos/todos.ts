import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, LoadingController } from 'ionic-angular';

import {ListModel } from '../../shared/list-model';
import { TodoModel } from '../../shared/todo-model';
import { TodoService } from '../../shared/todo-service';

import { AddTaskModalPage } from '../add-task-modal/add-task-modal';

/*

*/
@Component({
  selector: 'page-todos', // estilo todos.cscc  ->    page-todos {  .warning{...}  .... }
  templateUrl: 'todos.html'
})
export class TodosPage {

  /** sirve para palomear en vista, y sera igual a una funcion timeout y se limpia (quita) con clearTimeOut() */
  private toogleTodoTimeout = null;
  private list :ListModel;

  /**
  LoadingController : Una superposición que puede usarse para indicar actividad mientras bloquea la interacción del usuario
    muestra centradamente un cuadrito de cargango...
  */
  constructor(
    public navCtrl: NavController,  // por dafault, no lo utilizamos
    public navParams: NavParams,
    public modalCtrl: ModalController,

    public todoService: TodoService,
    public platform: Platform,
    private loadingCtrl: LoadingController) {

      /** Obtener valores de la vista pasada (Component lists.ts)   */
      this.list = this.navParams.get('list');
      this.todoService.loadFromList(this.list.id);
    }

  ionViewDidLoad() {}

  /** se llama cuando el componete se cierra
  guardo la lista con su ID */
  ionViewWillUnload(){
    this.todoService.saveLocally(this.list.id);
  }

  /** @params  elemento TodoModel
  @return  un stylo CSS (json) */
  setTodoStyles(item:TodoModel){
    let styles = {
      'text-decoration': item.isDone ? 'line-through' : 'none',
      'font-weight': item.isImportant ? '600' : 'normal'
    };
    return styles;
  }

  /** palomear los elentos en vista */
  toogleTodo(todo:TodoModel){
    if(this.toogleTodoTimeout)
      return;

    /** efecto material design con timeout( ()=>{ ... } )

    y si es IOS no lo hagas, no tiene efecto material desing
    */
    this.toogleTodoTimeout = setTimeout( ()=>{
      this.todoService.toogleTodo(todo);

      /** tanto el if de arriba como este null sirve para volver a palomear la casilla, */
      this.toogleTodoTimeout = null;
    }, this.platform.is('ios') ? 0 : 300);
  }

  removeTodo(todo:TodoModel){
    this.todoService.removeTodo(todo);
  }

  addTodo(todo:TodoModel){
    let loader = this.loadingCtrl.create();
    loader.present();

    this.todoService.addTodo(todo).subscribe( ()=>loader.dismiss(), ()=>loader.dismiss());
  }

  /** nos apoyamos de un modal    page/add-task-modal
  usa modalCtrl  (inyectado en constructor)
  */
  showAddTodo(){
    let modal = this.modalCtrl.create(AddTaskModalPage, {listId: this.list.id});
    modal.present();

    /** onDidDismiss   cuando mi modal  se ha cerrado */
    modal.onDidDismiss(data => {
      if(data){
        this.addTodo(data);  // llamamos a metod porpio de esta clase
      }
    });
  }

  /** ============================================================================= */

  updateTodo(originalTodo:TodoModel, modifiedTodo:TodoModel){
    let loader = this.loadingCtrl.create();
    loader.present();

    this.todoService.updateTodo(originalTodo, modifiedTodo)
    .subscribe(
      ()=>loader.dismiss(),
      () =>loader.dismiss()
    );
  }

  /** PUT  Nos apoyamos del mismo modal AddTaskModalPage  para editar

  PASAR VARIABLES DE VISTA A OTRA VISTA
  angular 1  ->   stateParams
  angular 2  ->   navParams

  params   TodoModel enviado de vista
  */
  showEditTodo(todo: TodoModel){

    /**  modalCtrl.create(AddTaskModalPage, {todo});     segundo parametro, variable a enviar  */
    let modal = this.modalCtrl.create(AddTaskModalPage, {todo});
    modal.present();

    /** dismiss = despedir
    antes de despedirse el modal  */
    modal.onDidDismiss(data=>{
      console.log("modal.onDidDismiss(data ", data);
      if(data){
        this.updateTodo(todo, data);
      }
    })
  }

}
