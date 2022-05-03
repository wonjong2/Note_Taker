const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFile = util.promisify(fs.readFile);

const readAndAdd = (path, newNote, res) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if(err) {
            res.status(500).json('Error in reading notes');
            return;
        }
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
};

const readAndDelete = (path, reqId, res) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if(err) {
            res.status(500).json('Error in reading notes');
            return;
        }
        let noteList = JSON.parse(data);
        for(var i = 0; i < data.length; i++) {
            if(noteList[i].id == reqId) {
                noteList.splice(i, 1);
                fs.writeFile(path, JSON.stringify(noteList),(err) => 
                err ? 
                res.status(500).json('Error in writing notes')
                : console.log('Success'));
                res.send('Note Deleted');
                return;
            }
        }
    });
};

module.exports = {
    readFile,
    readAndAdd,
    readAndDelete
};