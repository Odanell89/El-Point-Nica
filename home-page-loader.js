// home-page-loader.js
import { db } from './firebase-config.js';
import { collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedEvents();
    loadFeaturedPymes();
});

async function loadFeaturedEvents() {
    const eventsGrid = document.querySelector('.featured-events .card-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = ''; // Clear placeholders
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("approved", "==", true), limit(3));
    
    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            eventsGrid.innerHTML = '<p>No hay eventos destacados en este momento.</p>';
            return;
        }
        querySnapshot.forEach((doc) => {
            const event = doc.data();
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
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
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });
    } catch (error) {
        console.error("Error loading featured events:", error);
        eventsGrid.innerHTML = '<p>Error al cargar los eventos.</p>';
    }
}

async function loadFeaturedPymes() {
    const pymesGrid = document.querySelector('.featured-pymes .card-grid');
    if (!pymesGrid) return;
    
    pymesGrid.innerHTML = ''; // Clear placeholders
    const pymesRef = collection(db, "pymes");
    const q = query(pymesRef, where("approved", "==", true), limit(3));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            pymesGrid.innerHTML = '<p>No hay Pymes destacadas en este momento.</p>';
            return;
        }
        querySnapshot.forEach((doc) => {
            const pyme = doc.data();
            const pymeCard = document.createElement('div');
            pymeCard.classList.add('pyme-card'); 
            pymeCard.innerHTML = `
                <div class="card-image-placeholder">
                     ${pyme.logoUrl ? `<img src="${pyme.logoUrl}" alt="${pyme.name}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                    <span class="category-tag ${pyme.category}">${pyme.category}</span>
                </div>
                <div class="card-content">
                    <h3>${pyme.name}</h3>
                    <p class="pyme-description">${pyme.description}</p>
                    <p class="card-info"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${pyme.address}</p>
                    <a href="pymes.html#${doc.id}" class="details-link">Ver detalles <i class="fas fa-chevron-right" aria-hidden="true"></i></a>
                </div>
            `;
            pymesGrid.appendChild(pymeCard);
        });
    } catch (error) {
        console.error("Error loading featured pymes:", error);
        pymesGrid.innerHTML = '<p>Error al cargar las Pymes.</p>';
    }
}
