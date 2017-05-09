import { Injectable, Pipe } from '@angular/core';
import { TodoModel } from '../shared/todo-model';

/*
  > ionic g pipe PrioritizedTodosPipe

  antes se ponia en decorador @pipe    pure:false   revizara toda la lista en timpo real
*/
@Pipe({
  name: 'prioritizedTodosPipe'
  // quitamos   pure:false     
})
@Injectable()
export class PrioritizedTodosPipe {


  transform(todos: TodoModel[]) {
    /** filter, maneja cada elemento por eso usamos todo  (objeto individual)

    si el segundo elemento vaya primero que el primer elemento mandamos 1,
    el primer elemento antes del segundo, mandamos 1
    */
    return todos.filter(todo => !todo.isDone).sort((a, b)=>(b.isImportant && !a.isImportant) ? 1 : -1);
  }
}
