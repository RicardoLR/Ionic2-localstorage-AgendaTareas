import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// No llama a {storage, localStorage}
import { Storage } from '@ionic/storage';

// mi modelo
import { TodoModel } from './todo-model';

import { AppSettings } from './app-settings';
import { Observable } from "rxjs/Rx";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

/*
  > ionic g provider todo-service
  crea   providers/todo-service/todo-service.ts

  pasamos todo a share

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
*/
@Injectable()
export class TodoService {

  private todos: TodoModel[] = []; // OJO inicializo para prevenir errores cuando obtenermos de localStorage

  constructor(public http: Http, public local:Storage) {
    // versiones antes   this.local = new localStorage();
  }

  public loadFromList(id:number){
    this.getFromLocal(id).then(()=>{
      this.loadFromServer(id);
    })
  }

  /** Guadara localmente con localStorage  (this.local)
  los todos con clave basado en su ID de servicio REST  "list/${id}"
  */
  private getFromLocal(id:number){

    return this.local.ready().then(()=>{
      return this.local.get(`list/${id}`).then(
        data_storage_devuelto => {
          // sino existe elementos vuelvo mi array de todos a vacio y solo regreso
          if(!data_storage_devuelto){
            this.todos = [];
            return;
          }

          console.log("todos-service:  --- localStorage ---   getFromLocal()... data_storage_devuelto:", data_storage_devuelto);
          console.log( data_storage_devuelto.toString(), "   ", typeof(data_storage_devuelto) );

          // Comvierte el localStorage (clave-valor) a un array de TodoModel
          let localTodos:TodoModel[] =[];
          for(let todo of data_storage_devuelto){
            localTodos.push(TodoModel.clone(todo));
          }
          this.todos = localTodos;
        }
      )
    })
  }

  /** GET server  y actualizo localmente  (localStorage) */
  private loadFromServer(id:number){
    this.http.get(`${AppSettings.API_ENDPOINT}/lists/${id}/todos`)
      .map(response => {
        return response.json();
      })
      .map((todos:Object[]) =>{
        return todos.map(item => TodoModel.fromJson(item));
      })
      .subscribe(
        (result: TodoModel[]) =>{
          this.todos = result;
          this.saveLocally(id);
        },
        error => {
          console.log("Error loading lists from server ", error);
        }
      )
  }

  private postNewTodoToServer(todo:TodoModel): Observable<TodoModel>{

    /** Envio un JSOB y regresa un observable */
    let observable = this.http.post(`${AppSettings.API_ENDPOINT}/lists/${todo.listId}/todos`,
      {
        description: todo.description,
        isImportant: todo.isImportant,
        isDone: todo.isDone
      })
      .map(response => response.json())
      .map(todo => TodoModel.fromJson(todo))
      .share();

    return observable;
  }

  private updateTodoInServer(todo:TodoModel): Observable<TodoModel>{
    let observable = this.http.put(`${AppSettings.API_ENDPOINT}/todos/${todo.id}`,
    {
      description: todo.description,
      isImportant: todo.isImportant,
      isDone: todo.isDone,
      listId: todo.listId
    })
    .map(response => response.json())
    .map(todo => TodoModel.fromJson(todo))
    .share();

    return observable;
  }

  private deleteTodoFromServer(id:number){
    let observable = this.http.delete(`${AppSettings.API_ENDPOINT}/todos/${id}`).map( response => response.json() ).share();

    return observable;
  }

  /** guardar localmente cada elemento  con el valor  "list/id_unico"  */
  public saveLocally(id:number){
    this.local.ready().then(()=>{
      this.local.set(`list/${id}`, this.todos);
    })
  }

  /*** ================================================================================ */

  /**
  @params todo: elemento pasado de vista a componete y a servicio
  @return observable, regresado del metodo updateTodo, que internamente tiene llamada a servidor
  */
  toogleTodo(todo:TodoModel){

    let updatedTodo = TodoModel.clone(todo);
    updatedTodo.isDone = !todo.isDone;

    /** en caso de exito no hago nada, en caso de ERROR regreso el estado

    problema cuando no se conecta al servidor */
    return this.updateTodo(todo, updatedTodo).subscribe(
      ()=>{},
      ()=>{this.loadFromList(todo.listId)} // marco pero no hay conexion a servidor, quito la palomita en checkbox
    )
  }

  /** Elimina elemento con llamada a servidor
  y si es exitoso, Actualiza (array) this.todos de vista
  */
  removeTodo(todo:TodoModel){
    this.deleteTodoFromServer(todo.id).subscribe(
      ()=>{
        const index = this.todos.indexOf(todo);
        this.todos = [
          ...this.todos.slice(0, index),
          ...this.todos.slice(index+1)];
        this.saveLocally(todo.listId);
      },
      (error) => {
        console.log("An error occurred while trying to remove the todo ", todo);
        
      }
    );
  }

  /** Actualiza primero desde servidor y luego si es exitoso,
  Actualiza  mi vista con mi array "this.todos"  con ayuda de slice()

  @return Observable<TodoModel>
  */
  updateTodo(originalTodo:TodoModel, modifiedTodo:TodoModel):Observable<TodoModel>{
    let observable = this.updateTodoInServer(modifiedTodo);

    observable.subscribe(  (todo:TodoModel) => {
      const posicion_original_todo = this.todos.indexOf(originalTodo);

      this.todos = [
        ...this.todos.slice(0, posicion_original_todo),
        todo,  // actualizo y no solo corto su posicion,
        ...this.todos.slice(posicion_original_todo+1)];
    },
    error => console.log("Error trying to update todo item"));

    return observable;
  }

  addTodo(todo:TodoModel){
    let observable = this.postNewTodoToServer(todo);

    observable.subscribe(
      (todo:TodoModel) => {
        this.todos = [...this.todos, todo];
        this.saveLocally(todo.listId);
      },
      error => console.log("Error trying to post a new list")
    );

    return observable;
  }

}
