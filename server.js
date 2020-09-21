const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const app = express();
const url = 'mongodb://localhost:27017';

let db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

app.get("/", (req, res) => {
    res.send(heroes);
})

app.get("/heroes", (req, res) => {
    db.collection('heroes').find().toArray((err, docs) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
})

app.get("/heroes/:id", (req, res) => {
    db.collection("heroes").findOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
    })
    res.send(doc);
})

app.post('/heroes', (req, res) => {
    const hero = {
        nickname: req.body.nickname,
        realname: req.body.realname,
        description: req.body.description,
        superpower: req.body.superpower,
        catchphrase: req.body.catchphrase
    };    
    db.collection('heroes').insert(hero, (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(hero);
    } )    
  })

app.put('/heroes/:id', (req, res) => {
    db.collection("heroes").updateOne(
        { _id: ObjectID(req.params.id) },
        {
            nickname: req.body.nickname,
            realname: req.body.realname,
            description: req.body.description,
            superpower: req.body.superpower,
            catchphrase: req.body.catchphrase 
        },
        (err, result) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
})

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

MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    db = client.db('jsnapi');
    console.log("Connected successfully to server");
    app.listen(3030, () => {
        console.log('api app works')
    });

})
