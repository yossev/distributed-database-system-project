const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('../proto/database.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).database;

const { pgClients, getShardIndex } = require('./sharding');

// Datanode takes the data from the coordinator node and stores the data.

const storage = {}

// This gRPC Server runs to handle client node communication.
const server = new grpc.Server();

// Handle Data Setting and retrieval, including redis caching for queries
 server.addService(proto.Database.service, {
    Get: async (call, callback) =>{
        const cacheValue = redisClient.get(call.request.key);
        
        if (cacheValue) {
            callback(null, { value: cacheValue });
            return;
        }
        const value = storage[call.request.key] || ""
        await redisClient.set(call.request.key, value);
        callback(null, { value });
    },
    Set: async (call, callback) =>{
        storage[call.request.key] = call.request.value;
        await redisClient.set(call.request.key, call.request.value)
        callback(null, {status: "success"});
    },
});



server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Data node listening on port 50051');
    server.start();
});