const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('../proto/database.proto', {});
const proto = grpc.loadPackageDefinition(packageDefinition).database;

const client = new proto.Database('localhost:50051', grpc.credentials.createInsecure());

client.Get({ key: 'exampleKey' }, (error, response) => {
  if (!error) {
    console.log('Get Response:', response);
  } else {
    console.error(error);
  }
});

client.Set({ key: 'exampleKey', value: 'exampleValue' }, (error, response) => {
  if (!error) {
    console.log('Set Response:', response);
  } else {
    console.error(error);
  }
});
