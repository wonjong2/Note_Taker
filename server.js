const express = require('express');
const path = require('path');
// const fs = require('fs');
const {nanoid} = require('nanoid');
const {readFile, readAndAdd, readAndDelete} = require('./helpers/fsUtils');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    console.log(`${req.method} received`);
    readFile('./db/db.json')
    .then(data => res.json(JSON.parse(data)))
    .catch(err => res.status(500).json('Error in reading notes'));
});

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;
    if(title && text) {
        const newNote = {
            title,
            text,
            id: nanoid()
        };
        readAndAdd('./db/db.json', newNote, res);
    }
    else {
        res.status(400).json('Invalid data');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const reqId = req.params.id;
    readAndDelete('./db/db.json', reqId, res);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);