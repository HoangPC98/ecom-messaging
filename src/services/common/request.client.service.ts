import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, '../../proto/customers/customer.proto'));
const packageDefinitionProc = protoLoader.loadSync(path.join(__dirname, '../../proto/customers/customer.proto'));
const recipesProto = grpc.loadPackageDefinition(packageDefinitionReci) as any;
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc) as any;


const recipesStub = new recipesProto.Recipes('0.0.0.0:50052', grpc.credentials.createInsecure());
// const processingStub = new processingProto.Processing('0.0.0.0:50052',
//   grpc.credentials.createInsecure());

let productId = 1000;
let orderId = 1;

console.log(`Searching a recipe for the product: ${productId}`);

export function callre(err: any, recipe: any) {

  const call = recipesStub.process({ orderId, recipeId: recipe.id });
  call.on('data', (statusUpdate: any) => {
    console.log('Order status changed:');
    console.log(statusUpdate);
  });
  call.on('end', () => {
    console.log('Processing done.');
  });
};
