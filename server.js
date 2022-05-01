const express = require('express');
const path = require('path');
const fs = require('fs');
// const db = require('./db/db.json');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
    fs.readFile('./db/db.json', 'utf-8', (error, data) => 
    error ? res.sendStatus(503) : res.json(data)))

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// app.post('/api/notes', (req, res) => {
//     req.
// });

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);