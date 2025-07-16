import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const eventDetailContainer = document.getElementById('event-detail-container');
    
    // Get event ID from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');

    if (!eventId) {
        eventDetailContainer.innerHTML = '<p>No se ha especificado un ID de evento.</p>';
        return;
    }

    try {
        const eventRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventRef);

        if (docSnap.exists()) {
            const event = docSnap.data();
            renderEventDetails(event);
        } else {
            eventDetailContainer.innerHTML = '<p>El evento que buscas no existe o ha sido eliminado.</p>';
        }
    } catch (error) {
        console.error("Error al obtener los detalles del evento:", error);
        eventDetailContainer.innerHTML = '<p>Hubo un error al cargar los detalles del evento. Por favor, intenta de nuevo.</p>';
    }
});

function renderEventDetails(event) {
    const eventDetailContainer = document.getElementById('event-detail-container');
    
    const formattedDate = new Date(event.date).toLocaleDateString('es-NI', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    eventDetailContainer.innerHTML = `
        <article class="event-full-detail">
            <img src="${event.imageUrl || 'logo.png'}" alt="Imagen de ${event.title}" class="event-detail-image">
            <div class="event-detail-content">
                <span class="category-tag ${event.category}">${event.category}</span>
                <h1>${event.title}</h1>
                <p class="event-info"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <p class="event-info"><i class="fas fa-map-marker-alt"></i> ${event.locationName} - ${event.address}</p>
                <p class="event-info"><i class="fas fa-dollar-sign"></i> ${event.price > 0 ? `C$ ${event.price}` : 'Gratis'}</p>
                
                <h2>Descripción del Evento</h2>
                <p>${event.description}</p>
            </div>
        </article>
    `;
}
