const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;
const Media = require('./modules/Media');
const User = require('./modules/User');
require('dotenv').config();

const connectionString = process.env.DB_STRING;
const PORT = process.env.PORT;
let db, mediaCollection, dbName = 'CreationStation';
collectionName = 'Media'
let splashes = [];
let numOfSplashes = 6;
let splashNames = ['Latest', 'Hot', 'Top this week', 'All Timers', 'Up and Coming', 'May have Missed']

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/api/Auth', require('./modules/Auth/Route'))
// MongoDB Connection //
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

app.get('/myProfile', (request, response) =>{
  response.send('Hello User X!');
});

app.get('/login', (request, response) =>{
  response.send('Input username and password');
});

app.get('newAccount'), (request, response) =>{
  response.send('To create a new account input a username and password');
}

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




const creations = [
  { url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bded83c2-9666-4913-afaf-29ae29e5c24e/df939zw-e57f01e2-772b-41c0-8e1e-0df3f1e11201.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JkZWQ4M2MyLTk2NjYtNDkxMy1hZmFmLTI5YWUyOWU1YzI0ZVwvZGY5Mzl6dy1lNTdmMDFlMi03NzJiLTQxYzAtOGUxZS0wZGYzZjFlMTEyMDEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.xspa5TOpFs3I6DWVC1x0DkIqccC7y0Tg3rvrPtif3kw' },
  { url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6ad89ded-81c3-4729-b58c-4967487db49e/df946gc-3201ff53-5efd-466b-bc37-56a52eb068de.jpg/v1/fill/w_900,h_1125,q_75,strp/starlight_by_emryn_art_df946gc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTEyNSIsInBhdGgiOiJcL2ZcLzZhZDg5ZGVkLTgxYzMtNDcyOS1iNThjLTQ5Njc0ODdkYjQ5ZVwvZGY5NDZnYy0zMjAxZmY1My01ZWZkLTQ2NmItYmMzNy01NmE1MmViMDY4ZGUuanBnIiwid2lkdGgiOiI8PTkwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.hiWUVyEDA-EBUmO86zaY-2x4G64P64yqXxyqF6hhPrg' },
  { url: 'https://cdnb.artstation.com/p/assets/images/images/051/879/845/large/k-e.jpg?1658394576' },
  { url: 'https://cdnb.artstation.com/p/assets/images/images/052/141/181/large/israel-juarez-tlapale-2.jpg?1659037601' },
  { url: 'https://cdnb.artstation.com/p/assets/images/images/052/138/445/4k/josephine-chang-ranni-fullres.jpg?1659030773' },
  { url: 'https://cdna.artstation.com/p/assets/images/images/050/158/512/large/fragan-tanguy-artsta.jpg?1654183199'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/051/758/236/4k/yyhaili-001.jpg?1658131833'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/050/601/942/large/rebeca-puebla-pride-md-red.jpg?1655233877'},
  { url: 'https://c4.wallpaperflare.com/wallpaper/1/456/840/lol-league-of-legends-fan-art-fiora-wallpaper-preview.jpg'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/050/379/160/large/n-i-x-e-u-kai-sa-tt.jpg?1654705546'},
  { url: 'https://cdnb.artstation.com/p/assets/images/images/051/816/613/large/mauricio-salgueiro-bronx-render-setupa-1003-exposure.jpg?1658244525'},
  { url: 'https://cdnb.artstation.com/p/assets/images/images/051/936/833/large/edu-souza-mandalorian.jpg?1658527721'},
  { url: 'https://cdna.artstation.com/p/assets/images/images/051/504/130/large/alex_che-alex-che-alexey-cheremnykh-mgs-portraits-02.jpg?1657473474'},
]
let testMedia = []
let firstSplash = []


function populateTestMedia(){
  for(let i = 0; i < 13; i++){
    testMedia.push(new Media({url: creations[i].url}))
  }
}
populateTestMedia();

const generateID = () => {
  const maxID = art.length > 0
    ? Math.max(...art.map(n => n.id)) //Find largest id # in collection
    : 0
  return maxID + 1;
}

app.listen(PORT);
console.log(`server is running on ${PORT}`);



////////////////////////////////////////////////////////////////////////////////////
