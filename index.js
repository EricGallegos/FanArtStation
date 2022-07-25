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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/art', (request, response) => {
  response.json(art);
})

app.get('/api/art/:id', (request, response) => {
  const id = Number(request.params.id);
  const piece = art.find(art => art.id === id);

  if(piece){
    response.json(piece);
  }else {
    response.status(404).end();
  }
});

app.delete('/api/art/:id', (request, response) =>{
  const id = Number(request.params.id);
  art = art.filter(art => art.id !== id);
  console.log(art.length)
  response.status(204).end();
});

app.post('/api/art', (request, response) => {
  const body = request.body;
  console.log(request.body);
  if(!body.url){
    return response.status(400).json({ error: 'content missing' });
  }

  const piece = {
    id: generateID(),
    url: body.url,
    date: generateDate(),
    "media-type": body["media-type"],
    tags: body.tags,
    ip: body.ip
  }
  art = art.concat(piece);

  console.log(art);
  response.json(piece);
});

const PORT = 3001;
app.listen(PORT);
console.log(`server is running on ${PORT}`);


const generateID = () => {
  const maxID = art.length > 0
    ? Math.max(...art.map(n => n.id))
    : 0
  return maxID + 1;
}

const generateDate = () => {
  return new Date();
}
