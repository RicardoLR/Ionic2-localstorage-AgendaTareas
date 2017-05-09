import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';


import { ListsService } from '../../shared/lists-service';
import { ListModel } from '../../shared/list-model';


import { TodosPage } from '../todos/todos';


/*
  Generated class for the Lists page.


*/
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html'
})
export class ListsPage {

  /** Apoyo al seleccionar listas (en vista) */
  public selectedList:ListModel = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,  // mensajes de alerta
    public listsService:ListsService,
    private loadingCtrl:LoadingController) {}

  /** NOTAR:   no hay funcion a cargar inmediatamente en constructor
  solo inyectamos ListsService y en vista hacemmos "listsService.lists"
  */

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListsPage');
  }


  /** Redireccion como IOS que tiene un stack de vistas
  con navCtrl ponemos una vista arriba (como una pila) la vista TodosPage, abajo esta lists

  Recibida de vista:
    <ion-item *ngFor="let list of listsService.lists"
        (tap)="goToList(list)" ...
  */
  goToList(list:ListModel){
    this.clearSelectedList();
    this.navCtrl.push(TodosPage, {list});
  }

  addNewList(name:string){
    let loader = this.loadingCtrl.create();
    loader.present();

    /** Servicio regresa un observable  */
    this.listsService.addList(name)
      .subscribe(list =>{
        this.goToList(list);

        loader.dismiss(); // cargando...
      }, error => loader.dismiss());

  }

  /**  Agrega una nueva lista con ayuda de un popup, alerta */
  showAddList(){
    console.log("show add list");

    let addListAlert = this.alertCtrl.create({
      title: 'New list',
      message: 'Give a name to the new list',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      // botones que tiene mensaje de alerta
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data => {
            /** cierra el mismo mensaje de alerta y llama a metodo addNewList

            Llamo a dismiss() para controlar transicion entre alert (finalice) y (siga) loader */
            let navTransition = addListAlert.dismiss();
            navTransition.then( ()=>{
              this.addNewList(data.name)  // De mirar arriba  inputs.name: 'name'
            });
          }
        }
      ]
    });

    addListAlert.present();
  }

  clearSelectedList(){
    this.selectedList = null;
  }

  selectList(list:ListModel){
    if(this.selectedList == list){
      this.clearSelectedList();

    }else{
      this.selectedList = list;
    }
  }

  removeSelectedList(){
    this.listsService.removeList(this.selectedList);
    this.selectedList = null;
  }

}
