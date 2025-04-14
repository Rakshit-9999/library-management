// Import the Firebase SDK modules you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
// Replace with your actual Firebase configuration object

const firebaseConfig = {
    apiKey: "AIzaSyBD678vVm2MMArccQlHaFzHIHxOAXFsORU",
    authDomain: "library-management-22f60.firebaseapp.com",
    projectId: "library-management-22f60",
    storageBucket: "library-management-22f60.firebasestorage.app",
    messagingSenderId: "638000411360",
    appId: "1:638000411360:web:dab19e7fe1f4d606995685",
    measurementId: "G-ZRDRELMV6Z"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Get references to the HTML elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
const googleButton = document.querySelector(".social-btn.google"); // Corrected selector

// Sign-in with Email and Password
submitButton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;
        console.log("User signed in:", user);
        // Redirect or update UI as needed (e.g., redirect to the library page)
        window.location.href = '/library'; //Example: redirect to /library
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign-in error:", errorCode, errorMessage);
        alert("Sign-in failed: " + errorMessage);
        // Display error message to the user
    }
});

//Sign-in with Google
googleButton.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        // Signed in
        const user = auth.currentUser;
        console.log("User signed in with Google:", user);
        // Redirect or update UI as needed
        window.location.href = '/library'; //Example: redirect to /library
    } catch (error) {
        console.error("Google sign-in error:", error);
        alert("Google sign-in failed: " + error.message);
    }
});

// Check Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log("User is currently signed in with UID:", uid);
        // You can update the UI or redirect the user
    } else {
        // User is signed out
        console.log("User is signed out");
        // Update the UI to reflect the signed-out state
    }
});
