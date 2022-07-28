const notes = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes.`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.error('Error getting notes.');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// POST Route for adding a new note
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.error('Error getting notes.');
            } else {
                const notesDatabase = JSON.parse(data);
                notesDatabase.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(notesDatabase, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        res.error('Error adding note.');
                    } else {
                        res.json(`Note added successfully.`);
                    }
                });
            }
        });
    } else {
        res.error('Error adding note.');
    }
});

// DELETE Route for removing a note
notes.delete('/:ID', (req, res) => {
    console.info(`${req.method} request received to delete a note.`);

    const deletedNoteRequest = req.params.ID;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.error('Error getting notes.');
        } else {
            const existingNotesDatabase = JSON.parse(data);
            const newNotesDatabase = [];
            
            for (let i = 0; i < existingNotesDatabase.length; i++) {
                if (deletedNoteRequest !== existingNotesDatabase[i].note_id) {
                    newNotesDatabase.push(existingNotesDatabase[i]);
                }
            }

            fs.writeFile('./db/db.json', JSON.stringify(newNotesDatabase, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    res.error('Error deleting note.');
                } else {
                    res.json(`Note deleted successfully.`);
                }
            });
        }
    });
})

module.exports = notes;