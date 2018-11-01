const pool = require('../modules/pool');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    console.log('hit get contacts');

    const queryText = 'SELECT * FROM contacts ORDER BY id';
    pool.query(queryText)
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.get('/:id', (req, res) => {
    console.log('hit get contacts');

    const queryText = 'SELECT * FROM contacts WHERE id=$1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('query results:', result);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.delete('/:id', (req, res) => {
    const queryText = 'DELETE FROM contacts WHERE id = $1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });

});

router.put('/update/:id', (req, res) => {
    const queryText = 'UPDATE contacts SET name = $1, company = $2, position = $3, email = $4, phone = $5, date = $6, notes = $7 WHERE id = $8';
    pool.query(queryText, [req.body.name, req.body.company, req.body.position, req.body.email, req.body.phone, req.body.date, req.body.notes, req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
})

router.post('/', (req, res) => {
    const queryText = 'INSERT INTO contacts (name, company, position, email, phone, date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    pool.query(queryText, [req.body.name, req.body.company, req.body.position, req.body.email, req.body.phone, req.body.date, req.body.notes])
        .then((result) => {
            console.log('result:', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});



module.exports = router;