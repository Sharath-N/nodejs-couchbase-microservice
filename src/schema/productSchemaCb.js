const ottoman = require('../dbConnection/couchbase').ottoman;
const ULID = require('ulid')

const productSchema = 'ProductSchema';

function isUndefined(value){
  // Obtain a "undefined" value using void(0)
  if(value === void(0)) {
    throw new Error('Missing required value!');
  }
}

var productModel = ottoman.model(productSchema,
  {
    productId:{
      type: 'string',
      validator: isUndefined
      // default : ULID.ulid()
    },
    productBarCode:{
      type: 'string',
      validator: isUndefined
    },
    productName: {
      type: 'string',
      validator: isUndefined
    },
    productShortDescription:{
      type: 'string',
      validator: isUndefined
    },
    productCategory: {
      type: 'string',
      validator: isUndefined
    },
    costPerUnit: {
      type: 'number',
      validator: isUndefined
    },
    unitOfMeasurement:{
      type: 'string',
      validator: isUndefined
    },
    hasExtendedWarranty:{
      type: 'string',
      validator: isUndefined
    },
    weightPerUnit: {
      type: 'number',
      validator: isUndefined
    },
    createdAt: {
      type: 'Date'
    },
    updatedAt: {
      type: 'Date'
    }
  },
  {
    index: {
      findByProductId: {
        type: 'refdoc',
        by: 'productId'
      }
    }
  }
);

// Build the necessary indexes on the server
ottoman.ensureIndices(function(error) {
  if (error) {
    return console.error('Error: Cannot create necessary indices',  error);
  }
  console.log('Ottoman indices are ready for use!');
});


module.exports = {

  productModel,
  productSchema

};
