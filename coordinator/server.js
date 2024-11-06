const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('../proto/database.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).database;




// TEST INIT CLIENT

const DataNodes = [
     new proto.Database('localhost:50051', grpc.credentials.createInsecure()),
     new proto.Database('localhost:50053', grpc.credentials.createInsecure()),


    
];

// Sharding Logic

const getShardIndex = (key) =>{
    // Hash the key
    const hash = require('crypto').createHash('md5').update(key).digest('hex');
    return parseInt(hash, 16) % DataNodes.length; // return the shard index
}





const server = new grpc.Server();


server.addService(proto.Database.service, {
    Get: (call, callback) => {
      const shardIndex = getShardIndex(call.request.key)
      DataNodes[shardIndex].Get(call.request, callback);
    },
    Set: (call, callback) => {
        const shardIndex = getShardIndex(call.request.key)
        DataNodes[shardIndex].Set(call.request, callback);
    },
  });




  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Coordinator node listening on port 50052');
    server.start();
  });