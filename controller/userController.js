// This is a controller file.
// The controller connects the view and the model.
// It handles application logic and decides what happens next.

import { createUser, loginUser, logoutUser, deleteCurrentUser } from "../model/userModel.js"; 
import "../components/modal.js";
import { initUserView } from "../view/userView.js";
const modal = document.querySelector("app-modal");

// CREATE USER (Written by Mia)

// Handles create user request from view
export async function handleCreateUser(email, password, repeatPassword) {
    
    // Checks if passwords match 
    if(password !== repeatPassword) {

      modal.show({
        title: "Error",
        message: "Passwords do not match"
      });
       
      return;
    }
    // Check password length
    if(password.length < 6) {

      modal.show({
        title: "Weak password",
        message: "Password must contain at least 6 characters."
      });

      return;
    }
    
    try {
        // Calls model function
        await createUser(email, password);

        // Redirects user after success
        window.location.href = "login.html";

    } catch (error) { // Shows error message
        modal.show({
          title: "Error",
          message: error.message
        });
    }
}

// DELETE USER (Written by Mia)
// Handles delete user request from the view
export async function handleDeleteUser() {

    // Show confirmation modal and ask user before deleting
    modal.show({
        title: "Delete user",
        message: "Enter your password to confirm deletion.",
        requirePassword: true,
        confirmText: "Delete",
        cancelText: "Cancel",

        // Runs when user confirms
        onConfirm: async function(password) {
             try {
                // Calls model function
                await deleteCurrentUser(password);
                // Redirects to homepage
                window.location.href = "index.html";
                
            } catch(error) { // Shows error message
                modal.show({
                  title: "Wrong password - try again",
                });
            }
        }
    })
}


// LOGIN (Written by Mia)
// Handles login request from view
export async function handleLogin(email, password) {

    try {
        // Calls model function
        await loginUser(email, password);

        // Redirects after succesful login
        redirectAfterLogin();
    } catch (error) {
        // Shows when email not exist or password is wrong
        let errorMessage = "Incorrect email or password";

        // Invalid email format
        if (error.code == "auth/invalid-email") {
          errorMessage = "Invalid email address";
        }
        modal.show({ // Shows error message
            title: "Error",
            message: errorMessage,
            confirmText: "OK",
            cancelText: ""
        });
    }
}

// REDIRECT ETTER LOGIN (Written by Mia)
function redirectAfterLogin() {
    // Gets stored redirect page
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    // Checks if redirect page exists
    if(redirectUrl) {

        // Removes saved redirect
        localStorage.removeItem("redirectAfterLogin");
        // Redirects back to previous page
        window.location.href = redirectUrl;

    } else {
        // Default page after login
        window.location.href = "user-profile.html";
    }
}

// Log out function (written by Tonje SA)
const logOutFunction = {
  // ensure that the logout function only runs once
  _initialized: false,

  // Initialize the logout
  init() {
    if (this._initialized) return;
    this._initialized = true;
    // Binds the DOM-elements
    const bind = () => {
      // the logoutButton in DOM
      const logoutButton = document.getElementById("logoutButton");
      // Makes a variable of the app-modal in DOM 
      const modal = document.querySelector("app-modal");

      if (!logoutButton) return;
      // listens for click in the logoutButton
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.showLogoutModal(modal);
      });
    };

    // Checks if the documnet is loading
    if (document.readyState === "loading") {
      // waits until DOM Content is done loading before register the function bind
      document.addEventListener("DOMContentLoaded", bind);
    } else {
      // if all elements is done loading the function bind is used
      bind();
    }
  },

  // logout modal
  showLogoutModal(modal) {
    if (!modal) return;

    modal.show({
      title: "Log out",
      message: "Are you sure you want to log out?",
      confirmText: "Yes, log out",
      cancelText: "Cancel",
      onConfirm: async () => {
        await this.handleLogOut();
      },
      onCancel: () => {
      }
    });
  },
  // returns the user to login
  async handleLogOut() {
    try {
      await logoutUser();
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Logout error:", error);
      const modal = document.querySelector("app-modal");
      if (modal) {
        modal.show({
          title: "Error",
          message: "Something went wrong while logging out. Please try again.",
          confirmText: "OK",
          cancelText: "",
          onConfirm: () => {
          }
        });
      }
    }
  }
};
export { logOutFunction };

// Starts user view when page is loaded. 
document.addEventListener("DOMContentLoaded", () => {

  initUserView(
    handleLogin,
    handleCreateUser,
    handleDeleteUser
  );
});