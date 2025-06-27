// register-business.js
import { db, auth, storage } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const businessForm = document.querySelector('form');
    if(businessForm) {
        businessForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to register a business.");
                window.location.href = 'login.html';
                return;
            }

            const name = document.getElementById('business-name').value;
            const description = document.getElementById('business-description').value;
            const category = document.getElementById('business-category').value;
            const address = document.getElementById('business-address').value;
            const phone = document.getElementById('business-phone').value;
            const email = document.getElementById('business-email').value;
            const logoFile = document.getElementById('business-logo').files[0];

            let logoUrl = '';
            if (logoFile) {
                const storageRef = ref(storage, `business-logos/${logoFile.name}`);
                await uploadBytes(storageRef, logoFile);
                logoUrl = await getDownloadURL(storageRef);
            }

            try {
                await addDoc(collection(db, "pymes"), {
                    creatorId: user.uid,
                    name,
                    description,
                    category,
                    address,
                    phone,
                    email,
                    logoUrl,
                    approved: false
                });
                alert("Business registered successfully!");
                businessForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error registering business. Please try again.");
            }
        });
    }
});
