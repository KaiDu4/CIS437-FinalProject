import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
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

function attachDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const documentId = this.getAttribute('data-id');
            deleteDoc(doc(db, "lessons", documentId)).then(() => {
                console.log("deleted:", documentId);
                location.reload();
            });
        });
    });
}

function fetchLessons(q) {
    const uploadContainer = document.querySelector('.recently_uploaded_content');
    getDocs(q).then((snapshot) => {
        uploadContainer.innerHTML = '';
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
                            <h4>Lesson: ${lesson.title}</h4>
                        </div>
                        <div class="recently_uploaded_date">
                            <h4>Uploaded on: ${lesson.date}</h4>
                        </div>
                        <div class="Creator_Info">
                            <h4>Uploaded by: ${lesson.author}</h4>
                            <a href="messages.html?to=${lesson.name}&topic=${encodeURIComponent(lesson.title)}"><button>Send a message</button></a>
                        </div>
                    </div>
                </div>
            `;
        });
        attachDeleteListeners()
    });
}

// Making sure they're logged in before they can access the dashboard - need to figure out individualized dashboard if time
onAuthStateChanged(auth, (user) => {
    if (user) {
        // The teacher is logged in
        console.log("Teacher logged in:", user.email);
        //const name_query= query(lessonCol, where("name", "==", user.email));
        fetchLessons(lessonCol)

    } else {
        window.location.href = 'index.html';
    }
});

