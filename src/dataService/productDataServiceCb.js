const ProductPromise = require("./productDataServiceHandlerCb");

async function addProduct(product) {
  var data = {};

  await ProductPromise.getProduct(product.productId).then(async response => {
    if(response != null){
      console.log("Res ::", response);
      throw new Error("Product already exists!");
    }
    else {
      let output = await ProductPromise.addProductPromise(product).then(response => {
        console.log("Res ::", response);
        response = JSON.stringify(response);
        response = JSON.parse(response);
        data = response;
        return response;
      });
    }
  });

  return data;
}

async function addMultipleProduct(products) {
  var data = [], c = 0;

  let output =await Promise.all(   
    products.map(async product => {
      await ProductPromise.getProduct(product.productId).then(async response => {
        if(response != null) {
          console.log("Response : ", response);
          
          let message = {};
          c = c + 1;
          message.message = "Product with ID : " + product.productId + " already exists!";
          data.push(message);
          return response;
        }
        else {
          let output = await ProductPromise.addProductPromise(product).then(response => {
            response = JSON.stringify(response);
            response = JSON.parse(response);
            data.push(response);
            return response;
          });
        }
      });
    })
  );

  return data;
}

async function getAllProducts() {
  var data = [];

  let output = await ProductPromise.getAllProductsPromise().then(response => {
    response = JSON.stringify(response);
    response = JSON.parse(response);
    data = response;
    return response;
  });

  return data;
}

async function getProductById(productId) {  
  var data = {};

  let output = await ProductPromise.getProductByIdPromise(productId).then(response => {
    if(response === void(0)) {
      throw new Error("No product found for the given ID!");
    }
    response = JSON.stringify(response);
    response = JSON.parse(response);
    data = response;
    return response;
  });
  
  return data;
}

async function getProductByCategory(productCategory) {
  var data = {};

  let output = await ProductPromise.getProductByCategoryPromise(productCategory).then(response => {
    if(response.length === 0) {
      throw new Error("No product(s) found for the given category!");
    }
    response = JSON.stringify(response);
    response = JSON.parse(response);
    data = response;
    return response;
  });

  return data;
}

async function updateProductById(productId, product) {
  var data = {};

  await ProductPromise.getProduct(productId).then(async response => {
    if(response == null){
      throw new Error("No product found for the given ID!");
    }
    else {
      let output = await ProductPromise.updateProductByIdPromise(response[0], product).then(response => {
        if('code' in response) {
          throw new Error(response.message);
        }
        response = JSON.stringify(response);
        response = JSON.parse(response);
        data = response;
        return response;
      });
      return data;
    }
  });
}

async function deleteProductById(productId) {
  var data = {};

  await ProductPromise.getProduct(productId).then(async response => {
    if(response == null) {
      throw new Error("Product Does not exists.");
    }
    else {
      let output = await ProductPromise.deleteProductByIdPromise(response[0]).then(response => {
        response = JSON.stringify(response);
        response = JSON.parse(response);
        data = response;
        return response;
      });
    }
  });

  return data;
}

async function truncateTable() {
  var data = {};
  
  let output = await ProductPromise.truncateTablePromise().then(response => {
    if('code' in response) {
      throw new Error(response.message);
    }
    response = JSON.stringify(response);
    response = JSON.parse(response);
    data = response;
    return response;
  });

  return data;  
}  

module.exports = {

  getAllProducts,
  getProductById,
  addProduct,
  updateProductById,
  deleteProductById,
  getProductByCategory,
  addMultipleProduct,
  truncateTable

};