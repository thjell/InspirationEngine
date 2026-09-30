import { auth } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// This file handles global authentication state for the entire application.
// It listen to Firebase Authentication and checks if a user is logged in or not.
//
// The file also handles:
// - login/logout events
// - protected routes/pages
// - redirect tp login page if user is noe authenticated
//
// Runs automatically when imported and does not need to be called manually.
// Written by Mia


// Firebase listener that runs every time the authentication state changes
onAuthStateChanged(auth, (user) => {

    // Runs if user is logged in
    if (user) {

        console.log("Logged in:", user.email);

        // Sends custom login event so other files/components can react when user logs in
        document.dispatchEvent(
            new CustomEvent("auth:login", {
                detail: { user }
            })
        );

    } else {

        console.log("Not logged in");

        // Send custom logout event when user logs out
        document.dispatchEvent(
            new CustomEvent("auth:logout")
        );

        // Protects user-profile page from unauthorized access
        if (window.location.pathname.includes("user-profile.html")) {

            // Saves current page so user can return after successful login
            localStorage.setItem(
                "redirectAfterLogin",
                window.location.href
            );
            // Redirects unauthenticated user to login page
            window.location.href = "login.html";
        }
    }
});