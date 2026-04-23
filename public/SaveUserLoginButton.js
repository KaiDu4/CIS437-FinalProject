import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

// Web app Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZytRK5UceQcWV-Y5RDxmd1Lq3iKx4yrI",
    authDomain: "dulak-finalproject-cis437.firebaseapp.com",
    projectId: "dulak-finalproject-cis437",
    storageBucket: "dulak-finalproject-cis437.firebasestorage.app",
    messagingSenderId: "229405261161",
    appId: "1:229405261161:web:9ed022cdb9f0c1406611f8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function validateInput(email, password) {
    console.log("validateUser working...")
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const user_bool = email_pattern.test(email);
    const pass_bool = password_pattern.test(password)
    return user_bool && pass_bool;
}

document.getElementById("Submit").addEventListener("click", function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isValid = validateInput(email, password)

    if (isValid) {
        console.log("Validation passed, sending to Firebase...");

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User created:", userCredential.user);
                window.location.href = 'dashboard.html';
            })

            .catch((error) => {
                console.error("Firebase error:", error.message);
            });
    } else {
        console.log("Validation failed. Fix the inputs.");
    }
})

