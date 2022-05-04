const fs = require('fs');
const util = require('util');

// Promise version of fs.readFile
const readFile = util.promisify(fs.readFile);

/**
 *  Function to read data from a given a file and add a new note
 *  @param {string} path The path to the file you want to save to
 *  @param {object} newNote The content you want to append to the file. 
 *  @param {object} res The response to be sent to the client
 *  @returns {void} Nothing
 */
const readAndAdd = (path, newNote, res) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if(err) {
            res.status(500).json('Error in reading notes');
            return;
        }
        let noteList = JSON.parse(data);
        noteList.push(newNote)
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


/**
 *  Function to read data from a given a file and delete a note with id
 *  @param {string} path The path to the file you want to save to
 *  @param {string} reqId The id of a note you want to delete from the file. 
 *  @param {object} res The response to be sent to the client
 *  @returns {void} Nothing
 */
const readAndDelete = (path, reqId, res) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if(err) {
            res.status(500).json('Error in reading notes');
            return;
        }
        let noteList = JSON.parse(data);
        // Finding the index of the object matched with reqId and then deleting it
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