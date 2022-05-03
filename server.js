const express = require('express');
const path = require('path');
const {readFile, readAndAdd, readAndDelete} = require('./helpers/fsUtils');
// Loading the router module to handle 'api/notes' routes
const notesRouter = require('./routes/notesRouter');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.use('/api/notes', notesRouter);

// GET Route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for homepage
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);