import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {getStorage, ref, uploadBytes} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';
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
const storage = getStorage(app);

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    const author =  document.getElementById("name").value;
    const title = document.getElementById("title").value;
    const date = new Date().toDateString();
    const file = document.getElementById("file").files[0];
    const storageRef = ref(storage, `lessons/${file.name}`);
})

