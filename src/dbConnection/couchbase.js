// Couchbase and Ottoman Instantiation
let couchbase = require("couchbase");
let ottoman=require('ottoman');

// Open a cluster and authenticate with valid credentials
var cluster = new couchbase.Cluster(process.env.COUCHBASE_HOST || "couchbase://localhost");
cluster.authenticate(process.env.COUCHBASE_USERNAME || 'Administrator',
                     process.env.COUCHBASE_PASSWORD || 'adminadmin');
// cluster.authenticate(process.env.COUCHBASE_USERNAME, process.env.COUCHBASE_PASSWORD);

var bucket = cluster.openBucket(process.env.COUCHBASE_BUCKET || "posdb", 
  function(err) {
    if (err) {
      console.log("Can't connect to bucket: %s", err);
    }
    console.log('Connected to bucket : %s', bucket);
  }
);

//ottoman.bucket=myBucket;
ottoman.store = new ottoman.CbStoreAdapter(bucket, couchbase);
// bucket.operationTimeout = 120 * 1000;

module.exports = {
  N1qlQuery: couchbase.N1qlQuery,
  bucket: bucket,
  ottoman: ottoman
};