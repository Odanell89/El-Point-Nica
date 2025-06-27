// explore.js
import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const eventsGrid = document.querySelector('.card-grid');
    const resultsCount = document.querySelector('.results-count');
    const adminUid = "KmDTHeR4qLSyaUpvPJ3YTxjTZXJ2";
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        loadEvents();
    });

    async function loadEvents() {
        if (!eventsGrid) return;
        eventsGrid.innerHTML = '';
        const eventsRef = collection(db, "events");
        let q;

        const isAdmin = currentUser && currentUser.uid === adminUid;

        if (isAdmin) {
            q = query(eventsRef);
        } else {
            q = query(eventsRef, where("approved", "==", true));
        }

        const querySnapshot = await getDocs(q);
        if (resultsCount) {
            resultsCount.textContent = `Mostrando ${querySnapshot.size} eventos`;
        }

        const noResultsEl = document.querySelector('.no-results');
        if (noResultsEl) {
            noResultsEl.style.display = querySnapshot.empty ? 'block' : 'none';
        }


        querySnapshot.forEach((doc) => {
            const event = doc.data();
            const eventId = doc.id;
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            if (!event.approved) {
                eventCard.classList.add('pending-approval');
            }

            let adminButtons = '';
            if (isAdmin) {
                adminButtons = `
                    <div class="admin-actions">
                        ${!event.approved ? `<button class="btn btn-approve" data-id="${eventId}">Aprobar</button>` : ''}
                        <button class="btn btn-delete" data-id="${eventId}">Eliminar</button>
                    </div>
                `;
            }

            eventCard.innerHTML = `
                <div class="card-image-placeholder">
                    ${event.imageUrl ? `<img src="${event.imageUrl}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                    <span class="category-tag ${event.category}">${event.category}</span>
                </div>
                <div class="card-content">
                    <h3>${event.title}</h3>
                    <p class="card-info"><i class="far fa-calendar-alt" aria-hidden="true"></i> ${new Date(event.date).toLocaleString()}</p>
                    <p class="card-info"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${event.locationName}</p>
                    <div class="card-footer">
                        <span class="price">${event.price > 0 ? `C$${event.price}` : 'Gratis'}</span>
                        <button class="favorite-btn" aria-label="Añadir ${event.title} a favoritos" aria-pressed="false"><i class="far fa-heart" aria-hidden="true"></i></button>
                    </div>
                    ${adminButtons}
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });
    }

    eventsGrid.addEventListener('click', async (e) => {
        const target = e.target;
        const eventId = target.dataset.id;
        if (!eventId) return;

        if (target.classList.contains('btn-approve')) {
            await updateDoc(doc(db, "events", eventId), { approved: true });
            loadEvents();
        } else if (target.classList.contains('btn-delete')) {
            if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
                await deleteDoc(doc(db, "events", eventId));
                loadEvents();
            }
        }
    });
});
