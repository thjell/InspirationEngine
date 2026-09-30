// Written by Sander
import { db } from "../firebase.js";
import { 
  ref, 
  get,
  child
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Fetches movies from Firebase and filters them based on your specific schema.
 */
export async function getFilteredMovies(selectedGenre, selectedCompany, selectedAge) {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, `movies`));
        if (snapshot.exists()) {
            const allMovies = snapshot.val();
            const moviesArray = Object.values(allMovies);

            return moviesArray.filter(movie => {
                //Genre Match
                const movieGenres = movie.genres ? Object.keys(movie.genres) : [];
                const matchesGenre = movieGenres.some(g => 
                    g.toLowerCase() === selectedGenre.toLowerCase()
                );  
                
                // Company Match 
                const movieWatchWith = movie.watchWith
                    ? Object.entries(movie.watchWith)
                   .filter(([key, value]) => value === true)
                    .map(([key]) => key):
                 [];

                 const matchesCompany = movieWatchWith.some(c =>
                    c.toLowerCase() === selectedCompany.toLowerCase()
                    );

                //Age Match
                const movieAge = Number(movie.ageLimit) || 0;
                const userAge = parseInt(selectedAge.replace('+', '')) || 0;
                const matchesAge = movieAge <= userAge;

                return matchesGenre && matchesCompany && matchesAge;
            }); 
        }
        return []; // return empty array if snapshot doesn't exist
        
    } catch (error) {
        console.error("Database fetch failed:", error);
        return [];
    }
}