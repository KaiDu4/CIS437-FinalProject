import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, collection, getDocs} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

// Web app Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyDZytRK5UceQcWV-Y5RDxmd1Lq3iKx4yrI",
        authDomain: "dulak-finalproject-cis437.firebaseapp.com",
        projectId: "dulak-finalproject-cis437",
        storageBucket: "dulak-finalproject-cis437.firebasestorage.app",
        messagingSenderId: "229405261161",
        appId: "1:229405261161:web:9ed022cdb9f0c1406611f8"
    }, app = initializeApp(firebaseConfig), auth = getAuth(app), db = getFirestore(app),
    lessonCol = collection(db, "lessons");

document.getElementById("logout-btn").addEventListener("click", function (event) {
    event.preventDefault()
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.log(error);
    });
});

function fetchLessons() {
    const container = document.getElementById("all-lessons-content");
    getDocs(lessonCol).then((snapshot) => {
        container.innerHTML = '';

        if (snapshot.empty) {
            container.innerHTML = '<p style="text-align:center; padding: 40px; color: #666;">No lessons uploaded yet.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            console.log("Lesson:", doc.data());
            const lesson = doc.data();
            const thumbSrc = lesson.thumbnailUrl || "";
            const thumbHtml = thumbSrc
                ? `<img src="${thumbSrc}" alt="Lesson thumbnail" class="lesson-thumbnail" onerror="this.outerHTML='<div class=\\'lesson-thumbnail lesson-thumbnail--placeholder\\'>Processing...</div>'">`
                : `<div class="lesson-thumbnail lesson-thumbnail--placeholder">No Preview</div>`;

            container.innerHTML += `
                <div class="lesson-card">
                    <a href="${lesson.url}" target="_blank" class="lesson-card__thumb-link">
                        ${thumbHtml}
                    </a>
                    <div class="lesson-card__info">
                        <h4 class="lesson-card__title">Lesson: ${lesson.title}</h4>
                        <p class="lesson-card__meta">Uploaded on: ${lesson.date}</p>
                        <p class="lesson-card__meta">Uploaded by: ${lesson.author}</p>
                        <div class="lesson-card__actions">
                            <a href="messages.html?to=${lesson.name}&topic=${encodeURIComponent(lesson.title)}"><button>Send a message</button></a>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

// Making sure they're logged in before they can access the dashboard - need to figure out individualized dashboard if time
onAuthStateChanged(auth, (user) => {
    if (user) {
        // The teacher is logged in
        console.log("Teacher logged in:", user.email);
        fetchLessons();
    } else {
        window.location.href = 'index.html';
    }
});
