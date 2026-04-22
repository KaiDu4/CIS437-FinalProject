import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';

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


document.getElementById("Submit").addEventListener("click", function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User:", userCredential.user);
            window.location.href = 'dashboard.html';
        })

        .catch((error) => {
            console.error("Firebase error:", error.message);
        });
});

document.getElementById("google").addEventListener("click", function(event) {
    event.preventDefault();
    signInWithPopup(auth, provider).then(r => {
        console.log("Signed In:", r.user);
        window.location.href = 'dashboard.html';
    });
})
