import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZytRK5UceQcWV-Y5RDxmd1Lq3iKx4yrI",
    authDomain: "dulak-finalproject-cis437.firebaseapp.com",
    projectId: "dulak-finalproject-cis437",
    storageBucket: "dulak-finalproject-cis437.firebasestorage.app",
    messagingSenderId: "229405261161",
    appId: "1:229405261161:web:9ed022cdb9f0c1406611f8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messagesCol = collection(db, "messages");

let currentUserEmail = "";


function loadMessages() {
    const display = document.getElementById("messages-display");
    const timestamp_q = query(messagesCol, orderBy("timestamp", "asc"));

    onSnapshot(timestamp_q, (snapshot) => {
        display.innerHTML = '';
        snapshot.forEach((doc) => {
            const msg = doc.data();
            display.innerHTML += `
                <div style="margin-bottom: 10px;">
                    <strong>${msg.sender}:</strong> ${msg.text}
                </div>
            `;
        });
        display.scrollTop = display.scrollHeight;
    });
}

document.getElementById("send-btn").addEventListener("click", function (event) {
    event.preventDefault();
    const inputElement = document.getElementById("messages-input");
    const text = inputElement.value;
    addDoc(messagesCol,
        {text: text,
            sender: currentUserEmail,
            timestamp: serverTimestamp()}).then(() => {
                inputElement.value = "";
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserEmail = user.email;
        loadMessages();
    } else {
        window.location.href = 'login.html';
    }
});
