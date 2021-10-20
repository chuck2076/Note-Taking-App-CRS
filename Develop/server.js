const express = require('express');
const db = require('./db/db.json');
const morgan = require('morgan');


const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/db.json', (req, res) => {
    console.info(`GET /api/db.json`);
    res.status(200).json(getNotes);
  });


// GET a single note
app.get('/api/db.json/:takeNotes_id', (req, res) => {
    if (req.params.getNotes_id) {
      console.info(`${req.method} request received to get a single a note`);
      const notesId = req.params.getNotes_id;
      for (let i = 0; i < getNotes.length; i++) {
        const currentNote = getNotes[i];
        if (currentNote.getNotes_id === getNotesId) {
          res.json(currentNote);
          return;
        }
      }
      res.status(404).send('Note not found');
    } else {
      res.status(400).send('Note ID not provided');
    }
  });

// POST request to add a note
app.post('/api/db.json', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if ( title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
    };

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting Note');
  }
});

//Need a listener