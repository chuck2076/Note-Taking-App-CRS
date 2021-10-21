//Requiring files to be used
const express = require('express');
const db = require('./db/db.json');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET request for ALL Notes
app.get('/api/notes', (req, res) => {
    //console.info(`GET /api/db.json`);
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
    )
  });
    

//GET a single note to delete
app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
      console.info(`${req.method} request received to get a single a note`);
      const notesId = req.params.id;
      for (let i = 0; i < db.length; i++) {
        const currentNote = db[i];
        if (currentNote.id === notesId) {
          db.splice(i, 1);
          res.json(db);
          return;
        }
      }
      res.status(404).send('Note not found');
    } else {
      res.status(400).send('Note ID not provided');
    }
  });
 
// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);
   // Prepare a response object to send back to the client
   let response;
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if ( title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    response = {
      status: 'success',
      body: newNote,
    };

    readAndAppend(newNote, './db/db.json');

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting Note');
  }
});

//Need a listener
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
