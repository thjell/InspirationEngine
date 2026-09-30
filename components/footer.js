// This file creates a reusable footer component
// used across multiple HTML pages in the application.
//
// The footer contains shared information
//  and one navigation link that should appear on every page.
// (Written by Mia)

// Defines a custom HTML component
class AppFooter extends HTMLElement {
    // Runs automatically when component is added to the page
    connectedCallback() {

        // Creates footer HTML structure
        this.innerHTML = `
            <footer class="main-footer">
                <p>© 2026 More popcorn less scrolling</p>
                <nav>
                    <a href="privacy.html">Privacy Policy</a>
                </nav>
            </footer> 
        `
    }
}
// Conects the AppFooter class to the custom HTML tag <app-footer>
customElements.define("app-footer", AppFooter);
