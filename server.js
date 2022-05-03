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
    fs.readFile(path.join('./db/db.json'), 'utf-8', (error, data) => error ? res.status(500).json('Error in reading Notes') : res.json(JSON.parse(data))));

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.post('/api/notes', (req, res) => {
    const {title, text} = req.body;

    if(title && text) {
        fs.readFile(path.join('./db/db.json'), 'utf8', (error, data) => {
            if(error) {
                res.status(500).json('Error in creating Note');
                return;
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
                    res.status(500).json('Error in creating Note');
                    return;
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

app.delete('/api/notes/:id', (req, res) => {
    const idFromReq = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            res.status(500).json('Error in reading notes');
            return
        }

        let notesList = JSON.parse(data);

        for(var i = 0; i < notesList.length; i++) {
            if(notesList[i].id == idFromReq) {
                notesList.splice(i, 1);
                fs.writeFile('./db/db.json', JSON.stringify(notesList),(error) => err ? res.status(500).json('Error in writing notes') : console.log('Success'));
                res.send('Note Deleted');
                return;
            }
        }
    });
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);