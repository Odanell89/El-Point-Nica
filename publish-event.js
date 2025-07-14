// publish-event.js
import { db, auth } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.querySelector('form');
    if(eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            const creatorId = user ? user.uid : 'anonymous';

            const title = document.getElementById('event-title').value;
            const description = document.getElementById('event-description').value;
            const category = document.getElementById('event-category').value;
            const date = document.getElementById('event-date').value;
            const locationName = document.getElementById('event-location-name').value;
            const address = document.getElementById('event-address').value;
            const price = document.getElementById('event-price').value;
            // Get the URL from the new input field
            const imageUrl = document.getElementById('event-image').value;

            try {
                await addDoc(collection(db, "events"), {
                    creatorId: creatorId,
                    title,
                    description,
                    category,
                    date,
                    locationName,
                    address,
                    price: price ? Number(price) : 0,
                    imageUrl: imageUrl, // Save the provided URL
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
