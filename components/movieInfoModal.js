import { buildPosterUrl, formatTmdbRating, } from "../utils/movieUtils.js";

// Create custom HTML element: <movie-info-modal>(Benjamin)
class MovieInfoModal extends HTMLElement {

  constructor() {
      super();

      // Insert modal HTML into component
      this.innerHTML = `
          <div class="modal movie-info-modal">
              <div class="modal-content movie-info-content">

                  <!-- Close button -->
                  <button class="close-movie-modal">X</button>

                  <!-- Dynamic movie content will be inserted here -->
                  <div class="movie-info-body"></div>

              </div>
          </div>
      `;

      // Get modal elements
      this.modal =
          this.querySelector(".modal");

      this.body =
          this.querySelector(".movie-info-body");

      this.closeBtn =
          this.querySelector(".close-movie-modal");

      // Close modal when clicking X-button
      this.closeBtn.addEventListener("click", () => {
          this.close();
      });

      // Close modal when clicking outside modal-content
      this.modal.addEventListener("click", (e) => {

          // Only close if clicking backdrop
          if (e.target === this.modal) {
              this.close();
          }
      });
  }

  // Show modal with movie data
  show(movie) {

      // Stop if movie object does not exist
      if (!movie || !this.modal || !this.body) {
          return;
      }

      // Build poster URL from helper function
      const posterUrl =
          buildPosterUrl(movie);

      // Format TMDB rating from helper function
      const voteAverage =
          formatTmdbRating(movie);

      // Convert genres object into comma separated text
      const genres = movie.genres
          ? Object.keys(movie.genres).join(", ")
          : "Unknown";

      // Insert dynamic movie content into modal body
      this.body.innerHTML = `
          <div class="movie-info-layout">

              <img 
                  src="${posterUrl}" 
                  alt="${movie.title}"
              >

              <div class="movie-info-text">

                  <h2>${movie.title}</h2>

                  <p>
                      <strong>TMDB:</strong>
                      ${voteAverage}/10
                  </p>

                  <p>
                      <strong>Release:</strong>
                      ${movie.releaseDate || "Unknown"}
                  </p>

                  <p>
                      <strong>Age limit:</strong>
                      ${movie.ageLimit || "Unknown"}
                  </p>

                  <p>
                      <strong>Genres:</strong>
                      ${genres}
                  </p>

                  <p>
                      <strong>Overview:</strong>
                  </p>

                  <p>
                      ${movie.overview || "No overview available."}
                  </p>

              </div>
          </div>
      `;

      // Show modal
      this.modal.classList.add("show");
  }

  // Close modal
  close() {

      if (!this.modal) return;

      this.modal.classList.remove("show");
  }
}

// Connect class to custom HTML tag
customElements.define(
  "movie-info-modal",
  MovieInfoModal
);
