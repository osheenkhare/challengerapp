class Database{
    static init(){
        console.log("Connecting Database")
    }

    static appendUser(element){
        console.log(element["aadObjectId"],element["name"]) 
    }

    static getUsers(){

    }

    static initGame(memberInfo){
        console.log(memberInfo)
    }

    static updateGameResponses(response){
        console.log(response);
    }
}

module.exports = Database