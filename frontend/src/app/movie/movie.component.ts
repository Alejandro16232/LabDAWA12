import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  showDescription = '';
  movies: any[] = [];
  filteredMovies: any[] = [];
  movieForm!: FormGroup;
  editingMovie = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';
  currentEditingMovieId: string | null = null;
  sortField: string = '';
  ascendingOrder: boolean = true;
  constructor(private movieService: MovieService, private formBuilder: FormBuilder) { }
  showForm: boolean = false;
  editingMode = false;

  ngOnInit(): void {
    this.getMovies();
    this.initializeForm();
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
  initializeForm(): void {
    this.movieForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      director: ['', Validators.required],
      releaseYear: ['', [Validators.required, Validators.min(1888), Validators.max(new Date().getFullYear())]],
      genre: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.movieForm.get('imageUrl')!.setValue(file);
    }
  }
  getMovies(): void {
    this.movieService.getMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      this.filteredMovies = movies;
    });
  }

  createMovie(): void {
    this.submitted = true;
    if (this.movieForm.invalid) {
      return;
    }

    this.movieService.createMovie(this.movieForm.value).subscribe(
      () => {
        this.getMovies();
        this.movieForm.reset();
        this.submitted = false;
        this.showForm = false;

        this.successMessage = 'Película creada exitosamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error => {
        this.errorMessage = 'Error al crear la película';
        this.showForm = false;

        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  updateMovie(id: string): void {
    this.submitted = true;
    this.showForm = false;

    if (this.movieForm.invalid) {
      return;
    }

    if (confirm('¿Estás seguro de que deseas guardar los cambios?')) {
      this.movieService.updateMovie(id, this.movieForm.value).subscribe(
        () => {
          this.getMovies();
          this.movieForm.reset();
          this.editingMovie = false;
          this.currentEditingMovieId = null; 
          this.submitted = false;
          this.successMessage = 'Película actualizada exitosamente';
          setTimeout(() => this.successMessage = '', 3000);
        },
        error => {
          this.errorMessage = 'Error al actualizar la película';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      );
    } else {
      this.cancelEdit();
    }
  }

  deleteMovie(id: string): void {
    this.movieService.deleteMovie(id).subscribe(
      () => {
        this.getMovies();
        this.successMessage = 'Película eliminada exitosamente';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error => {
        this.errorMessage = 'Error al eliminar la película';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  confirmDeleteMovie(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta película?')) {
      this.deleteMovie(id);
    }
  }

  editMovie(id: string): void {
    this.movieService.getMovieById(id).subscribe((movie: any) => {
      this.movieForm.patchValue(movie);
      this.editingMovie = true;
      this.editingMode = true; 
      this.showForm = true;
      this.currentEditingMovieId = id; 
    });
  }

  cancelEdit(): void {
    this.editingMovie = false;
    this.editingMode = false;
    this.showForm = false;
    this.currentEditingMovieId = null; 
    this.movieForm.reset();
  }

  onSubmit(): void {
    if (this.editingMovie) {
      if (this.currentEditingMovieId) {
        this.updateMovie(this.currentEditingMovieId); 
      } else {
        this.errorMessage = 'Error: no se encontró la película para actualizar.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    } else {
      this.createMovie();
    }
  }
  
  filterMovies(): void {
    this.filteredMovies = this.movies.filter(movie =>
      movie.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  currentSortField: string | null = null;

  setSortField(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    
    if (this.sortField === value) {
      this.ascendingOrder = !this.ascendingOrder;
    } else {
      this.sortField = value;
      this.ascendingOrder = true;
    }
    
    this.sortMovies();
  }

  toggleOrder(): void {
    this.ascendingOrder = !this.ascendingOrder;
    this.sortMovies();
  }

  sortMovies(): void {
    this.filteredMovies.sort((a, b) => {
      const order = this.ascendingOrder ? 1 : -1;
      
      if (a[this.sortField] < b[this.sortField]) return -1 * order;
      if (a[this.sortField] > b[this.sortField]) return 1 * order;
      return 0;
    });
  }
}
