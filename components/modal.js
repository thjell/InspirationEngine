// This file creates a reusable modal Web Component
// used across multiple HTML pages in the application. 
//
// The modal component is used for shared popups,
// confirmation messages, error messages, 
// and password confirmation messages. 
// Written by Mia

// Create a custom HTML element called <app-modal>
class AppModal extends HTMLElement {

    constructor() {

        super();

        // Stores optional password input field
        this.inputEl = null;

        // Creates modal HTML structure
        this.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <h2 class="modal-title"></h2>
                    <p class="modal-message"></p>
                    <div class="modal-buttons">
                        <button class="confirm-btn">OK</button>
                        <button class="cancel-btn secondary">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Get modal elements
        this.modal = this.querySelector(".modal");
        this.titleEl = this.querySelector(".modal-title");
        this.messageEl = this.querySelector(".modal-message");
        this.confirmBtn = this.querySelector(".confirm-btn");
        this.cancelBtn = this.querySelector(".cancel-btn");
    }

    // Displays modal popup
    show({
        title,
        message,
        confirmText = "OK",
        cancelText = "Cancel",
        requirePassword = false,
        onConfirm = null,
        onCancel = null
    }) {

        // Sets modal title
        this.titleEl.textContent = title;

        // Sets modal message
        // Replace line breas with HTML <br>
        this.messageEl.innerHTML = message.replace(/\n/g, "<br>");

        // Set button text
        this.confirmBtn.textContent = confirmText;
        this.cancelBtn.textContent = cancelText;

        // Hide cancel button if no cancel exists
        if(!cancelText) {

            this.cancelBtn.style.display = "none";

        } else {

            this.cancelBtn.style.display =
                "inline-block";
        }

        // Adds password input field if modal requires password confirmation
        if (requirePassword) {
            if (!this.inputEl) {
                
                // Create input element, and assign type, id, class, and placeholder to it
                this.inputEl = Object.assign(document.createElement("input"), {
                    type: "password",
                    id: "delete-password",
                    className: "modal-input",
                    placeholder: "Enter your password"
                });
                this.messageEl.after(this.inputEl);
            }
            this.inputEl.value = ""; // Set old password value to blank
        } else if (this.inputEl) {
            this.inputEl.remove();
            this.inputEl = null;
        }

        // Runs when confirm button is clicked
        this.confirmBtn.onclick = async () => {
            try {
                // Runs confirm callback function
                if(onConfirm) {
                    // Sends password value if input exists
                    await onConfirm(
                        this.inputEl?.value
                    );
                }
                // Closes modal after success
                this.close();
            } catch(error) {
                console.error(error);
            }
        };

        // Runs when cancel button is click
        this.cancelBtn.onclick = () => {

            // Runs cancel callback function
            if(onCancel) {
                onCancel();
            }
            // Closes modal
            this.close();
        };

        // Shows modal on screen
        this.modal.classList.add("show");
    }

    // Hides modal popup
    close() {
        this.modal.classList.remove("show");
    }
}

// Connects the AppModal class to the custom HTML tag <app-modal>
customElements.define("app-modal", AppModal);

