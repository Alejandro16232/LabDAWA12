const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
  name: { type: String, required: true },          
  description: { type: String, required: true },   
  imageUrl: { type: String, required: false },     
  director: { type: String, required: true },      
  releaseYear: { type: Number, required: true },   
  genre: { type: String, required: true },         
  duration: { type: Number, required: true },     
  rating: { type: Number, required: false }        
});

module.exports = mongoose.model('Pelicula', peliculaSchema);
