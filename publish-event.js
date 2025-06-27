// publish-event.js
import { db, auth, storage } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.querySelector('form');
    if(eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to publish an event.");
                window.location.href = 'login.html';
                return;
            }

            const title = document.getElementById('event-title').value;
            const description = document.getElementById('event-description').value;
            const category = document.getElementById('event-category').value;
            const date = document.getElementById('event-date').value;
            const locationName = document.getElementById('event-location-name').value;
            const address = document.getElementById('event-address').value;
            const price = document.getElementById('event-price').value;
            const imageFile = document.getElementById('event-image').files[0];

            let imageUrl = '';
            if (imageFile) {
                const storageRef = ref(storage, `event-images/${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            try {
                await addDoc(collection(db, "events"), {
                    creatorId: user.uid,
                    title,
                    description,
                    category,
                    date,
                    locationName,
                    address,
                    price: price ? Number(price) : 0,
                    imageUrl,
                    approved: false
                });
                alert("Event submitted successfully for review!");
                eventForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error submitting event. Please try again.");
            }
        });
    }
});
