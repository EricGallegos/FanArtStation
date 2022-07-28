const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
require('dotenv').config();

const connectionString = process.env.DB_STRING;
let db, mediaCollection, dbName = 'CreationStation';
collectionName = 'Media'
let splashes = [];
let numOfSplashes = 6;
let splashNames = ['Latest', 'Hot', 'Top this week', 'All Timers', 'Up and Coming', 'May have Missed']

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));

// MongoDB Maintenance //

mongo.connect(connectionString)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    mediaCollection = db.collection(collectionName);
    updateSplashes();

}).catch(error => console.log(error));

function updateSplashes(){
  for( let i = 0; i < numOfSplashes; i++){
    splashes[i] = [];
    updateSplash(splashNames[i], i);
    if(i % 2 == 1) splashes[i].reverse();
  }
}
function updateSplash(splashName, i){
  const cursor = mediaCollection.find({}).toArray()
    .then( collection => {
      collection.forEach( document => {
        splashes[i].push(document);
      })
    })
    .catch(error => console.log(error));
}

// REST API's ///////////////////////////////////////////////////////////////
// GET
// HOME //
app.get('/', (request, response) => {
  response.render('index', {splashes, splashNames});
})


// Info API //
app.get('/api/info', (request, response) =>{
  let time = new Date();
  response.send(`<p>FanArtStation has ${firstSplash.length} badass pieces of art</p> <p>${time} </p>`);
});

// Art Collection API //
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

// Other Resources //////////////////////////////////////////////////////////////

// CLASSES //
// Class containing all information pertaining to any single piece of fanart //
class Media{
  constructor( {name, url, creator, date, uploadedBy, accountURL} ){
    this.name = name || "Trippy Smith";
    this.url = url || "#";
    this.creator = creator || 'Igrit';
    this.date = new Date();
    this.uploadedBy = uploadedBy;
    this.upvotes = 0;
    this.accountURL = accountURL;
  }
}


const creations = [
  { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRTEGVDaMqzITzzmUQBjK6nB3F8EoFrfqkrQ&usqp=CAU' },
  { url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/fanart-of-jinx-natasza-remesz.jpg' },
  { url: 'https://i.pinimg.com/736x/05/4c/e1/054ce148c5b1c730594096ccb0612080.jpg' },
  { url: 'https://www.sproutwired.com/final-fantasy-the-series-heroines-shine-in-beautiful-fan-art/' },
  { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnu1RMFjPopRbCD69CeMPQWRoPyniNFY7Tfw&usqp=CAU' },
  { url: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/e72b3157750847.59e232905123e.jpg'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/036/818/886/large/kyle-martin-mileena-splash-v4.jpg?1618707428'},
  { url: 'https://testyourmight.com/data/avatars/h/6/6457.jpg?1563600559'},
  { url: 'https://c4.wallpaperflare.com/wallpaper/1/456/840/lol-league-of-legends-fan-art-fiora-wallpaper-preview.jpg'},
  { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9U_bsQfwomVbr_d8CREON8_9zovilKcY88g&usqp=CAU'},
  { url: 'https://pbs.twimg.com/media/E8Q9OZmXsAA4RZt?format=jpg&name=large'},
  { url: 'https://lh3.googleusercontent.com/yvbSoZUtXNMPVckIE3MAuSaT5vkz1wSWj0br7SUUYtM3RSgSBIWKHiX-SJNUto5lsVWnfvdPFQc9GguXuViCNfv6uN7Az-W_EksqLlk=w600'},
  { url: 'https://i.pinimg.com/originals/a0/ed/d6/a0edd65a5343f0e972157b5c7cbbb0ef.jpg'},
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
