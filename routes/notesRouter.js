const router = require('express').Router();
// Function for generating unique Ids
const {nanoid} = require('nanoid');
const {readFile, readAndAdd, readAndDelete} = require('../helpers/fsUtils');

// Router handler for GET '/api/notes' path
router.get('/', (req, res) => {
    readFile('./db/db.json')
    .then(data => res.json(JSON.parse(data)))
    .catch(err => res.status(500).json('Error in reading notes'));
});

// Router handler for POST '/api/notes' path
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

// Router handler for DELETE '/api/notes/:id' path
router.delete('/:id', (req, res) => {
    const reqId = req.params.id;
    readAndDelete('./db/db.json', reqId, res);
});

module.exports = router;