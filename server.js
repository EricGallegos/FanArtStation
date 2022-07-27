const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
require('dotenv').config();

const connectionString = process.env.DB_STRING;
let db, mediaCollection, dbName = 'CreationStation';

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongo.connect(connectionString)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    mediaCollection = db.collection('Media');

    const cursor = mediaCollection.find().toArray()
      .then( collection => {
        collection.forEach( entry => {
            firstSplash.push(entry);
        })
      }).catch(error => console.log(error));

}).catch(error => console.log(error));

// HOME //
app.get('/', (request, response) => {

  response.render('index', {firstSplash});
})

// Info API //
// GET
app.get('/api/info', (request, response) =>{
  let time = new Date();
  response.send(`<p>FanArtStation has ${firstSplash.length} badass pieces of art</p> <p>${time} </p>`);
});

// Art Collection API //
// GET
app.get('/api/art', (request, response) => {
  response.json(art);
});

app.get('/api/art/:id', (request, response) => {
  const id = Number(request.params.id);
  const piece = art.find(art => art.id === id);

  if(piece){
    response.json(piece);
  }else {
    response.status(404).end();
  }
});

// POST
app.post('/api/art', (request, response) => {
  const body = request.body;
  console.log(request.body);
  if(!body.url || !body.ip || !body["media-type"]){
    return response.status(400).json({ error: 'content missing' });
  }

  const piece = {
    id: generateID(),
    url: body.url,
    date: new Date(),
    "media-type": body["media-type"],
    tags: body.tags || [],
    ip: body.ip
  }
  art = art.concat(piece);
  response.json(piece);
});

// Fill MongoDB with sample images
app.post('/api/addMedia', (request, response) =>{
  console.log(testMedia);
  testMedia.forEach(image => {
    mediaCollection.insertOne(image)
      .then(result => {
        console.log(result);
        return;
      })
      .catch(error => console.log(error))
  })
  response.redirect('/');
});

// DELETE
app.delete('/api/deleteMedia', (request, response) => {
  mediaCollection.deleteMany( { } )
  .then(result => {
    console.log('deletion complete')
    response.redirect('/');
  })
  .catch(error => console.error(error))
})

app.delete('/api/art/:id', (request, response) =>{
  const id = Number(request.params.id);
  art = art.filter(art => art.id !== id);
  console.log(art.length)
  response.status(204).end();
});

app.delete('/api/art/delete/:url', (request, response) =>{
  const url = request.params.url;
  art = art.filter(art => art.url !== url);
  console.log('Deleted: ', url)
  response.status(204).end();
});

// Class containing all information pertaining to any single piece of fanart //

class Media{
  constructor( {name, url, creator, date, uploadedBy, accountURL} ){
    this.name = name || "KDA Evelynn";
    this.url = url || "#";
    this.creator = creator || 'John Snoe';
    this.date = new Date();
    this.uploadedBy = uploadedBy;
    this.upvotes = 0;
    this.accountURL = accountURL;
  }
}


const creations = [
  { url: 'https://cdna.artstation.com/p/assets/images/images/014/649/132/large/parzival-kda-evelyym.jpg?1544834412' },
  { url: 'https://cdnb.artstation.com/p/assets/images/images/008/666/799/large/andres-blanco-dvafanartsss-ahora-si-final.jpg?1514408536' },
  { url: 'https://external-preview.redd.it/LGiMRW0B-Mz2KzTORYU-w2gp93R2Q5a7C4F1fDLkhiA.png?auto=webp&s=962911c344ecc4d6629b356ea42b60cfe88bfe02' },
  { url: 'http://www.themanwiththehat.de/files/attachments/pZZ7xT1g.jpg' },
  { url: 'https://i.pinimg.com/736x/9a/ea/99/9aea99d61bfd50a9d6aadb4469be33a4.jpg' },
  { url: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/e72b3157750847.59e232905123e.jpg'},
  { url: 'https://external-preview.redd.it/3czaaDd4GSc-0-3gk8VTDi4yYdYjLrxln-iGvSLUQ4o.jpg?auto=webp&s=ad9739951fe88186d17784138fcc4a9d6fa98060'},
  { url: 'https://assets.wallpapersin4k.org/uploads/2017/04/Wallpaper-Fan-Art-21.jpg'},
  { url: 'http://pm1.narvii.com/7319/87253137c79924ac8bef849df9ab76369318c316r1-2048-2047v2_uhq.jpg'},
  { url: 'https://static.wikia.nocookie.net/f8c3ae14-b1be-4dea-a0e0-19c40868845c/scale-to-width/755'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/001/207/916/large/oreki-genya-x.jpg?1442227975'},
  { url: 'https://cdnb.artstation.com/p/assets/images/images/014/607/823/large/aj-ramos-goblin-slayer-final-2.jpg?1544677847'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/016/614/660/large/femke-brouwer-pikachu10.jpg?1552833465'},
]
let testMedia = []
let firstSplash = []

function populateTestMedia(){
  for(let i = 0; i < 13; i++){
    testMedia.push(new Media({url: creations[i].url}))
  }
}
populateTestMedia();

const PORT = 3001;
app.listen(PORT);
console.log(`server is running on ${PORT}`);


const generateID = () => {
  const maxID = art.length > 0
    ? Math.max(...art.map(n => n.id)) //Find largest id # in collection
    : 0
  return maxID + 1;
}
////////////////////////////////////////////////////////////////////////////////////
