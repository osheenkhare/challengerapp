console.log("testing")

var azure = require('azure-storage');


var tableSvc = azure.createTableService(account, key);

tableSvc.createTableIfNotExists('mytable', function(error, result, response){
    if(!error){
      // Table exists or created
      var task1 = {
        PartitionKey: {'_':'hometaskss'},
        RowKey: {'_': '21'},
        newnew: {'_':'Tuhi the trash'},
        dueDate: {'_':new Date(2015, 6, 20)}
      };

      var batch = new azure.TableBatch();
      batch.insertEntity(task1, {echoContent: true});

      tableSvc.executeBatch('mytable', batch, function (error, result, response) {
        if(!error) {
          // Batch completed
        }
      });

    }
});