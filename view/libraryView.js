import { buildPosterUrl, formatTmdbRating, createStars, hasPoster } from "../utils/movieUtils.js";
import { triggerPopcornRain } from "./wheelView.js";

//Code by Tonje H

const libraryView = {// View for rendering the movie library, handling user interactions such as searching, rating, and drag-and-drop, and showing modals for login and status messages
    get container() {
        return document.querySelector(".movie-list");
    },

    async renderMovieList(movies, userRatings, isLoggedIn, onRateClick, onMovieClick) {
    const container = this.container;
    if (!container) return;

    container.innerHTML = ""; // Clears the container before rendering the new list of movies

    const movieCards = await Promise.all( //saves all the moviecards at the same time and waits till they are all created before appending them to the container, which can improve performance when rendering a large number of movies
        movies
            .filter(movie => hasPoster(movie))

                .map(movie =>
    this.renderMovieCard(movie, userRatings, isLoggedIn, onRateClick, onMovieClick)
)
    );
// Adds all movie cards to the container after they have been created
    movieCards.forEach(card => {
        container.appendChild(card);
    });
},
// Creates a DOM element for a movie card based on the movie object,
// uses helper functions to format the rating and build the poster URL,
// and adds event listeners for clicks and movie ratings.på movie-objektet
        renderMovieCard(movie, userRatings, isLoggedIn, onRateClick, onMovieClick) {
        const myRating = userRatings[movie.tmdbId] || 0;
        const voteAverage = formatTmdbRating(movie);// Uses the helpfunction to format the TMDB rating for display
        const posterUrl = buildPosterUrl(movie); //Uses the helpfunction to build the poster URL based on the movie object

        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.dataset.id = movie.tmdbId;
        card.setAttribute("draggable", "true");

        card.innerHTML = `
            <p class="tmdb-rating-overlay">TMDB ${voteAverage}/10</p>

            <img src="${posterUrl}" 
                 alt="${movie.title}" 
                 draggable="false"> 

           ${ isLoggedIn // Hides the rating section if the user is not logged in
                    ? `
                    <div class="movie-rating" data-id="${movie.tmdbId}">
                        <p class="my-rating-label">My rating</p>
                        ${createStars(myRating)}
                    </div>
                    `
                    : ""
            } 
        `;

        card.addEventListener("click", () => {// Adds click event to show movie info in modal
            if (onMovieClick) {
                onMovieClick(movie);
            }
        });

        const ratingSection = card.querySelector(".movie-rating");// Adds click event for rating stars

        if (ratingSection) { // Checks if the rating section exists before adding the event listener, which prevents errors for non-logged-in users who don't have a rating section
            ratingSection.addEventListener("click", (e) => { // Adds click event for rating stars
                e.stopPropagation(); // Prevents the click from bubbling up to the card click event, so that clicking on the stars doesn't trigger the movie info modal

                const clickedStar = e.target.closest(".star");
                if (!clickedStar) return;// Checks if a star was clicked, and if not, exits the function to prevent errors when clicking on other parts of the rating section

                const selectedRating = Number(clickedStar.dataset.value); // Gets the selected rating value from the clicked star's data attribute
                onRateClick(selectedRating, movie, ratingSection); // sends rating to controller and updates the UI based on the response from the controller, which allows the user to see their rating reflected immediately on the UI after clicking a star
            });
        }
            return card; // Returns the created movie card element to be appended to the container in the renderMovieList function
    },

    bindSearch(onSearch) {// Adds search functionality by listening to input events on the search field 
        const searchInput = document.querySelector("#movie-search");

        if (searchInput) {// Checks if the search input exists before adding the event listener
            searchInput.addEventListener("input", async (e) => { // Adds input event listener to the search input, which triggers every time the user types something
                const term = e.target.value.toLowerCase();
                await onSearch(term);
            });
        }
    },

    bindDragAndDrop(onDropMovie) {// Adds drag-and-drop functionality for the movie cards and drop zone
        const dropzone = document.querySelector("#popcorn-dropzone");//
        const cards = document.querySelectorAll(".movie-card");

        if (!dropzone || cards.length === 0) return;// Checks if the dropzone and movie cards exist before setting up drag-and-drop event listeners

        cards.forEach(card => {
            // Makes each movie card draggable and sets up the dragstart event to store the tmdbId in the dataTransfer object
            card.setAttribute("draggable", "true");

            card.ondragstart = (e) => { //arrow function to handle the dragstart event, which is triggered when the user starts dragging a movie card
                // When dragging starts, store the tmdbId of the movie in the dataTransfer object to be accessed on drop
                console.log("Dragging:", card.dataset.id); // Logs the tmdbId of the dragged movie for debugging purposes
                e.dataTransfer.setData("tmdbId", card.dataset.id);
            };
        });

        dropzone.ondragover = (e) => { 
            // Allows the drop by preventing the default behavior and adds a visual indication that the dropzone is active
            e.preventDefault();
            dropzone.classList.add("drag-over");
        };

        dropzone.ondragleave = () => {
            // Removes the visual indication when the dragged item leaves the dropzone
            dropzone.classList.remove("drag-over");
        };

        dropzone.ondrop = async (e) => {
        // Handles the drop event, retrieves the tmdbId from the dataTransfer object, 
        // and calls the onDropMovie callback with the tmdbId
            e.preventDefault();
            dropzone.classList.remove("drag-over");

            const tmdbId = e.dataTransfer.getData("tmdbId"); // Retrieves the tmdbId of the dropped movie from the dataTransfer object
            console.log("Dropped:", tmdbId);// Logs the tmdbId of the dropped movie for debugging purposes

           const success = await onDropMovie(tmdbId);
           // Calls the onDropMovie callback with the tmdbId to handle adding the movie to the watchlist, and waits for the result

        if (success !== false) {
        triggerPopcornRain(); //Triggers the popcorn rain animation if the movie was successfully added to the watchlist
}

        };
    },

    showLoginModal(title, message) {
        // shows a modal prompting the user to log in, with a message and a button that redirects to the login page
        const modal = document.getElementById("login-modal");
        const titleEl = modal.querySelector(".modal-title");
        const messageEl = modal.querySelector(".modal-message");
        const goLoginBtn = document.getElementById("go-login");
        const cancelBtn = document.getElementById("cancel-login");
        const loginUrl = "login.html?redirect=library.html";

        titleEl.textContent = title;
        messageEl.innerHTML = message;
        goLoginBtn.textContent = "Logg inn";

        goLoginBtn.onclick = () => {
            localStorage.setItem("redirectAfterLogin", window.location.href);
            window.location.href = loginUrl;
        };

        cancelBtn.onclick = () => {
            modal.classList.remove("show");
        };

        modal.classList.add("show");
    },

    showStatusModal(title, message, buttonText = "OK") {///shows a modal with a status message and a button to close the modal
        const modal = document.getElementById("login-modal");
        const titleEl = modal.querySelector(".modal-title");
        const messageEl = modal.querySelector(".modal-message");
        const goLoginBtn = document.getElementById("go-login");
        const cancelBtn = document.getElementById("cancel-login");

        titleEl.textContent = title;
        messageEl.innerHTML = `${message}<br><br>⭐🎬⭐`;
        goLoginBtn.textContent = buttonText;

        goLoginBtn.onclick = () => {
            modal.classList.remove("show");
            
        };

        cancelBtn.onclick = () => {// Closes the modal when the cancel button is clicked
            modal.classList.remove("show");
        };

        modal.classList.add("show");

         
    }
};

export default libraryView;