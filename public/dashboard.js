import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import {getStorage, ref, deleteObject} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js';

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
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const lessonCol = collection(db, "lessons");

document.getElementById("logout-btn").addEventListener("click", function (event) {
    event.preventDefault()
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log(error);
    });
});

function attachDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            const documentId = this.getAttribute('data-id');
            const fileUrl = this.getAttribute('data-url');
            const thumbUrl = this.getAttribute('data-thumb');

            deleteDoc(doc(db, "lessons", documentId)).then(() => {
                const deletions = [deleteObject(ref(storage, fileUrl))];
                if (thumbUrl) deletions.push(deleteObject(ref(storage, thumbUrl)));

                Promise.all(deletions).then(() => {
                    console.log("Database record and physical file completely deleted");
                    location.reload();
                }).catch((error) => {
                    console.error("Error deleting physical file:", error);
                });
            }).catch((error) => {
                console.error("Error deleting database record:", error);
            });
        });
    });
}

function fetchLessons(q) {
    const uploadContainer = document.querySelector('.recently_uploaded_content');
    getDocs(q).then((snapshot) => {
        uploadContainer.innerHTML = '';
        snapshot.forEach((document) => {
            const lesson = document.data();
            const thumbSrc = lesson.thumbnailUrl || "";
            const thumbHtml = thumbSrc
                ? `<img src="${thumbSrc}" alt="Lesson thumbnail" class="lesson-thumbnail" onerror="this.outerHTML='<div class=\\'lesson-thumbnail lesson-thumbnail--placeholder\\'>Processing...</div>'">`
                : `<div class="lesson-thumbnail lesson-thumbnail--placeholder">No Preview</div>`;

            uploadContainer.innerHTML += `
                <div class="lesson-card">
                    <a href="${lesson.url}" target="_blank" class="lesson-card__thumb-link">
                        ${thumbHtml}
                    </a>
                    <div class="lesson-card__info">
                        <h4 class="lesson-card__title">${lesson.title}</h4>
                        <p class="lesson-card__meta">${lesson.date}</p>
                        <p class="lesson-card__meta">${lesson.author}</p>
                        <div class="lesson-card__actions">
                            <button class="delete-btn" data-id="${document.id}" data-url="${lesson.url}" data-thumb="${thumbSrc}">Delete</button>
                            <a href="messages.html?to=${lesson.name}&topic=${encodeURIComponent(lesson.title)}"><button>Send a message</button></a>
                        </div>
                    </div>
                </div>
            `;
        });
        attachDeleteListeners();
    });
}

// Making sure they're logged in before they can access the dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        // The teacher is logged in
        console.log("Teacher logged in:", user.email);
        document.getElementById("welcome-msg").innerText = "Welcome, " + user.displayName + "!";
        const name_query = query(lessonCol, where("name", "==", user.email));
        fetchLessons(name_query);
    } else {
        window.location.href = 'index.html';
    }
});
