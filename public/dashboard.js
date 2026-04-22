import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';


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
const db = getFirestore(app);

const lessonCol = collection(db, "lessons");


function fetchLessons() {
    const uploadContainer = document.querySelector('.recently_uploaded_content');
    getDocs(lessonCol).then((snapshot) => {
        uploadContainer.innerHTML = ''
        ;
        snapshot.forEach((doc) => {
            console.log("Lesson:", doc.data());
            const lesson = doc.data();


            uploadContainer.innerHTML += `
                <div class="recently_uploaded_item">
                    <div class="recently_uploaded_image">
                        <h3>Image placeholder</h3>
                    </div>
                    <div class="recently_uploaded_info">
                        <div class="recently_uploaded_title">
                            <h4>${lesson.title}</h4>
                        </div>
                        <div class="recently_uploaded_date">
                            <h4>${lesson.date}</h4>
                        </div>
                        <div class="Creator_Info">
                            <h4>${lesson.author}</h4>
                        </div>
                    </div>
                </div>
            `;
        })
    })
}

// Making sure they're logged in before they can access the dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        // The teacher is logged in
        console.log("Teacher logged in:", user.email);
        fetchLessons()

    } else {
        window.location.href = 'index.html';
    }
});

