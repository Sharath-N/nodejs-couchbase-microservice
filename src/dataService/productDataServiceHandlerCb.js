const ProductModel = require("../schema/productSchemaCb").productModel;
const N1qlQuery = require('../dbConnection/couchbase').N1qlQuery;
const bucket = require('../dbConnection/couchbase').bucket;
const SchemaName = require("../schema/productSchemaCb").productSchema;

async function getProduct(productId) {
  let data = {};

  await new Promise(async resolve => {
    await ProductModel.find({productId : productId}, (error, resProd) => {
    if(error || resProd.length > 0) {
      //console.log("Error in GetPro is :: ", error);
      //console.log("ResProd in GetPro is :: ", resProd);
      data = resProd;
    }
    else {
      data = null;
    }
    resolve();
    });
  });

  return data;
}

async function addProductPromise(product) {
  let result = null;
  const prod = new ProductModel(product);

  let data = await new Promise(resolve => {
    prod.save(error => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result =  prod;
        resolve();
      }
    });
  });

  return result;
}

async function addMultipleProductPromise(products) {
  let result = null;

  products.forEach(async product => {
    await getProduct(product.productId).then(async response => {
      if(response != null) {        
        return response;
      }
      else {
        result  = response;
      }
    });
  });

  return result;
}

async function getAllProductsPromise() {
  let result = null;

  let data = await new Promise(resolve => {
    ProductModel.find({}, (error, products) => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result =  products;
        resolve();
      }
    });
  });

  return result;
}

async function getProductByIdPromise(productId) {
  let result = null;

  let data = await new Promise(resolve => {
    ProductModel.find({productId : productId}, (error, product) => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result =  product[0];
        resolve();
      }
    });
  });

  return result;
}

async function getProductByCategoryPromise(productCategory) {
  let result = null;

  let data = await new Promise(resolve => {
    ProductModel.find({productCategory : productCategory}, (error, products) => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result =  products;
        resolve();
      }
    });
  });
 
  return result;
}

async function updateProductByIdPromise(oldProduct, newProduct) {
  let result = null;

  oldProduct.productId = newProduct.productId;
  oldProduct.productBarCode = newProduct.productBarCode;
  oldProduct.productName = newProduct.productName;
  oldProduct.productShortDescription = newProduct.productShortDescription;
  oldProduct.costPerUnit = newProduct.costPerUnit;
  oldProduct.weightPerUnit = newProduct.weightPerUnit;
  oldProduct.unitOfMeasurement = newProduct.unitOfMeasurement;
  oldProduct.hasExtendedWarranty = newProduct.hasExtendedWarranty;
  oldProduct.productCategory = newProduct.productCategory;
  
  let data = await new Promise(resolve => {
    oldProduct.save((error) => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result = oldProduct;
        resolve();
      }
    });
  });

  return result;
}

async function deleteProductByIdPromise(product) {
  let result = null;

  let data = await new Promise(resolve => {
    product.remove((error) => {
      if(error) {
        result = error;
        resolve();
      }
      else {
        result = product;
        resolve();
      }
    });
  });

  return result;
}

async function truncateTablePromise() {
  let result = null;

  let data = await new Promise(resolve => {
    var query = N1qlQuery.fromString('DELETE FROM `' + bucket._name + '`'
            + ' WHERE CONTAINS(META().id, ' + '"' + SchemaName + '")');
    bucket.query(query, function(error, res) {
      if(error) {
        result = error;
        resolve();
      }
      else { 
        result = res;
        resolve(res);
      }
    });
  });
  
  return result;
}

module.exports = {

  getProduct,
  addProductPromise,
  addMultipleProductPromise,
  getAllProductsPromise,
  getProductByIdPromise,
  getProductByCategoryPromise,
  updateProductByIdPromise,
  deleteProductByIdPromise,
  truncateTablePromise

};
