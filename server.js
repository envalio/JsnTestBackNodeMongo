const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const app = express();
const url = 'mongodb://localhost:27017';

let db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

let heroes = [
    {
        id: 1,
        nickname: 'Superman'
    },
    {
        id: 2,
        nickname: 'Batman'
    },
    {
        id: 3,
        nickname: 'Aquaman'
    }
]

app.get("/", function (req, res) {
    res.send(heroes);
})

app.get("/heroes", function (req, res) {
    db.collection('heroes').find().toArray(function (err, docs) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
})

app.post('/heroes', function (req, res) {
    let hero = {
      nickname: req.body.nickname,
      realname: req.body.realname,
      description: req.body.description,
      superpower: req.body.superpower,
      catchphrase: req.body.catchphrase
    };    
    db.collection('heroes').insert(hero, function(err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(hero);
    } )
    
  })

app.put('/heroes/:id', function (req, res) {
    let hero = heroes.find(function (hero) {
        return hero.id === Number(req.params.id)
    });
    hero.nickname = req.body.nickname;
    hero.realname = req.body.realname;
    hero.description = req.body.description;
    hero.superpower = req.body.superpower;
    hero.catchphrase = req.body.catchphrase;
    res.sendStatus(200);
})

app.delete('/heroes/:id', function (req, res) {
    heroes = heroes.filter(function (hero) {
      return hero.id !== Number(req.params.id)
    })
    res.sendStatus(200);
})



MongoClient.connect(url, (err, client) => {
    assert.equal(null, err);
    db = client.db('jsnapi');
    console.log("Connected successfully to server");
    app.listen(3030, function() {
        console.log('api app works')
    });
    client.close();
})