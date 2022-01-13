console.log("testing")

var azure = require('azure-storage');

account = "temendeiudiuw"
key = "DHL+IzkxIdvg6o5MroWnuOrw2WtlAT5rXLsiFezZTDoD5p2NdzH9mxTkWlsdzyzRtF72j8sGU/aXe1iqn9fmOw=="

var tableSvc = azure.createTableService(account, key);

var userset=[]

var query = new azure.TableQuery()
  .top(10)
  .where('PartitionKey eq ?', '6vfu');

tableSvc.queryEntities('servicerecord', query, null, function(error, result, response){
    if(!error){
      // result contains the entity
      result.entries.forEach(element=>{
        var name = "" + element["name"]["_"]
        var reply = "" + element["reply"]["_"]
        userset.push([name,reply])
        //console.log(userset)
      })
      console.log(userset)

    }
});

