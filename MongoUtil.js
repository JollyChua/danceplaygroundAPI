const MongoClient = require('mongodb').MongoClient

let _db;

async function connect(uri, dbname){
    let client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    console.log("Database has been connected")
}

function getDB(){
    return _db;
    console.log("Database has been connected");
}

module.exports = {
    connect,
    getDB
}