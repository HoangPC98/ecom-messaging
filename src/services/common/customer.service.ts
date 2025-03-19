import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const protoPath = process.cwd() + '/../' + '/ecom-protos-grpc/customers/customer.proto';
const packageDefinition = protoLoader.loadSync(
  protoPath,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const customerProto = grpc.loadPackageDefinition(packageDefinition).Customer as any;
const RECIPES = [
  {
    id: 100,
    productId: 1000,
    name: 'Pizza',
    notes: 'See video: pizza_recipe.mp4. Use oven No. 12'
  },
  {
    id: 200,
    productId: 2000,
    name: 'Lasagna',
    notes: 'Ask from John. Use any oven, but make sure to pre-heat it!'
  }
];

let news = [
  { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
  { id: "2", title: "Note 2", body: "Content 2", postImage: "Post image 2" },
];

interface NewsList {
  news: any[];
}

export function find(call: any, callback: any) {
  let recipe = RECIPES.find((recipe) => recipe.productId == call.request.id);
  console.log('GET findRecipe', call.request.id)
  if (recipe) {
    callback(null, recipe);
  }
  else {
    callback({
      message: 'Recipe not found',
      code: grpc.status.INVALID_ARGUMENT
    });
  }
}

export function findOne(call: any, callback: any) {
  let recipe = RECIPES.find((recipe) => recipe.productId == call.request.id);
  console.log('REquest...', call.request)
  console.log('GET news', recipe)
  if (recipe) {
    callback(null, recipe);
  }
  else {
    callback({
      message: 'Recipe not found',
      code: grpc.status.INVALID_ARGUMENT
    });
  }
} 

export function getAllNews(call: any, callback: any) {
  console.log('GET Request', call.request)
  console.log('GET findRecipe', call.request.id)
  console.log('GET news', news)
  const newsList: NewsList = { news };
    callback(null, newsList);
}

export function clientRequest(call: any, callback: any) {
  const client = new customerProto.CustomersService('0.0.0.0:5000', grpc.credentials.createInsecure());
  client.find({ id: call.request.id || 1000 }, (err: any, recipe: any) => {
    console.log('GET clientRequest', recipe, err)
    if (err) {
      console.log('Error', err);
      callback(err);
    }
    else {
      callback(null, recipe);
    }
  });
}