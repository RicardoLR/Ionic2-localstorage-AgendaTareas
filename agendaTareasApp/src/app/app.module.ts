import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';

import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from '@angular/http';


/** mi component principal */
import { MyApp } from './app.component';

/** paginas pripios */
import { TodosPage } from '../pages/todos/todos';
import { ListsPage } from '../pages/lists/lists';
import { AddTaskModalPage } from '../pages/add-task-modal/add-task-modal';

/** Pipes pripios */
import { PrioritizedTodosPipe } from '../pipes/prioritized-todos-pipe';
import { DoneTodosPipe } from '../pipes/done-todos-pipe';

/** Servicios pripios */
import { ListsService } from '../shared/lists-service';
import { TodoService } from '../shared/todo-service';

@NgModule({
  declarations: [
    MyApp,
    TodosPage,
    ListsPage,
    AddTaskModalPage,
    PrioritizedTodosPipe,
    DoneTodosPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TodosPage,
    ListsPage,
    AddTaskModalPage
  ],
  providers: [
    TodoService,
    ListsService,
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})

export class AppModule {}
