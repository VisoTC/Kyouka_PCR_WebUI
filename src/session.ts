class Groups extends Array<Group>{
    constructor(list:Array<Group>){
        super()
        list.forEach(element => {
            this.push(element)
        },this);
    }
    get(gid:number){
        for (let v of this){
            if (v.gid == gid){
                return v 
            }
        }
       
    }
}
interface Group {
    gid:number
    name: string;
}