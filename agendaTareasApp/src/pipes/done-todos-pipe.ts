import { Injectable, Pipe } from '@angular/core';
import { TodoModel } from '../shared/todo-model';

/*
  Generado para regresar los Todos que esten hechos   "Palomeados"

*/
@Pipe({
  name: 'doneTodosPipe'
})
@Injectable()
export class DoneTodosPipe {
  /*
    Takes a value and makes it lowercase.
   */
  transform(todos: TodoModel[]) {
    return todos.filter(todo => todo.isDone);
  }
}
