const express = require('express'); 
const bodyParser = require('body-parser'); 
const MongoClient = require('mongodb').MongoClient; 
const assert = require('assert'); 
const ObjectID = require('mongodb').ObjectID; 
const app = express(); 
const url = 'mongodb://localhost:27017'; 

let db;
/*for json: application/json
and formData: application/x-www-form-urlencoded*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

app.get("/", (req, res) => {
    res.send(heroes);
})
//method for viewing all HERO in DB
app.get('/heroes', function (req, res) {
    db.collection('heroes').find().toArray(function (err, docs) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(docs);
    })
  })
//method for find and view some choisen one hero
  app.get('/heroes/:id', function (req, res) {
    db.collection('heroes').findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(doc);
    })
  })
//method for create new hero card
app.post('/heroes', (req, res) => {
    const hero = {
        nickname: req.body.nickname.toString(),
        realname: req.body.realname.toString(),
        description: req.body.description.toString(),
        superpower: req.body.superpower.toString(),
        catchphrase: req.body.catchphrase.toString()
    };    
    db.collection('heroes').insert(hero, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(hero);
    } )    
  })
//method for upload and change information in choisen hero card
  app.put('/heroes/:id', (req, res) => {
    db.collection('heroes').update(
        { _id: ObjectID(req.params.id) },
        {
            $set: { nickname: req.body.nickname,
                    realname: req.body.realname,
                    description: req.body.description,
                    superpower: req.body.superpower,
                    catchphrase: req.body.catchphrase}
            
        },
        {  upsert: false  },
        function (err, result) {
            if (err) {
                console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
      }
    )
})
//method for delete choisen hero card
app.delete('/heroes/:id', (req, res) => {
    db.collection('heroes').deleteOne(
        { _id: ObjectID(req.params.id) },
        (err, result) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
        res.sendStatus(200);
      })
    
})
//connecting MongoClient and mongodb
MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    db = client.db('jsnapi');
    console.log("Connected successfully to server");
    app.listen(3030, () => {
        console.log('api app works')
    });

})
