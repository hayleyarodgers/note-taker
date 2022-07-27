const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes.`);

    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)));
});

// POST Route for adding a new note
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully.`);
    } else {
        res.error('Error adding note.');
    }
});

// DELETE Route for removing a note
notes.delete('/:ID', (req, res) => {
    console.info(`${req.method} request received to delete a note.`);

    const deletedNoteRequest = req.params.ID;

    readFromFile('./db/db.json')
    .then((data) => {
        const parsedData = JSON.parse(data);
        const newDatabase = [];
        
        for (let i = 0; i < parsedData.length; i++) {
            if (deletedNoteRequest !== parsedData[i].note_id) {
                newDatabase.push(parsedData[i]);
            }
        }

        writeToFile('./db/db.json', newDatabase);
        res.json(`Note deleted successfully.`);
    });
})

module.exports = notes;