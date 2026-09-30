// Written by Tonje H
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function buildPosterUrl(movie) {
    // Helpfunction for building the full URL for a movie poster
    const posterPath = movie?.posterPath?.trim();

    if (!posterPath) return "";

    return posterPath.startsWith("/")
        ? `${POSTER_BASE_URL}${posterPath}`
        : `${POSTER_BASE_URL}/${posterPath}`;
}

export function formatTmdbRating(movie) {
    // Helpfunction for formatting the TMDB rating
    if (movie?.voteAverage === undefined || movie?.voteAverage === null) {// Checks if the voteAverage property exists and is not null, and if not, returns "N/A" to indicate that the rating is not available
        return "N/A";// If the voteAverage is 0, it means the movie has not been rated yet, so we also return "N/A" in that case
    }

    return Number(movie.voteAverage).toFixed(1);
}

export function createStars(rating = 0) {
    //Helpfunction for creating star icons based on the rating
    let stars = "";

    for (let i = 1; i <= 5; i++) {
        stars += `
            <span class="star" data-value="${i}">
                ${i <= rating ? "⭐" : "☆"}
            </span>
        `;
    }

    return stars;
}

export function hasPoster(movie) {
    // Helpfunction for checking if a movie object has a valid posterPath
    return Boolean(movie?.posterPath?.trim());
}