var azure = require('azure-storage');
var account = "temendeiudiuw"
var key = "DHL+IzkxIdvg6o5MroWnuOrw2WtlAT5rXLsiFezZTDoD5p2NdzH9mxTkWlsdzyzRtF72j8sGU/aXe1iqn9fmOw=="
var tableSvc = azure.createTableService(account, key);

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
        //console.log(memberInfo)

        tableSvc.createTableIfNotExists('servicerecord', function(error, result, response){
            if(!error){
                // Table exists or created
                var task1 = {
                    PartitionKey: {'_':memberInfo["gameId"]}, // GameId
                    RowKey: {'_': memberInfo["aadObjectId"]}, // AADID
                    name: {'_':memberInfo["name"]},
                    reply: {'_':memberInfo["reply"]}
                };

                var batch = new azure.TableBatch();
                batch.insertEntity(task1, {echoContent: true});

                tableSvc.executeBatch('servicerecord', batch, function (error, result, response) {
                    if(!error) {
                    // Batch completed
                    }
                });
            }
        });

    }

    static updateGameResponses(response){
        var reply = response["reply"]

        tableSvc.retrieveEntity('servicerecord',response["gameId"], response["aadObjectId"], function(error, result, response){
            if(!error){
              // result contains the entity
              result["reply"]={ _: reply }
        
              tableSvc.replaceEntity('servicerecord', result, function(error, result, response){
                if(!error) {
                  // Entity updated
                }
              });
        
            }
        });

    }

    static saveResponseId(resid){

        console.log(resid)

        tableSvc.createTableIfNotExists('response', function(error, result, response){
            if(!error){
                
                var task1 = {
                    PartitionKey: {'_':resid["gameId"]}, // GameId
                    RowKey: {'_': resid["gameId"]}, // cardId
                    cardId: {'_': resid["cardId"]}, // cardId
                };

                var batch = new azure.TableBatch();
                batch.insertEntity(task1, {echoContent: true});

                tableSvc.executeBatch('response', batch, function (error, result, response) {
                    if(!error) {
                    // Batch completed
                    }
                });
            }
        });
    }

    static getResponseId(resid){

    }
}

module.exports = Database