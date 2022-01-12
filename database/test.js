console.log("testing")

var azure = require('azure-storage');

account = "temendeiudiuw"
key = "DHL+IzkxIdvg6o5MroWnuOrw2WtlAT5rXLsiFezZTDoD5p2NdzH9mxTkWlsdzyzRtF72j8sGU/aXe1iqn9fmOw=="

var tableSvc = azure.createTableService(account, key);

/*
tableSvc.createTableIfNotExists('servicerecord', function(error, result, response){
    if(!error){
      // Table exists or created
      var task1 = {
        PartitionKey: {'_':'hometaskss'}, // GameId
        RowKey: {'_': '21'}, // AADID
        name: {'_':'Tuhi the trash'},
        reply: {'_':new Date(2015, 6, 20)}
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
*/

tableSvc.retrieveEntity('servicerecord','t3kse', 'eab8cba2-373a-4661-9269-a9f6cd5bdfa7', function(error, result, response){
    if(!error){
      // result contains the entity
      console.log("here")
      result["reply"]={ _: 'paper' }

      tableSvc.replaceEntity('servicerecord', result, function(error, result, response){
        if(!error) {
          // Entity updated
        }
      });

    }
});

