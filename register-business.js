// register-business.js
import { db, auth } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const businessForm = document.querySelector('form');
    if(businessForm) {
        businessForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            const creatorId = user ? user.uid : 'anonymous';

            const name = document.getElementById('business-name').value;
            const description = document.getElementById('business-description').value;
            const category = document.getElementById('business-category').value;
            const address = document.getElementById('business-address').value;
            const phone = document.getElementById('business-phone').value;
            const email = document.getElementById('business-email').value;
            // Get the URL from the new input field
            const logoUrl = document.getElementById('business-logo').value;

            try {
                await addDoc(collection(db, "pymes"), {
                    creatorId: creatorId,
                    name,
                    description,
                    category,
                    address,
                    phone,
                    email,
                    logoUrl: logoUrl, // Save the provided URL
                    approved: false
                });
                alert("Business submitted successfully for review!");
                businessForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error submitting business. Please try again.");
            }
        });
    }
});
