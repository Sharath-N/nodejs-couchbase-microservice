const productDataService = require("../dataService/productDataServiceCb");

async function routes(fastify, options) {
  //create new product
  fastify.route({
    method: "POST",
    url: "/products",
    schema: {
      description:
        "New product can be added to the database",
      summary: "Add new product",
      body: {
        type: "object",
        properties: {
          productId: { type: "string" },
          productBarCode: { type: "string" },
          productName: { type: "string" },
          productShortDescriptionigin: { type: "string" },
          productCategory: { type: "string" },
          costPerUnit: { type: "number" },
          unitOfMeasurement: { type: "string" },
          hasExtendedWarranty: {type:"string"},
          weightperUnit: { type: "number" }
        }
      }
    },
    handler: async function (request, reply) {
      await productDataService
        .addProduct(request.body)
        .then(response => {
          // console.log("..........ROUTES Inside THEN.........\n", response);
          reply.status(201);
          reply.header("Location", "/products/" + response.productId);
          reply.send();
        })
        .catch(error => {
          // console.log("..........ROUTES Inside CATCH.........\n", error);
          reply.status(406);
          reply.header("Location", "/products/" + error.message);
          reply.send({ message: error.message });
        });
    }
  });

  fastify.route({
    method: "POST",
    url: "/products/multiple",
    schema: {
      description: "Adding group of new products",
      summary: "Creating new products in database using one single request",
      body:{
        type:"array"
      }
    },
    handler: async function (request, reply) {
      await productDataService
        .addMultipleProduct(request.body)
        .then(response => {
          reply.status(201);
          reply.send(response);
        })
        .catch(error => {
          reply.status(406);
          reply.send({ message: error.message });
        });
    }
  });

  //get all products
  fastify.route({
    method: "GET",
    url: "/products",
    schema: {
      description: "To get all the products",
      summary: "View All Product Details"
    },
    handler: async function (request, reply) {
      productDataService
        .getAllProducts()
        .then(response => {        
          reply.status(200);
          reply.send(response);
        })
        .catch(error => {
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });


  //get product bt productId
  fastify.route({
    method: "GET",
    url: "/products/:productId",
    schema: {
      description: "Enter the id of product to get product details",
      summary: "View Product Details",
      params: {
        productId: { type: "string" }
      }
    },
    handler: async function (request, reply) {
      await productDataService
        .getProductById(request.params.productId)
        .then(response => {
          reply.status(200);
          reply.send(response);
        })
        .catch(error => {
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });


  //get product by product category
  fastify.route({
    method: "GET",
    url: "/products/category/:productCategory",

    schema: {
      description: "Get all the products for a category",
      summary: "View  All Products for a  Category",
      params: {
        productCategory: { type: "string" }
      }
    },
    handler: async function (request, reply) {
      await productDataService
        .getProductByCategory(request.params.productCategory)
        .then(response => {
          reply.status(200);
          reply.send(response);
        })
        .catch(error => {
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });

  //update product databy productId
  fastify.route({
    method: "PUT",
    url: "/products/:productId",
    schema: {
      description: "Change particular product details",
      summary: "Update Product details",
     
      params: {
        productId: { type: "string" }
      },
      body: {
        type: "object",
        properties: {
          productId: { type: "string" },
          productBarCode: { type: "string" },
          productName: { type: "string" },
          productShortDescriptionigin: { type: "string" },
          productCategory: { type: "string" },
          costPerUnit: { type: "number" },
          unitOfMeasurement: { type: "string" },
          hasExtendedWarranty: {type:"string"},
          weightPerUnit: { type: "number" }
        }
      }
    },
    handler: async function (request, reply) {
      productDataService
        .updateProductById(request.params.productId, request.body)
        .then(response => {
          reply.status(204);
          reply.send(response);
        })
        .catch(error => {
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });

  //delete product by productID
  fastify.route({
    method: "DELETE",
    url: "/products/:productId",
    schema: {
      description: "Delete particular product ",
      summary: "Delete Product",
      params: {
        productId: { type: "string" }
      }
    },
    handler: async function (request, reply) {
      productDataService
        .deleteProductById(request.params.productId)
        .then(response => {
          reply.status(204);
          reply.send(response);
        })
        .catch(error => {
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });

  fastify.route({
    method: "PUT",
    url: "/products/clear",
    handler: async function (request, reply) {
      productDataService
        .truncateTable()
        .then(response => {
          console.log("ROUTES : ", response);
          reply.status(204);
          reply.send(response);
        })
        .catch(error => {
          console.log("ROUTES : ", error);
          reply.status(404);
          reply.send({ message: error.message });
        });
    }
  });

}

module.exports = routes;
