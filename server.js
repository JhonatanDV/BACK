const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // Usamos Pool de pg

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['https://wonderful-bush-012646010.5.azurestaticapps.net'];

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

// Configuración de la conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Utiliza una variable de entorno para la URL de conexión
  ssl: {
    rejectUnauthorized: false
  }
});

// Rutas para manipular productos
app.get('/api/productos', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM productos');
    res.json(results.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, precio, categoria } = req.body;
    const query = 'INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, precio, categoria];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
