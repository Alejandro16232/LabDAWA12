const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const itemController = require('./controllers/itemController');
const peliculaController = require('./controllers/peliculaController');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
    })
    .catch((error) => {
        console.log('Error al conectar a MongoDB:', error);
    });

    
app.get('/api/items', itemController.getItems);
app.get('/api/items/:id', itemController.getItemById);
app.post('/api/items', itemController.createItem);
app.put('/api/items/:id', itemController.updateItem);
app.delete('/api/items/:id', itemController.deleteItem);

app.get('/api/peliculas', peliculaController.getPeliculas);
app.get('/api/peliculas/:id', peliculaController.getPeliculaById);
app.post('/api/peliculas', peliculaController.createPelicula);
app.put('/api/peliculas/:id', peliculaController.updatePelicula);
app.delete('/api/peliculas/:id', peliculaController.deletePelicula);

app.listen(port, () => {
    console.log('Servidor backend en funcionamiento en el puerto', port);
});
