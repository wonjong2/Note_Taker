const router = require('express').Router();
// Function for generating unique Ids
const {nanoid} = require('nanoid');
const {readFile, readAndAdd, readAndDelete} = require('../helpers/fsUtils');

router.get('/', (req, res) => {
    console.log(`${req.method} received`);
    readFile('./db/db.json')
    .then(data => res.json(JSON.parse(data)))
    .catch(err => res.status(500).json('Error in reading notes'));
});

router.post('/', (req, res) => {
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

router.delete('/:id', (req, res) => {
    const reqId = req.params.id;
    readAndDelete('./db/db.json', reqId, res);
});

module.exports = router;