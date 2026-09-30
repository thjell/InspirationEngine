import { db, auth } from "../firebase.js";
import { ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

//Code by Tonje H

const libraryModel = { 
    // Model for handling data operations related to movies and user ratings, 
    // including fetching movies, saving ratings, and managing the user's movie list
    async getMovies() {
        const snapshot = await get(ref(db, "movies"));
        // fetches all movies from the "movies" node in Firebase Realtime Database

        if (!snapshot.exists()) return [];
        // if there are no movies in the database, return an empty array

        return Object.values(snapshot.val()); 
        // returns an array of movie objects by taking the values from the snapshot
    },


    async getAllUserRatings() {// fetches all ratings for the logged-in user
    const user = auth.currentUser;

    if (!user) return {};

    const snapshot = await get( 
    // Fetches the ratings for the logged-in user from the "users/{userId}/ratings" node in Firebase Realtime Database
        ref(db, `users/${user.uid}/ratings`)
    );

    return snapshot.exists() ? snapshot.val() : {};
},

  
    async saveRating(tmdbId, rating) {
    // fetches all ratings for the logged-in user, checks if the user is logged in, and 
    // saves the rating for the specified movie in both the user's ratings and the movie's 
    // ratings in Firebase Realtime Database
        const user = auth.currentUser;

      if (!user) {
    // if no user is logged in, we cannot save the rating
    return false;
}

        const updates = {}; 

        
        updates[`users/${user.uid}/ratings/${tmdbId}`] = rating;
        // save rating on user
        updates[`movies/${tmdbId}/ratings/${user.uid}`] = rating;
        // save rating on movie
        await update(ref(db), updates);
        return true; 
        // Return true if the update was successful
    },

    checkLoginStatus() {
    // Checks if a user is currently logged in by checking the auth.currentUser 
    // property, which is provided by Firebase Authentication
        return auth.currentUser !== null;
    },

    async saveMovieToMyList(tmdbId) {
        // Saves movie to the logged-in user's "My Movies" list
        try {
            const user = auth.currentUser;// Fetches the currently logged-in user
            if (!user) return "not_logged_in";// If no user is logged in, we cannot save the movie

            const movies = await this.getMovies();// Fetches all movies to find the current movie based on tmdbId
            const movie = movies.find(m => String(m.tmdbId) === String(tmdbId));

            if (!movie) return "movie_not_found";

            await set(ref(db, `userMovies/${user.uid}/${movie.tmdbId}`), {
                // Saves the movie under "userMovies" in Firebase Realtime Database, with tmdbId as 
                // the key and the movie's data as the value
                tmdbId: movie.tmdbId,
                title: movie.title,
                posterPath: movie.posterPath,
                voteAverage: movie.voteAverage,
                releaseDate: movie.releaseDate,
                ageLimit: movie.ageLimit,
                overview: movie.overview,
                genres: movie.genres,
                savedAt: new Date().toISOString()
            });

            return "success";
        } catch (error) {
            console.error("Error saving movie:", error);
            return "error";
        }
    }
};

export default libraryModel;