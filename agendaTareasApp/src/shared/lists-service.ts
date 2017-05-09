import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { Storage } from '@ionic/storage';

import { ListModel } from './list-model';
import { AppSettings } from '../shared/app-settings';

/*
  Generated class for the ListsService provider.

  Recordar mi localStorage guarda clave-valor
  por tanto guardo mis listas en un string JSON
*/
@Injectable()
export class ListsService {

  public lists:ListModel[] = [];

  constructor(public http: Http, public local:Storage) {
    this.getLists();
  }

  /** unico metodo private
  Primero las busco local y luego al servidor  */
  private getLists(){

    // .then( caso exito, caso de error) en ambos busca a servidor
    this.getFromLocal()
      .then(
        ()=>{ this.getFromServer() },
        ()=>{ this.getFromServer() }
      );

    /** =====================================
    optener valores estaticos

    this.lists = [
      new ListModel("mi primer lista", 0),
      new ListModel("mi segunda lista", 1)
    ];
    */
  }

  /** crear nuevas listas

  @return observable: sirve para el loading en vista */
  public addList(name:string){
    let observable = this.postNewListToServer(name);

    /** OJO   nos subscribimos de nuevo, para afectar a la vista en el movil,
    para que se actualize la lista de  "this.lists" y lo guadamos local, para no llamar de nuevo a todos los list (GET REST, evitar eso)   */
    observable.subscribe(
      (list:ListModel) =>{
        // evitamos pedir todo a servidor, afectamos "this.lists" de la vista y la persisto
        this.lists = [...this.lists, list];
        this.saveLocally();
      },
      error => console.log("Error trying to post a new list to the server")
    );

    return observable;
  }

  /*/ Obtiene de localStorage (es clave-valor)  el valor de "lists"
  recorre ese string que regresa en variable "data" para asignar al arreglo "localLists"
  */
  public getFromLocal(){

    return this.local.ready().then(()=>{
      return this.local.get('lists').then(
        data => {
          let localLists:ListModel[] = [];

          if(data){
            console.log("getFromLocal()... data:", data);
            console.log( data.toString(), "   ", typeof(data) );
            for(let list of data){
              localLists.push(new ListModel(list.name, list.id));
            }
          }

          console.log("getFromLocal()... localLists:", localLists);
          console.log( localLists.toString(), "   ", typeof(localLists) );

          this.lists = localLists;
        })
    })
  }

  private getFromServer(){

    this.http.get(`${AppSettings.API_ENDPOINT}/lists`)
      .map( response => { return response.json() } ) // primero recibo cada elemento en JSON
      .map( (lists:Object[]) => {  // luego comvierto de json a objeto ListModel
        return lists.map(item => ListModel.fromJson(item) );
      })
      .subscribe(
        // result es el resultado despues de los 2 map(...) y lo guarda en this.lists y luego guarda en local
        (result:ListModel[]) =>{
          this.lists = result;
          this.saveLocally();
        },
        error =>{
          console.log("Error loading lists from server", error);
        }
      )
  }

  public saveLocally(){
    this.local.ready().then(()=>{
      console.log("lists-service.ts    saveLocally()  this.lists:", this.lists);
      console.log( this.lists.toString(), "   ", typeof(this.lists) );

      this.local.set('lists', this.lists);
    })
  }

  /** servicio POST a REST */
  private postNewListToServer(name): Observable<ListModel>{
    // Envio POST   (JSON) { name:name }
    let observable =  this.http.post(`${AppSettings.API_ENDPOINT}/lists`, {name})
      .share() // metodo importante para ser compartido y se ejecute una vez cada ves que se subscribe
      .map(response => response.json()) // obtengo respuesta en JSON
      .map(list => ListModel.fromJson(list));

    observable.subscribe(()=>{}, ()=>{});

    return observable;
  }

  private deleteListFromServer(id:number){
    let observable = this.http.delete(`${AppSettings.API_ENDPOINT}/lists/${id}`)
    .map(response => response.json())
    .share();

    return observable;
  }

  public removeList(list:ListModel){

    // Lo borro de mi servidor y actualizo mi vista, sin hacer otra peticion HTTP a servidor
    this.deleteListFromServer(list.id).subscribe(
      () => {
        // obtengo la posicion del String en mi lista y modifico vista y ñlocalStorage
        let index = this.lists.indexOf(list);
        //
        this.lists = [...this.lists.slice(0,index), ...this.lists.slice(index+1)];

        this.saveLocally();
      },
      (error) => {console.log(`an error occurred while trying to remove list: ${list.name}`);}
    )
  }

}
