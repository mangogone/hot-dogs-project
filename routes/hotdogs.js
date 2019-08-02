var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('hotdogs.sqlite');

/* GET hot-dogs listing in JSON format */
router.get('/', function (req, res) {
  db.all('SELECT rowid as id, * FROM hotdog',
    function (err, rows) {
      res.json(rows);
    });
});

/* Get hot-dog details */
router.get('/:dogId', function (req, res) {
  db.get('SELECT rowid as id, * FROM hotdog WHERE rowid=?',
    req.params.dogId,
    function (err, row) {
      res.json(row);
    });
});

/* POST new hot-dog */
router.post('/', function (req, res) {
  // Create hot dog. The data is in the body of the request.
  db.run('INSERT INTO hotdog(name, description) VALUES (?,?)',
    req.body.name, req.body.description,
    function (err, row) {
      res.json({ op: 'POST' });
    });
});

/* PUT changes to hot-dog */
router.put('/:dogId', function (req, res) {
  // Update requested hot dog. The id is passed in the URL, the data is in the body of the request.
  db.run('UPDATE hotdog SET name=?, description=? WHERE rowid=?',
    req.body.name, req.body.description, req.params.dogId,
    function (err) {
      res.json({ op: 'PUT', id: req.params.dogId });
    });
});

/* DELETE hot-dog */
router.delete('/:dogId', function (req, res) {
  // Delete requested hot dog. The id is passed in the URL.
  db.run('DELETE FROM hotdog WHERE rowid=?', req.params.dogId, function (err) {
    res.json({ op: 'DELETE', id: req.params.dogId });
  });
});

module.exports = router;
