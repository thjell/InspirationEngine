// This file creates a reusable header component 
// used across multiple HTML oages in the application.
//
// The header handles:
// - navigation links
// - logo and page title
// - authentication-based navigation
// (Written by Mia)

import "../authState.js";


// Defines a custom HTML component, called <app-header>
class AppHeader extends HTMLElement {
    // Runs automatically when component is added to the page
    connectedCallback() {

        // Gets optional title attribute
        const title = this.getAttribute('title');

        // Creates header HTML structure
        this.innerHTML = `
            <header class="topbar">
                <div class="header-content">
                    <div class="logo-container">
                        <a href="index.html" class="logo-link">
                            <img src="images/wheel_clean_ui.png" alt="Movie Library Logo" class="logo">
                        </a>
                    </div>
                    ${title ? `<h1>${title}</h1>` : ''}
                    <nav class="nav-buttons" id="nav-links"></nav>
                </div>
            </header>
        `
        // Gets navigation container
        const nav = document.getElementById("nav-links");

        // Checks if navigation exists
        if(nav){

            // Runs when user logs in and update navigation links for authenticated users
            document.addEventListener("auth:login", (e) => { 
                nav.innerHTML = `
                    <a href="index.html">Home</a>
                    <a href="library.html">Library</a>
                    <a href="user-profile.html">My account</a>
                `;
            });
            
            // Runs when user logs out and update navigation links for guests/non-logged in users
            document.addEventListener("auth:logout", () => {
                nav.innerHTML = `
                    <a href="index.html">Home</a>
                    <a href="library.html">Library</a>
                    <a href="login.html">Log in</a>
                `;
            });
        }
    }
}
// Connects the AppHeader class to the custom HTML tag <app-header>
customElements.define("app-header", AppHeader);
