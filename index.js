const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("orders"));
app.use(fileUpload());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4bni.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("creativeAgency").collection("services");
  const reviewsCollection = client.db("creativeAgency").collection("reviews");
  const ordersCollection = client.db("creativeAgency").collection("orders");
  const adminsCollection = client.db("creativeAgency").collection("admins");

  app.post("/addService", (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addReview", (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/services", (req, res) => {
    servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/servicesOrdered", (req, res) => {
    ordersCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/allServicesOrdered", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("This Epic Shit is Really Working!");
});

app.listen(port);
