export class ListModel{

    constructor(
        public name:string,
        public id:number
    ){}

    /** static para poder llamarlo por la clase  ListModel  y no por una instancio de la clase.

    @params  data: un objeto JSON para devolver  un objeto ListModel  */
    static fromJson(data:any){
        if(!data.name || !data.id){
            throw(new Error("Invalid argument: argument structure do not match with model"));
        }

        return new ListModel(data.name, data.id);
    }
}
