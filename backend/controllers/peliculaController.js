const Pelicula = require('../models/pelicula');

exports.getPeliculas = (req, res) => {
    Pelicula.find()
        .then((peliculas) => {
            res.json(peliculas);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

exports.getPeliculaById = (req, res) => {
    Pelicula.findById(req.params.id)
        .then((pelicula) => {
            if (!pelicula) {
                return res.status(404).json({ message: 'Pelicula no encontrada' });
            }
            res.json(pelicula);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

exports.createPelicula = (req, res) => {
    const nuevaPelicula = new Pelicula({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        duration: req.body.duration,
        rating: req.body.rating
    });

    nuevaPelicula.save()
        .then((pelicula) => {
            res.status(201).json(pelicula);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

exports.updatePelicula = (req, res) => {
    Pelicula.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((pelicula) => {
            if (!pelicula) {
                return res.status(404).json({ message: 'Pelicula no encontrada' });
            }
            res.json(pelicula);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

exports.deletePelicula = (req, res) => {
    Pelicula.findByIdAndDelete(req.params.id)
        .then((pelicula) => {
            if (!pelicula) {
                return res.status(404).json({ message: 'Pelicula no encontrada' });
            }
            res.json({ message: 'Pelicula eliminada correctamente' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};
