/* DOM logic for settingsbutton (Tonje SA) */ 
export function bindSettingsDropdown (root = document) {
  const dropdown = root.querySelector(".settings-dropdown");
  if (!dropdown) return () => {};

    // settings-button 
    const btn = dropdown.querySelector(".settings-btn");
  
    // All menu items
  const menuItems = dropdown.querySelectorAll(".settings-item");

    // opens or closes the settings-menu
    const onBtnClick = () => dropdown.classList.toggle('open');
  
    // closes the menu if you click outside the menu
    const onDocClick = (e) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    };

  // Closes menu after clicking a menu item
  const onMenuItemClick = () => {
    dropdown.classList.remove("open");
  };

    btn?.addEventListener('click', onBtnClick);
    document.addEventListener('click', onDocClick);

      menuItems.forEach(item => {
    item.addEventListener("click", onMenuItemClick);
  });
    
    return function destroy() {
    // remove eventListeners on cleanup 
      btn?.removeEventListener('click', onBtnClick);
      document.removeEventListener('click', onDocClick);

      menuItems.forEach(item => {
        item.removeEventListener("click", onMenuItemClick);
      });
    };
  }

/* SLIDER (Tonje SA) */
// initalizing the slider
export function initSlider(root) {
  // if root not found, stops
  if (!root) return null;
  const track = root.querySelector(".movie-slider");
  const view = root.querySelector(".movie-slider-view");
  // defining the left and right buttons in variabels
  const left = root.querySelector(".button-left");
  const right = root.querySelector(".button-right");
  if (!track || !view || !left || !right) {
    console.error("initSlider: missing elements", { track, view, left, right });
    return null;
  }
  // The starting point for the slider
  let index = 0;
  // gets all of the slider items
  const getItems = () => [...track.querySelectorAll(".slider-item")];

  // calculates how much the slider will move
  const step = () => {
    // items get the value of all of the movies in the slider
    const items = getItems();
    const first = items[0];
    const second = items[1];
    if (!first) return 0;
    // if there is a second poster, it calculates the space from the second to the first poster
    // then return the space and uses that for movement in the slider
    if (second) {
      return second.offsetLeft - first.offsetLeft;
    }
    const rect = first.getBoundingClientRect();
    // returns width
    return (
      rect.width 
    );
  };
  // the number of poster that fits/shows in the view
  const visible = () => {
    const width = step();
    return Math.max(1, Math.floor(view.clientWidth / (width || 1)));
  };
  // max is a variable for the number of posters in the slider, before the rightbutton dont work (the end of the slider)
  const max = () => {
    return Math.max(0, getItems().length - visible() -1);
  };
  // variable hasOverflow for checking if the slider har more items than is showing
  const hasOverflow = () => {
    return track.scrollWidth > view.clientWidth + 1;
  };
  // updates the slider position an buttons
  const update = () => {
    const width = step();
    const maxIndex = max();
    // prevent that the index is never under 0 or more than maxIndex
    index = Math.max(0, Math.min(index, maxIndex));
    
    track.style.transform = width > 0
      ? `translateX(-${Math.round(index * width)}px)`
      : "translateX(0px)";
    // makes the button non-functional at start of the index
    left.disabled = !hasOverflow() || index === 0;
    // makes the button non-functional at the end of the index
    right.disabled = !hasOverflow() || index >= maxIndex;
  };
  // moves the elements in the slider to the right
  const goRight = () => {
    index++;
    update();
  };
  // moves the elements in the slider to the left
  const goLeft = () => {
    index--;
    update();
  };
  // listening for click from the right button
  right.addEventListener("click", goRight);
  // listening for click from the left button
  left.addEventListener("click", goLeft);
  // listening for window size changes
  window.addEventListener("resize", update);
  // MutationObserver listens if movies are added og removed
  const observer = new MutationObserver(update);
  // updates when changes in the slider
  observer.observe(track, { childList: true });
  // initialize update of the slider
  update();
  
  return {
    update,
    // remove eventListners 
    destroy() {
      observer.disconnect();
      right.removeEventListener("click", goRight);
      left.removeEventListener("click", goLeft);
      window.removeEventListener("resize", update);
    }
  };
}

/* Gets elements for the profile-picture (Tonje SA and Benjamin) */
// getting picture-elements from the HTML-document
export function getProfilePictureElements(root = document) {

  // Button for uploading picture
  const input = root.querySelector('.upload-picture')
  const preview = root.querySelector('.profile-picture-preview');

  return { input, preview };
}

/* Function for showing the image (Tonje SA and Benjamin ) */ 
export function showProfilePreview(previewEl, url) {
  // if no element returns empty
  if (!previewEl) return;
  const tag = previewEl.tagName?.toLowerCase();
  // Checks if the file is an image-type
  if (tag === 'img') {
    previewEl.src = url || '';
    previewEl.style.display = url ? '' : 'none';
    return;
  }
}

// Benjamin
// Enables the drag and drop function for favorite movie area
export function bindFavoriteDropzone(onDropMovie) {
  const dropzone = document.getElementById("favorite-dropzone");

  if (!dropzone) return;

  dropzone.ondragover = (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  };

  dropzone.ondragleave = () => {
    dropzone.classList.remove("drag-over");
  };

  dropzone.ondrop = async (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");

    const tmdbId = e.dataTransfer.getData("tmdbId");

    if (!tmdbId) return;

    await onDropMovie(tmdbId);
  };
}

// benjamin
// Renders movie card in favortie spot with open, delete and rate function
export function renderFavoriteMovie(
  movie,
  onMovieClick,
  onDeleteClick,
  onRatingClick
) {
  const container = document.getElementById("favorite-dropzone-container");

  if (!container) return;
  // Shows and empty space with instuction if no movie in favorite
  if (!movie) {
    container.innerHTML = `
      <div id="favorite-empty-dropzone" class="empty-state">
        <p>Drag favorite movie here</p>
      </div>
    `;
    return;
  }

  const posterUrl = movie.posterPath?.startsWith("/")
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : `https://image.tmdb.org/t/p/w500/${movie.posterPath}`;

  const myRating = movie.myRating || 0;
// Renders favorite movie with user rating and TBDB rating
  container.innerHTML = `
    <div class="favorite-movie-card">

      <button class="favorite-delete-btn">
        ✕
      </button>

      <p class="tmdb-rating-overlay">
        TMDB ${movie.voteAverage ?? "N/A"}/10
      </p>

      <img 
        src="${posterUrl}" 
        alt="${movie.title}" 
        class="favorite-movie-poster"
      >

      <div class="movie-rating favorite-rating">
        <p class="my-rating-label">My rating</p>
        <div class="stars">
          ${[1, 2, 3, 4, 5]
            .map((star) => `
              <span class="favorite-star" data-rating="${star}">
                ${star <= myRating ? "★" : "☆"}
              </span>
            `)
            .join("")}
        </div>
      </div>

    </div>
  `;

  const poster = container.querySelector(".favorite-movie-poster");
  const deleteBtn = container.querySelector(".favorite-delete-btn");
  const stars = container.querySelectorAll(".favorite-star");

  poster.addEventListener("click", () => {
    if (typeof onMovieClick === "function") {
      onMovieClick(movie);
    }
  });

  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    if (typeof onDeleteClick === "function") {
      onDeleteClick(movie);
    }
  });

  stars.forEach((star) => {
    star.addEventListener("click", (event) => {
      event.stopPropagation();

      const rating = Number(star.dataset.rating);

      if (typeof onRatingClick === "function") {
        onRatingClick(movie, rating);
      }
    });
  });
}
