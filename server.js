const express = require('express')
const cors = require('cors')
// below 2 import syntax for .env
const dotenv = require('dotenv')
dotenv.config()

// below 6 are syntax to use mongodb 
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
// Connecting to the MongoDB Client
const url = process.env.MONGO_URL;
const client = new MongoClient(url);
async function connect() {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCAFile: "<path_to_CA_certificate>" // Ensure the path to your CA certificate is correct
    });
  
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Connection error", err);
    } finally {
      await client.close();
    }
  }
  
  connect();
// assign database name to variable dbName
const dbName = process.env.DB_NAME 
const app = express()
const port = process.env.PORT 


// Middleware
app.use(bodyparser.json()) //body-parser middleware is to parse incoming request bodies in JSON, URL-encoded, or raw format, and make the parsed data available in the req.body object.
app.use(cors()) // allows only our frontend client localhost to access data from server running '/' etc endpoints. & blocks other website to access our endpoints data

// Get all the passwords
app.get('/', async (req, res) => {
    // fetch the database if it already exists (if empty returns empty array as db not exist)
    const db = client.db(dbName);
    //  get a reference to a "passwords" collection(table) within the MongoDB database.
    const collection = db.collection('passwords');
    // to fetch all documents(rows) as array
    const findResult = await collection.find({}).toArray();
    // now converts the array as json of documents-passwords
    res.json(findResult)
})

// Save a password
app.post('/', async (req, res) => { 
    const password = req.body //available as json due to bodyparser middleware
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    // syntax to insert a password document(row) to 'passwords' collection
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Delete a password by id
app.delete('/', async (req, res) => { 
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({success: true, result: findResult})
})


app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})