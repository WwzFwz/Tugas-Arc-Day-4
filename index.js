const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Load data awal dari file JSON
let movies = JSON.parse(fs.readFileSync('movies.json'));

// Menampilkan semua film
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Menampilkan film berdasarkan ID
app.get('/movies/:id', (req, res) => {
  const id = req.params.id;
  const movie = movies.find(movie => movie.imdbID === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

// Menambahkan film baru
app.post('/movies', (req, res) => {
  const newMovie = req.body;
  movies.push(newMovie);
  saveDataToFile();
  res.status(201).json(newMovie);
});

// Menghapus film berdasarkan ID
app.delete('/movies/:id', (req, res) => {
  const id = req.params.id;
  movies = movies.filter(movie => movie.imdbID !== id);
  saveDataToFile();
  res.json({ message: 'Movie deleted successfully' });
});

// Update film berdasarkan ID
app.put('/movies/:id', (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;
  movies = movies.map(movie => (movie.imdbID === id ? updatedMovie : movie));
  saveDataToFile();
  res.json(updatedMovie);
});

// Pencarian film berdasarkan nama
app.get('/search', (req, res) => {
  const query = req.query.name.toLowerCase();
  const result = movies.filter(movie =>
    movie.Title.toLowerCase().includes(query)
  );
  res.json(result);
});

// Simpan perubahan ke dalam file JSON
function saveDataToFile() {
  fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2));
}

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
