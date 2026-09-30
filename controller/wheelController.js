// This file contains the main controller logic for the movie wheel application,
// connecting the model and view layers and handling user interactions.
// Written by Sander Rønning, with invite functionality added by Benjamin.

import { getFilteredMovies } from "../model/wheelModel.js";
import { renderWheel, showResult, spinWheelAnimation, toggleCurtains, triggerPopcornRain } from "../view/wheelView.js";
import { auth } from "../firebase.js";

// DOM Elements
const genreSelect = document.getElementById("genreSelect");
const companySelect = document.getElementById("companySelect");
const ageSelect = document.getElementById("ageSelect");
const spinButton = document.getElementById("spinButton");
const movieModal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const xModalBtn = document.querySelector("#movieModal .close-modal");
const modal = document.querySelector("app-modal");
const movieInfoModal = document.querySelector("movie-info-modal");
const modalPoster = document.getElementById("modalPoster");
const modalResult = document.getElementById("modalResult");

// Invite funksjoner (Benjamin)
const inviteFriendBtn = document.getElementById("inviteFriendBtn");
const inviteForm = document.getElementById("inviteForm");
const friendEmailInput = document.getElementById("friendEmail");
const sendInviteBtn = document.getElementById("sendInviteBtn");
const inviteStatus = document.getElementById("inviteStatus");

// State
let selectedMovie = null;
let selectedGenre = genreSelect.value;
let selectedCategory = companySelect.value;
let selectedAge = ageSelect.value;

// MAIN LOGIC (Sander Rønning)
async function updateApp() {
    const wheel = document.getElementById("wheel");

    const filteredMovies = await getFilteredMovies(selectedGenre, selectedCategory, selectedAge);

    if (!filteredMovies || filteredMovies.length === 0) {
        // Show modal with error message
        modal.show({
        title: "Error! No movies match your criteria.",
        message: "Please try again with different criteria.",
        confirmText: "Try Again",
        cancelText: "",
    });
        // Deactivate wheel visually if no movies match criteria
        if (wheel) {
            wheel.style.opacity = "0.3";
            wheel.style.filter = "grayscale(100%)";
        }
        // Disable spin button if no movies match criteria
        if (spinButton) {
            spinButton.disabled = true;
            spinButton.style.opacity = "0.5";
        }
        // Clear the wheel segments
  renderWheel([]); 
  return [];
    } else {
        // Activate wheel visually if movies match criteria
        if (wheel) {
            wheel.style.opacity = "1";
            wheel.style.filter = "none";
        }
        // Enable spin button if movies match criteria
        if (spinButton) {
            spinButton.disabled = false;
            spinButton.style.opacity = "1";
        }
        //Show movies on wheel
        renderWheel(filteredMovies.map(m => m.title));
        return filteredMovies;
    }
}

// Event Listeners for dropdowns (Sander Rønning)
genreSelect.addEventListener("change", async () => {
    selectedGenre = genreSelect.value;
    await updateApp();
});

companySelect.addEventListener("change", async () => {
    selectedCategory = companySelect.value;
    await updateApp();
});

ageSelect.addEventListener("change", async () => {
    selectedAge = ageSelect.value;
    await updateApp();
});

// Spin logic (Sander Rønning)
spinButton.addEventListener("click", async () => {
    const currentMovies = await updateApp();
    if (currentMovies.length === 0) return;

    spinButton.disabled = true;
    toggleCurtains(false);

    await new Promise(resolve => setTimeout(resolve, 1200)); // Wait for curtains to close before spinning

    // Randomly select a movie from the filtered list
    const selectedIndex = Math.floor(Math.random() * currentMovies.length);
    const movieObject = currentMovies[selectedIndex];

    selectedMovie = movieObject;
    inviteForm.style.display = "none";
    
    // Animate curtains opening and wheel spinning
    toggleCurtains(true);
    await spinWheelAnimation(selectedIndex, currentMovies.length);

    triggerPopcornRain();

    let fullPosterUrl = null;
    if (movieObject.posterPath) {
        fullPosterUrl = `https://image.tmdb.org/t/p/w500${movieObject.posterPath}`; // Construct full poster URL if posterPath exists
    }

    showResult(movieObject.title, fullPosterUrl);
    spinButton.disabled = false;
});

// MODAL CLOSE LOGIC
const closeMovieModal = () => {
    movieModal.style.display = "none";
};

closeModalBtn.addEventListener("click", closeMovieModal);
xModalBtn.addEventListener("click", closeMovieModal);

movieModal.addEventListener("click", (e) => {
    if (e.target === movieModal) {
        closeMovieModal();
    }
});

function openSelectedMovieInfo() {
    if (!selectedMovie || !movieInfoModal) return;

    movieInfoModal.show(selectedMovie);
}

modalPoster.addEventListener("click", openSelectedMovieInfo); // Open movie info modal when poster in result modal is clicked
modalResult.addEventListener("click", openSelectedMovieInfo); 

// Invite friends logic (Benjamin)
inviteFriendBtn.addEventListener("click", () => {
    if (!selectedMovie) {
        inviteStatus.textContent = "Spin first to select a movie.";
        return;
    }

    inviteForm.style.display =
        inviteForm.style.display === "none" ? "block" : "none";
});

sendInviteBtn.addEventListener("click", async () => {
    const user = auth.currentUser;

    if (!user) {
        inviteStatus.textContent = "You must be logged in to send an invite.";
        return;
    }

    if (!selectedMovie) {
        inviteStatus.textContent = "No movie selected.";
        return;
    }

    const email = friendEmailInput.value.trim();

    if (!email) {
        inviteStatus.textContent = "Please enter an email address.";
        return;
    }

    try {
        inviteStatus.textContent = "Sending...";

        const token = await user.getIdToken();

        const response = await fetch(
            "https://us-central1-app200v-44990.cloudfunctions.net/sendInviteEmail",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    to: email,
                    movieTitle: selectedMovie.title,
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        inviteStatus.textContent = "Invitation sent!";
        friendEmailInput.value = "";
    } catch (error) {
        console.error(error);
        inviteStatus.textContent =
            error.message || "Something went wrong.";
    }
});

updateApp();
