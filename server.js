const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['https://wonderful-bush-012646010.5.azurestaticapps.net']; // Reemplaza con la URL de tu frontend

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost', // Reemplaza con tu configuración de host si es necesario
  user: 'root', 
  password: 'Sofilau01@', 
  database: 'mydatabase' 
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// Define routes
app.get('/api/almacenes', (req, res) => {
  db.query('SELECT * FROM almacenes', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/api/almacenes/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM almacenes WHERE IdAlmacen = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results[0]);
  });
});

app.post('/api/almacenes', (req, res) => {
  const newAlmacen = req.body;
  db.query('INSERT INTO almacenes SET ?', newAlmacen, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: results.insertId, ...newAlmacen });
  });
});

app.put('/api/almacenes/:id', (req, res) => {
  const id = req.params.id;
  const updatedAlmacen = req.body;
  db.query('UPDATE almacenes SET ? WHERE IdAlmacen = ?', [updatedAlmacen, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id, ...updatedAlmacen });
  });
});

app.delete('/api/almacenes/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM almacenes WHERE IdAlmacen = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Almacen deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
