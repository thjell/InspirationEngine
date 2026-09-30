// This is a model file.
// The model handles communication with firebase
// and manages the application data. 

import { auth, db, storage } from "../firebase.js";
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,deleteUser,EmailAuthProvider,reauthenticateWithCredential} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {ref as dbRef,set,remove} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {ref as storageRef,listAll,deleteObject} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// CREATE USER (Written by Mia)
export async function createUser(email, password) {

    // Create Firebase Authentication user and saves email and password securely
    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

    // Gets created user object and stores it in variabel "user"
    const user = userCredential.user;

    // Saves additional user data in Firebase Realtime database
    await set(
        dbRef(db, "users/" + user.uid),
        {
            email: user.email,
            createdAt: Date.now()
        }
    );
}


// LOGIN USER (Written by Mia)
export async function loginUser(email, password) {

    // Signs user into Firebase Authentication using the provided email and password
    const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    // Returns  a userCredential object, containing information about the logged in user
    return userCredential.user;
}


// LOGOUT USER (Tonja SA)
export async function logoutUser() {
    // call and wait for signOutS
    await signOut(auth);
}


// DELETE CURRENT USER (Written by Mia)
export async function deleteCurrentUser(password) {

    // Gets current logged in user
    const user = auth.currentUser;

    // Check if user is signed in
    if(!user) {
        // Stops the function if no user exists
        throw new Error("No user signed in!");
    }

    // Creates Firebase credentials using the user´s email and entered password
    const credential =
        EmailAuthProvider.credential(
            user.email,
            password
        );

    // Firebase requires re-authentication before sensitive actions like deleting account. This verifies that the password is correct
    await reauthenticateWithCredential(
        user,
        credential
    );

  
    // Delete user profile data from Realtime Database
    await remove(
        dbRef(db, "users/" + user.uid)
    );

    // Delete user´s favorite movie
    await remove(
        dbRef(db, "userMovies/" + user.uid)
    );
    
    // Delete profile pictures from Firebase Storage
    // Create reference to the user's profile picture folder in Storage
    const profilePicturesRef =
        storageRef(
            storage,
            "profilePictures/" + user.uid
        );

    try {
        // Get all files inside folder
        const fileList =
            await listAll(profilePicturesRef);

        // Loops through each file in the folder
        for(const fileRef of fileList.items) {
            // Deletes each profile picture
            await deleteObject(fileRef);
        } // Prevents app from crashing if folder does noe exist
    } catch {}

    // Delete Firebase Authentication account, including login credentials 
    await deleteUser(user);
}