const express = require('express');
const app = express();

app.use(express.json());
let art = [
  {
    id: 0,
    url: 'xoxo',
    date: 'date/time',
    "media-type": "image",
    tags: [],
    ip: "LOTR"
  },
  {
    id: 1,
    url: 'xoxo',
    date: 'date/time',
    "media-type": "image",
    tags: [],
    ip: "Harry Potter"
  },
  {
    id: 2,
    url: 'xoxo',
    date: 'date/time',
    "media-type": "image",
    tags: [],
    ip: "LOTR"
  }
];

// HOME //
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

// Info API //
// GET
app.get('/api/info', (request, response) =>{
  let time = new Date();
  response.send(`<p>FanArtStation has ${art.length} badass pieces of art</p> <p>${time} </p>`);
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

// DELETE
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

const PORT = 3001;
app.listen(PORT);
console.log(`server is running on ${PORT}`);


const generateID = () => {
  const maxID = art.length > 0
    ? Math.max(...art.map(n => n.id)) //Find largest id # in collection
    : 0
  return maxID + 1;
}
