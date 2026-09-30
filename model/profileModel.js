import { db, storage } from "../firebase.js";
import { ref as dbRef, get, remove, update, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* Function for get saved movies for a spesific user (Tonje SA) */
export async function getSavedMovieCurrentUser(uid) {
  if (!uid) return [];
  try {
    // information from firebase and the saved movies for user
    const snap = await get(dbRef(db, `userMovies/${uid}`));
    if (!snap.exists()) return [];
    // all saved movies for a spesific user are stored as object in value
    const value = snap.val();
    if (!value || typeof value !== "object") return [];
    // creates an array for all usermovies with the following information
    return Object.entries(value).map(([key, val]) => ({
      ...val,
      tmdbId: val?.tmdbId || key,
      title: val?.title || "",
      posterPath: val?.posterPath || "",
      voteAverage: val?.voteAverage ?? null,
      releaseDate: val?.releaseDate || "",
      ageLimit: val?.ageLimit || "",
      overview: val?.overview || "",
      genres: val?.genres || {},
      savedAt: val?.savedAt ?? null,
    }));
  } catch (err) {
    console.error("profileModel.getSavedMovieCurrentUser failed:", err);
    return [];
  }
}
/* benjamin */ 
export async function saveFavoriteMovie(uid, movie) {
  if (!uid) throw new Error("saveFavoriteMovie: missing uid");

  const favoriteRef = dbRef(db, `users/${uid}/favoriteMovie`);

  // If movie is null, remove the favorite movie
  if (!movie) {
    await remove(favoriteRef);
    return;
  }

  if (!movie?.tmdbId) {
    throw new Error("saveFavoriteMovie: missing movie id");
  }

  await set(favoriteRef, {
    tmdbId: movie.tmdbId,
    title: movie.title,
    posterPath: movie.posterPath,
    voteAverage: movie.voteAverage,
    releaseDate: movie.releaseDate,
    ageLimit: movie.ageLimit,
    overview: movie.overview,
    genres: movie.genres,
    myRating: movie.myRating ?? 0,
    favoriteAt: Date.now(),
  });
}
/* benjamin */
export async function getFavoriteMovie(uid) {
  if (!uid) return null;

  const snap = await get(dbRef(db, `users/${uid}/favoriteMovie`));

  return snap.exists() ? snap.val() : null;
}

/* Function for deleting movieposter form the users list (Tonje SA) */
export async function deletePosterById(uid, posterId) {
  if (!uid) throw new Error("deletePosterById: missing uid");
  if (!posterId) throw new Error("deletePosterById: missing posterId");
  // removes the movieposter from the users 
  await remove(dbRef(db, `userMovies/${uid}/${posterId}`));
}

/* Benjamin */
export async function uploadProfilePictureFile(uid, file) {
  if (!uid) throw new Error("uploadProfilePictureFile: missing uid");
  if (!file) throw new Error("uploadProfilePictureFile: missing file");
  const path = `profilePictures/${uid}/profilePicture`;
  const sRef = storageRef(storage, path);

  // Enable client-side (browser) caching for the profile picture
  // Instead of asking Firebase for image for each load, we'll save it in cache
  // for one year, which causes faster loading
  const metadata = {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000', 
  };

  await uploadBytes(sRef, file, metadata);
  const url = await getDownloadURL(sRef);
  await update(dbRef(db, `users/${uid}`), { profilePicture: url });
  return url;
}

/* Get the full userprofile for uid (Tonje SA) */
export async function getUserProfile(uid) {
  if (!uid) return null;
  const snap = await get(dbRef(db, `users/${uid}`));
  return snap.exists() ? snap.val() : null;
}