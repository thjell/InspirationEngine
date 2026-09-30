import libraryModel from "../model/libraryModel.js";
import libraryView from "../view/libraryView.js";
import { createStars } from "../utils/movieUtils.js";
import "../components/modal.js";
import "../components/movieInfoModal.js";

//code by Tonje H

const modal = document.querySelector("app-modal"); 
// Modal component for showing messages and prompts to the user
const movieInfoModal = document.querySelector("movie-info-modal");
// Modal component for showing detailed information about a movie when clicked


const libraryController = {
// Controller object that manages the interactions between the library model 
// and view, and handles user actions such as searching, rating, and saving movies
     init() {
         this.setupSearch();// Set up search functionality
         this.loadInitialMovies();// Load movies and render the initial list
       
    },

    async loadInitialMovies() {
        // fetches movies, user ratings, and login status, then renders the initial list of movies in the library view, 
        // and sets up drag-and-drop functionality for saving movies to "My Movies" list
        const movies = await libraryModel.getMovies();
        const userRatings = await this.getUserRatings(); 
        // fetches all ratings for the logged-in user in one call to avoid multiple calls when rendering each movie card
        const isLoggedIn = libraryModel.checkLoginStatus(); 
        
        await libraryView.renderMovieList(// Render the initial list of movies
            movies,
            userRatings,
            isLoggedIn,
            (rating, movie, element) => this.handleRateAction(rating, movie, element),
            (movie) => movieInfoModal.show(movie)
        );

        this.setupDragAndDrop();// Set up drag-and-drop functionality after rendering the movies
    },

async getUserRatings() { // fetches all ratings for the logged-in user in one call
    return await libraryModel.getAllUserRatings();
},

    setupSearch() {// Set up search functionality
        libraryView.bindSearch(async (term) => {
        const movies = await libraryModel.getMovies();// Fetch the full list of movies to filter on the client side
        const filtered = movies.filter(movie => // Check if the movie has a title and if it includes the search term (case-insensitive)
        movie.title &&
        movie.title.toLowerCase().includes(term)
        );


        const userRatings = await this.getUserRatings();
        const isLoggedIn = libraryModel.checkLoginStatus();

            await libraryView.renderMovieList(// Render the filtered list of movies
                filtered,
                userRatings,
                isLoggedIn,
                (rating, movie, element) => this.handleRateAction(rating, movie, element),
                (movie) => movieInfoModal.show(movie)
            );

            this.setupDragAndDrop();
        });
    },
setupDragAndDrop() {
        libraryView.bindDragAndDrop(async (tmdbId) => {
            if (!tmdbId) return;
// Set up drag-and-drop functionality for saving movies to "My Movies" list, with a callback that handles the drop event and 
// saves the movie using the model, then shows appropriate modals based on the result
    

     const result = await libraryModel.saveMovieToMyList(tmdbId); 
     // Save the movie to "My Movies" list using the model, and get the result to determine which modal to show

    if (result === "not_logged_in") {
      modal.show({
        title: "Access Required",
        message: "🍿⭐ Sorry, you need to be logged in to save movies to your list ⭐🍿",
        confirmText: "Login",
        cancelText: "Cancel",
        onConfirm: () => {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            window.location.href = "login.html";
        }
    });

    return;
}

    if (result === "success") {
  modal.show({
    title: "Saved to My Movies",
    message: "⭐🎬 The movie was \n added to your list 🎬⭐",
    confirmText: "OK",
    cancelText: ""
});
    
    return;
}

modal.show({
    title: "Could not save movie",
    message: "⭐🎬 Something went wrong. Please try again 🎬⭐",
    confirmText: "OK",
    cancelText: ""
        });

             });
    },

   async handleRateAction(rating, movie, element) {
    // Handles the action of rating a movie, saving the rating using the model, 
    // and updating the UI with the new rating, while showing a modal if the user is not logged in
    const success =await libraryModel.saveRating(movie.tmdbId, rating);

                if (!success) {
      modal.show({
        title: "Access Required",
        message: "⭐🎬 Sorry, you need to be logged in \n to rate movies 🎬⭐",
        confirmText: "Login",
        cancelText: "Cancel",
        onConfirm: () => {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            window.location.href = "login.html";
        } 
    });
        return;
    }
        
// Update the UI with the new rating by setting the innerHTML of the rating element to show the new stars
        element.innerHTML = `
            <p class="my-rating-label">My rating</p>
            ${createStars(rating)}
        `;
    }
};
console.log("libraryController:", libraryController);
// Log the libraryController object to the console for debugging purposes 
libraryController.init();

export default libraryController;