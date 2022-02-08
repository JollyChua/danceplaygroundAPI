const express = require("express");
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken')
require('dotenv').config();

const MongoUtil = require('./MongoUtil') 

const MONGO_URI = process.env.MONGO_URI
let app = express();
app.use(cors())
app.use(express.json());
//------------Pattern
let signUp = [
  {
    accountNum: 1,
    fName: "Jolly",
    lName: "Chua",
    userName: "JChua15",
    email: "jolly_chua@email.com",
    password: "Orayt156"
  }
];
//------------Pattern
let login = [];
//================== Routes for const signUp
app.post("/members", function (req, res) {
  const postAmember = {
    accountNum: signUp.length + 1,
    fName: req.body.fName,
    lName: req.body.lName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
  };
  signUp.push(postAmember);
  res.send(postAmember);
});
app.get("/members", function (req, res) {
  res.send(signUp);
});

app.put("/editAccount/:email", function (req, res) {
  let findAmember = signUp.find((c) => c.email === req.params.email);
  if (!findAmember)
    return res.status(404).send("The member with that email was not found");
  findAmember.fName = req.body.fName;
  findAmember.lName = req.body.lName;
  findAmember.userName = req.body.userName;
  findAmember.email = req.body.email;
  findAmember.password = req.body.password;
  res.send(findAmember);
});
app.delete("/deleteAccount/:accountNum", function (req, res) {
  let findAmember = signUp.find((c) => c.accountNum === parseInt(req.params.accountNum));
  if (!findAmember)
    return res.status(404).send("The member with that email was not found");
  const index = signUp.indexOf(findAmember);
  res.send(index);
  classes.splice(index, 1);
  res.send(findAmember);
});

function ensureToken(req, res, next){
  const  bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
  } else {
    res.sendStatus(403)
  }
};

//Routes
async function main(){
  await MongoUtil.connect(MONGO_URI, "danceplaygroundAPI");

   // working - Display all added classes  
  app.get("/AddClasses", async function (req, res) {
    const db = MongoUtil.getDB();
    let classRecords = await db.collection('classes').find({}).toArray();
    res.send(classRecords);
  });
  // working - Pull-up a class
  app.get("/class/:id", async function (req, res) {
    let id = req.params.id
    const db = MongoUtil.getDB();
    let findAclass = await db.collection('classes').findOne({
      '_id': ObjectId(id)
    });
    if (!findAclass)
      return res.status(404).send("The class with that id was not found");
    else{  
    res.send(findAclass)};
  });

  // working - Edit a class 
  app.patch("/class/:id", async function (req, res) {
    let id = req.params.id
    const db = MongoUtil.getDB()
    let updateAclass = {
      'name': req.body.name,
      'location': req.body.location,
      'schedule': req.body.schedule,
      'duration': req.body.duration,
      'complexity': [req.body.complexity],
      'best_for': req.body.best_for,
      'category': req.body.category,
      'price': req.body.price,
      'schedule': req.body.schedule,
      'link': req.body.link,
      'instructorName': req.body.instructorName,
      'email': req.body.email,
      'password': req.body.password,
    };
    await db.collection('classes').updateOne({
      '_id': ObjectId(id)
    },{
      '$set': updateAclass
    });
    res.send(updateAclass)
  });
  //working - Delete a class 
  app.delete("/delete.class/:id", async function(req, res){
    const db = MongoUtil.getDB()
    let deleteAclass = {
      'name': req.body.name,
      'location': req.body.location,
      'price': req.body.price,
      'schedule': req.body.schedule,
      'link': req.body.link,
    };
    await db.collection('classes').deleteOne({
      '_id': ObjectId(req.params.id)
    })
    res.send(deleteAclass)
  })
  
  app.get('/delete.class.2/:id', async function(req, res){
    //retrieve from the mongo db the document with the same req.params.id
    const db = MongoUtil.getDB();
    const documentToDelete = await db.collection('classes').findOne({
         '_id': ObjectId(req.params.id)
    })
    res.render('confirm_delete_class_record',{
      'classRecord': documentToDelete
    })
  })



  //Routes for Login
  // working - Display all added users
//  app.get("", async function (req, res) {
  //  const db = MongoUtil.getDB();
   // let logInDetails = await db.collection('logIn').find({}).toArray();
   // res.send(logInDetails);
  //});
  // // working - Post a user
  // app.post("", async function (req, res) {
  //   const userLogIn = {
  //     fName: req.body.fName,
  //     lName: req.body.lName,
  //     email: req.body.email,
  //     password: req.body.password
  //   };
  //   const db = MongoUtil.getDB();
  //   await db.collection('logIn').insertOne(userLogIn)
  //   res.send(userLogIn);
  // });

  // Trial Second Batch
  // working - Display all added classes  2
  app.get("/OurClasses", async function (req, res) {
    const db = MongoUtil.getDB();
    let classRecords = await db.collection('classes').find({}).toArray();
    res.send(classRecords);
  });

  //Wonderful! It's working! - Add a class
  app.post("/TryClass", async function (req, res) {
    console.log(req.body)
    const postAclass = {
      name: req.body.name,
      location: req.body.location,
      price: req.body.price,
      schedule: req.body.schedule,
      link: req.body.link,
      email: req.body.email,
      password: req.body.password,
      duration: req.body.duration,
      complexity: [req.body.complexity],
      best_for: req.body.best_for,
      category: req.body.category,
      instructorName: req.body.instructorName,
    };
    const db = MongoUtil.getDB();
    const classes = await db.collection('classes').insertOne(postAclass)
    res.send(classes);
  });


  // working - Edit a class  2
  app.patch("/Eclass/:id", async function (req, res) {
    let id = req.params.id
    const db = MongoUtil.getDB()
    let updateAclass = {
      'name': req.body.name,
      'location': req.body.location,
      'price': req.body.price,
      'schedule': req.body.schedule,
      'link': req.body.link,
    };
  if (('email' === req.body.email) && ('password' === req.body.email)){
      await db.collection('classes').updateOne({
                                                '_id': ObjectId(id)
                                                },{
                                                  '$set': updateAclass
                                                });
      res.send(updateAclass)}
    else{
      res.send("Your email or passowrd did not match any admin's credentials")
    }
  });
   // working - Display all 30 mins classes  
   app.get("/durationClassesSearch", async function (req, res) {
    const db = MongoUtil.getDB();
    let classRecords = await db.collection('classes').find(
      {"duration":"30mins"}
      ).toArray();
    res.send(classRecords);
  });

   // working - Display all 1hr classes  
   app.get("/oneHR", async function (req, res) {
    const db = MongoUtil.getDB();
    let classRecords = await db.collection('classes').find(
      {"duration":"1hr"}
      ).toArray();
    res.send(classRecords);
  });

  // working - Display all 1hr classes  
  app.get("/twoHR", async function (req, res) {
    const db = MongoUtil.getDB();
    let classRecords = await db.collection('classes').find(
      {"duration":"2hrs"}
      ).toArray();
    res.send(classRecords);
  });

  //End of Trial Second Batch 2

  // working - Post a user
  app.post("", async function (req, res) {
    const userLogIn = {
      email: req.body.email,
      password: req.body.password,
    };
    const db = MongoUtil.getDB();
    const token = jwt.sign({ userLogIn }, 'my_secret_key' );
    await db.collection('logIn').insertOne(userLogIn)
    res.json({token: token});
  });

  

  // get a list of users  
  app.get("/home", ensureToken, async function (req, res) {
    const db = MongoUtil.getDB();
    let logInDetails = await db.collection('logIn').find({}).toArray();
          jwt.verify(req.token, 'my_secret_key', function(err, data){
            if (err) {l
              res.sendStatus(403)
            }else{
              res.send(logInDetails);
            }
    })
  });

   // working - Post a user
   app.post("/SignUp", async function (req, res) {
     const postAmember = {
      fName: req.body.fName,
      lName: req.body.lName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      password_confirm: req.body.password_confirm,
  };
     const db = MongoUtil.getDB();
     await db.collection('SignUp').insertOne(postAmember)
    res.send(postAmember);
  });
}

main()
//---------------Port
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`server has started on local host/port ${port}`);
});
