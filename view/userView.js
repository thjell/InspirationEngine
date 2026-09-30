// This is a view file.
// The view handles user interaction from the HTML oage
// and send the fata to the controller

export function initUserView(onLogin, onCreateUser, onDeleteUser) {

    // CREATE USER (Written by Mia)

    // Gets the create account form
    const createForm = document.getElementById("createUserForm");
    // Checks if form exists on page
    if(createForm) {
        createForm.addEventListener("submit", async (event) => { // Listens for submit event
            event.preventDefault(); // Prevents page reload
        
            // Gets input values from form
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const passwordRepeat = document.getElementById("password-repeat").value;

            // Sends data to controller
            await onCreateUser(email, password, passwordRepeat);
         });
    }

    // LOGIN (Written by Mia)

    // Gets login form
    const loginForm = document.getElementById("loginForm");

    // Checks if login form exists
    if(loginForm) {
        loginForm.addEventListener("submit", async (event) => { // Listens for submit event
            event.preventDefault(); // Prevent page reload

            // Gets input values from form
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Sends data to controller 
            await onLogin(email, password);
        });
    }

    // DELETE USER (Written by Mia)

    // Gets delete button
    const deleteBtn = document.getElementById("delete-user-btn");

    // Checks if button exists on page
    if(deleteBtn) { 
        deleteBtn.addEventListener("click", async () => { // Listen for click event
         
            // Sends delete request to controller
            await onDeleteUser();
        });
    }
}
