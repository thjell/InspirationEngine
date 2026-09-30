import "../components/modal.js";
import "../components/movieInfoModal.js";
import libraryView from "../view/libraryView.js";
import libraryModel from "../model/libraryModel.js";
import { auth } from "../firebase.js";
import { createStars } from "../utils/movieUtils.js";
import { logOutFunction } from "./userController.js";
import { initSlider, getProfilePictureElements, showProfilePreview, bindSettingsDropdown, bindFavoriteDropzone, renderFavoriteMovie } from "../view/profileView.js";
import { getSavedMovieCurrentUser, deletePosterById, uploadProfilePictureFile, getUserProfile, saveFavoriteMovie, getFavoriteMovie } from "../model/profileModel.js";

// finds the element movie-info-modal in DOM
const movieInfoModal = document.querySelector("movie-info-modal");

// variable for logged in user
let currentUser = null;

/* wait for the app-modal to be ready */
async function whenModalReady() {
  await customElements.whenDefined("app-modal");
}

/* Shows the modal   */
async function showModal(opts) {
  await whenModalReady();
  const modal = document.querySelector("app-modal");
  if (!modal?.show) {
    console.error("showModal: app-modal is missing");
    return;
  }
  modal.show(opts);
}
// Tonje SA
/* shows movie-info in the movie-info-modal */
function showMovieInfo(movie) {
  movieInfoModal?.show?.(movie);
}

// initialize the log out function
logOutFunction.init();

/* Function for starting the slider for the current logged in user (Tonje SA)  */
// refrecing to the current users firebase-id
function startSlider(uid) {
  // if no uid is found, stops
  if (!uid) return;
  
  // loads the saved movies for the current user in the slider
  loadSavedMovieInSlider(uid);
}
// listening for login from authState
document.addEventListener("auth:login", (e) => {
  const user = e?.detail?.user ?? null;
  currentUser = user;
  if (!user) return;
  // starts the slider for the current user based on the uid
  startSlider(user.uid);
});
// listening for logout from authState
document.addEventListener("auth:logout", () => {
  currentUser = null;

    // clears slider on logout 
    window._profileSliderApi?.destroy?.();
    window._profileSliderApi = null;
});

/* Updates rating on poster (Tonje SA) */
function updateRating(ratingSection, rating) {
  if (!ratingSection) return;
  // uses createStars to get current users rating from movieUtil and sets the label "My rating" on the poster
  ratingSection.innerHTML =
    `<p class="my-rating-label">My rating</p>` +
    createStars(Number(rating));
} 

/* Creates a full poster item in the slider (Tonje SA) */
async function createSliderItem(movie, userRatings, isLoggedIn) {
  // gets the postercard from libraryView
  const card = await libraryView.renderMovieCard(
    movie, userRatings, isLoggedIn,
    // runs if the user click on the stars (to update userRatings)
    async (rating, movieObj, ratingSection) => {
      try {
        const tmdbId = String(movieObj.tmdbId);
        // saves the clicked stars in the database
        await libraryModel.saveRating(tmdbId, Number(rating));
        // Updates rating
        userRatings[tmdbId] = Number(rating);
        // updates the stars on the poster
        updateRating(ratingSection, rating);
      } catch {
        // error modal
        await showModal({
          title: "Error",
          message: "Could not save rating. Please try again.",
          confirmText: "OK"
        });
      }
    },
    // opens movieInfo on click on poster
    showMovieInfo
  );
  
  // makes the poster draggable
  card.setAttribute("draggable", "true");
  // when poster is dragged the tmdbId is transferd
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("tmdbId", movie.tmdbId);
  });
  // variabels to set the frame and content of the poster-elements
  const item = document.createElement("div");
  const wrap = document.createElement("div");
  const deleteBtn = document.createElement("button");
  // sets classname for elements for later use 
  item.className = "slider-item";
  wrap.className = "slider-poster";
  // saves tmdbId on wrapper for future deleting
  wrap.dataset.posterId = movie.tmdbId;
  // setts class and text on the delete-poster-button (X)
  deleteBtn.className = "deletePoster";
  deleteBtn.setAttribute("aria-label", "deletePoster");
  deleteBtn.textContent = "X";
  // adds the delete-button on the poster/wrapper
  wrap.append(deleteBtn, card);
  // adds the wrapper in the slider-item
  item.append(wrap);
  // return full poster item 
  return item;
}
/* function for loading the saved movies in the slider (Tonje SA) */
async function loadSavedMovieInSlider(uid) {
    const slider = document.querySelector(".movie-slider");
    // the variable movies gets the saved movies for the current user
    const movies = await getSavedMovieCurrentUser(uid);
   // if the user have not saved any movies, the text "You have not saved any movies yet" is displayed in the slider
    if (!movies?.length) {
      slider.innerHTML =
        `<h3 class="slider-text">You have not saved any movies yet</h3>`;
      return;
    }
    // gets all the ratings for the current user
    const userRatings = Object.fromEntries(
      Object.entries(await libraryModel.getAllUserRatings() || {}).map(
        ([key, value]) => [String(key), Number(value)]
      )
    );
    // checks if the user is logged in
    const isLoggedIn = Boolean(
      libraryModel.checkLoginStatus?.() || auth.currentUser
    );
    // stores all of the saved movies on the current user in the variable items
    const items = await Promise.all(
      movies.map((movie) =>
        createSliderItem(movie, userRatings, isLoggedIn)
      )
    );

    // sets the slider empty before append all items (posters) into the slider
    slider.innerHTML = "";
    slider.append(...items);
    // clears slider before rebuilding it
    window._profileSliderApi?.destroy?.();
    // initiate slider
    window._profileSliderApi = initSlider(
      document.querySelector(".movie-slider-wrapper")
    );
}
// listening for clicks on delete button
document.addEventListener("click", async (e) => {
  // delete button on the current poster
  const deleteButton = e.target.closest(".deletePoster");
  if (!deleteButton) return;
  // the current poster that was clicked on
  const poster = deleteButton.closest(".slider-poster");
  // Full slider element for the poster in the slider
  const item = deleteButton.closest(".slider-item");
  // the current tmdbId of the poster that was clicked on
  const posterId = poster?.dataset?.posterId;
  // uid gets the value of the current logged in user
  const uid = auth.currentUser?.uid;


  if (!uid) return;
  // modal for delete movie
  await showModal({
    title: "Delete movie",
    message: "Are you sure you want to delete this movie from your list?",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: async () => {
      deleteButton.disabled = true;

      try {
        // deletes the movie 
        await deletePosterById(uid, posterId);
        // removes the poster
        item?.remove();
        // updates the slider after deletion
        window._profileSliderApi?.update?.();
      } catch {
        deleteButton.disabled = false;
        // error modal if the deletion failed
        await showModal({
          title: "Error",
          message: "Could not delete the movie. Please try again.",
          confirmText: "OK"
        });
      }
    }
  });
});

/* PROFILE PICTURE (Benjamin and Tonje SA) */
// Function for uploading profile picture
function initProfilePicture(root = document) {
  
  // get input and preview from view
  const { input, preview } = getProfilePictureElements(root);
  // If no input, stops
  if (!input) return () => {};
  
  // variable to mark the upload state
  const setUploadingState = (isUploading) => {
    if (!preview) return;
    preview.dataset.uploading = isUploading ? '1' : '0';
  };
  // acts on chosen profile picture
  const onInputChange = async () => {
    // selected image file
    const file = input.files?.[0];
    if (!file) {
      // no prewview
      showProfilePreview(preview, '');
      return;
    }
    // stops if the file is not a img file 
    if (!file.type.startsWith('image/')) {
      input.value = '';
      showProfilePreview(preview, '');
      showModal({
        title: 'Invalid file',
        message: 'Select an image (image files only).',
        confirmText: 'OK'
      });
      return;
    }
  // stops if the img is to large
    if (file.size > 2 * 1024 * 1024) {
      input.value = '';
      showProfilePreview(preview, '');
      showModal({
        title: 'File too large',
        message: 'Image must be under 2 MB.',
        confirmText: 'OK'
      });
      return;
    }
    // check if the current user is logged in
    const user = auth.currentUser;
    // stops if the user isen`t logged in
    if (!user) {
      showModal({
        title: 'Login required',
        message: 'You must be logged in to upload a profile picture.',
        confirmText: 'Log in',
        cancelText: '',
        onConfirm: () => { window.location.href = 'login.html'; }
      });
      return;
    }
  // local URL
    const objectUrl = URL.createObjectURL(file);
    showProfilePreview(preview, objectUrl);

    try {
      // deactivates input while uploading picture
      input.disabled = true;
      // uploadning
      setUploadingState(true);
      const url = await uploadProfilePictureFile(user.uid, file);
      // preview url
      showProfilePreview(preview, url);
      
    } catch {
      showModal({
        title: 'Upload failed',
        message: 'Something went wrong during the upload. Please try again later.',
        confirmText: 'OK'
      });

      showProfilePreview(preview, '');
      input.value = '';
    } finally {
      input.disabled = false;
      setUploadingState(false);
      try { URL.revokeObjectURL(objectUrl); } catch (e) { }
    }
  };
  // listens to change i input
  input.addEventListener('change', onInputChange);
  // Returns destroy and removes eventlistner
  return function destroy() {
    try { input.removeEventListener('change', onInputChange); } catch (e) { }
  };
}

/* initializing the profile page (Tonje SA) */
function initProfilePage(root = document) {
  // starting the profile picture logic and settings dropdown
  const destroyProfilePicture = initProfilePicture(root);
  const destroySettingsDropdown = bindSettingsDropdown(root);

  // loads the profile picture for the user
  const loadPreviewForUser = async (user) => {
    const { preview } = getProfilePictureElements(root);
    // stops if no user is logged in
    if (!user) return; 
      // gets the uid for the current user 
      const profile = await getUserProfile(user.uid);
      // shows the profilepicture if it exists
      if (profile?.profilePicture) {
        showProfilePreview(preview, profile.profilePicture);
      }
  };
  // starts loadPreviewForUser if current user exists
  loadPreviewForUser(typeof currentUser !== 'undefined' ? currentUser : null);

/* benjamin */
async function renderFavoriteWithHandlers(movie, uid) {
  renderFavoriteMovie(

    movie,

    // Open movie modal
    (selectedMovie) => {
      const modal =
        document.querySelector("movie-info-modal");

      modal?.show?.(selectedMovie);
    },

    // Delete favorite movie
    async () => {
      await saveFavoriteMovie(uid, null);

      renderFavoriteMovie(null);
    },

    // Update rating
    async (selectedMovie, rating) => {
      try {
        await libraryModel.saveRating(
          String(selectedMovie.tmdbId),
          Number(rating)
        );

        selectedMovie.myRating = Number(rating);

        await renderFavoriteWithHandlers(
          selectedMovie,
          uid
        );

      } catch (err) {
        console.error(
          "Could not update favorite rating",
          err
        );
      }
    }
  );
}
/* Handles loading of user-specific profile data after login */
  const __authLoginHandler = async (e) => {
    const user = e?.detail?.user ?? null;
  
    await loadPreviewForUser(user);
  
    if (!user) return;
  
    const favoriteMovie =
      await getFavoriteMovie(user.uid);
      if (favoriteMovie) {
        const userRatings =
          await libraryModel.getAllUserRatings();
      
        favoriteMovie.myRating =
          userRatings?.[favoriteMovie.tmdbId] ?? 0;
      }
  
      await renderFavoriteWithHandlers(
        favoriteMovie,
        user.uid
      );
  };

  const __authLogoutHandler = () => {
    const { preview } = getProfilePictureElements(root);
    showProfilePreview(preview, '');
  };

  document.addEventListener('auth:login', __authLoginHandler);
  document.addEventListener('auth:logout', __authLogoutHandler);

/* benjamin */
// Enables drag and drop for favorite movie
  bindFavoriteDropzone(async (tmdbId) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
  
    const movies = await getSavedMovieCurrentUser(uid);
  
    const movie = movies.find(
      (m) => String(m.tmdbId) === String(tmdbId)
    );
  
    if (!movie) return;

    // Adds existing rating from user to favorite movie
    const userRatings =
   await libraryModel.getAllUserRatings();

    movie.myRating =
    userRatings?.[String(movie.tmdbId)] ?? 0;
  
    await saveFavoriteMovie(uid, movie);
  
    await renderFavoriteWithHandlers(
      movie,
      uid
    );
  });

  return function destroy() {
    if (typeof destroyProfilePicture === 'function') {
      try { destroyProfilePicture(); } catch (e) { }
    }
    document.removeEventListener('auth:login', __authLoginHandler);
    document.removeEventListener('auth:logout', __authLogoutHandler);
    try {
      destroySettingsDropdown?.();
    } catch (e) {}
    try {
      if (window._profileSliderApi?.destroy) 
      // cleans up slider when user logges out
      window._profileSliderApi.destroy();
      window._profileSliderApi = null;
    } catch (err) {
      console.error('Error cleaning up slider API', err);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const root =
    document.querySelector(".profile-root") ||
    document.getElementById("profile-root");

  if (!root) return;

  initProfilePage(root);
});
