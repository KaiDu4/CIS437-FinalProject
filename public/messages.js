import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {getAuth, onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import {addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

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
let currentChatUser = "";
let currentUserEmail = "";
let allMyMessages = [];
const urlParams = new URLSearchParams(window.location.search);
const toEmail = urlParams.get('to');
const topic = urlParams.get('topic');

document.getElementById("logout-btn").addEventListener("click", function (event) {
    event.preventDefault()
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log(error);
    });
});

if (toEmail) {
    currentChatUser = toEmail;
    document.getElementById("recipient-email").value = toEmail;
}

if (topic) {
    document.getElementById("message-input").value = `Hi, I have a question about your lesson plan`;
}

function loadMessages() {
    const timestamp_q = query(messagesCol, orderBy("timestamp", "asc"));

    onSnapshot(timestamp_q, (snapshot) => {
        allMyMessages = [];
        let contacts = new Set();

        if (currentChatUser !== "") {
            contacts.add(currentChatUser);
        }

        snapshot.forEach((doc) => {
            const msg = doc.data();

            if (currentUserEmail === msg.sender || currentUserEmail === msg.recipient) {
                allMyMessages.push(msg)
                if (msg.sender !== currentUserEmail) contacts.add(msg.sender);
                if (msg.recipient !== currentUserEmail) contacts.add(msg.recipient);
            }
        });
        renderContacts(contacts);
        renderChat();
    });
}

function renderContacts(contacts) {
    const contactsDiv = document.getElementById("contacts-list");
    contactsDiv.innerHTML = "";

    contacts.forEach(contactEmail => {
        const isSelected = contactEmail === currentChatUser ? "background-color: #d1ecf1;" : "";

        contactsDiv.innerHTML += `
            <div class="contact-item" data-email="${contactEmail}" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee; ${isSelected}">
                <strong>${contactEmail}</strong>
            </div>
        `;
    });

    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener("click", function() {
            currentChatUser = this.getAttribute("data-email");
            document.getElementById("recipient-email").value = currentChatUser;
            renderContacts(contacts);
            renderChat();
        });
    });
}

function renderChat() {
    const display = document.getElementById("messages-display");
    display.innerHTML = "";


    if (currentChatUser === "") {
        display.innerHTML = `<p style="text-align: center; color: #888; margin-top: 50px;">Select a conversation to start chatting!</p>`;
        return;
    }

    allMyMessages.forEach(msg => {
        if (
            (msg.sender === currentUserEmail && msg.recipient === currentChatUser) ||
            (msg.sender === currentChatUser && msg.recipient === currentUserEmail)
        ) {
            display.innerHTML += `
                <div style="margin-bottom: 10px; padding: 10px; border-radius: 5px; background-color: ${msg.sender === currentUserEmail ? '#e3f2fd' : '#f1f1f1'};">
                    <small><strong>${msg.sender}</strong></small><br>
                    ${msg.text}
                </div>
            `;
        }
    });

    display.scrollTop = display.scrollHeight;
}

document.getElementById("send-btn").addEventListener("click", function (event) {
    event.preventDefault();
    const recipientElement = document.getElementById("recipient-email");
    const recipientEmail = recipientElement.value;
    const inputElement = document.getElementById("message-input");
    const text = inputElement.value;

    currentChatUser = recipientEmail;

    addDoc(messagesCol, {
        text: text,
        sender: currentUserEmail,
        recipient: recipientEmail,
        timestamp: serverTimestamp()
    }).then(() => {
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
