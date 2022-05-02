const express = require('express');
const path = require('path');
const fs = require('fs');
const {nanoid} = require('nanoid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => 
    fs.readFile(path.join('./db/db.json'), 'utf-8', (error, data) => error ? next(error) : res.json(JSON.parse(data))));

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if(title && text) {
        fs.readFile(path.join('./db/db.json'), 'utf-8', (error, data) => {
            if(error) {
                next(error);
            }
            
            const newNote = {
                title,
                text,
                id: nanoid()
            };

            let noteList = JSON.parse(data);
            noteList.push(newNote)
            console.log(typeof noteList, noteList);
            const noteListString = JSON.stringify(noteList);

            fs.writeFile('./db/db.json', noteListString, (err) => {
                if(err) {
                    next(err);
                }
                const response = {
                    status: 'success',
                    body: newNote,
                };

                res.status(201).json(response);
            });
        });
    }
    else {
        res.status(500).json('Error in creating a note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);