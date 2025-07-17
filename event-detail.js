import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const adminUid = "KmDTHeR4qLSyaUpvPJ3YTxjTZXJ2";
let currentUser = null;
let currentEventData = null;
let eventId = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    eventId = params.get('id');
    const eventDetailContainer = document.getElementById('event-detail-container');

    if (!eventId) {
        eventDetailContainer.innerHTML = '<p>No se ha especificado un ID de evento.</p>';
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        await loadEventDetails();
    });

    // Event listener for clicks on the container
    eventDetailContainer.addEventListener('click', handleContainerClick);
});

async function loadEventDetails() {
    const eventDetailContainer = document.getElementById('event-detail-container');
    try {
        const eventRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventRef);

        if (docSnap.exists()) {
            currentEventData = docSnap.data();
            renderEventDetails(currentEventData);
        } else {
            eventDetailContainer.innerHTML = '<p>El evento que buscas no existe o ha sido eliminado.</p>';
        }
    } catch (error) {
        console.error("Error al obtener los detalles del evento:", error);
        eventDetailContainer.innerHTML = '<p>Hubo un error al cargar los detalles del evento.</p>';
    }
}

function renderEventDetails(event) {
    const eventDetailContainer = document.getElementById('event-detail-container');
    const isAdmin = currentUser && currentUser.uid === adminUid;

    const formattedDate = new Date(event.date).toLocaleDateString('es-NI', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    eventDetailContainer.innerHTML = `
        <article class="event-full-detail">
            ${isAdmin ? '<button id="edit-event-btn" class="btn btn-primary">Editar Evento</button>' : ''}
            <img src="${event.imageUrl || 'logo.png'}" alt="Imagen de ${event.title}" class="event-detail-image">
            <div class="event-detail-content">
                <span class="category-tag ${event.category}">${event.category}</span>
                <h1>${event.title}</h1>
                <p class="event-info"><i class="fas fa-calendar-alt"></i> ${formattedDate}</p>
                <p class="event-info"><i class="fas fa-map-marker-alt"></i> ${event.locationName} - ${event.address}</p>
                <p class="event-info"><i class="fas fa-dollar-sign"></i> ${event.price > 0 ? `C$ ${event.price}` : 'Gratis'}</p>
                
                <h2>Descripción del Evento</h2>
                <p>${event.description.replace(/
/g, '<br>')}</p>
            </div>
        </article>
    `;
}

function renderEditForm(event) {
    const eventDetailContainer = document.getElementById('event-detail-container');
    
    // Format date for datetime-local input
    const dateForInput = new Date(event.date).toISOString().slice(0, 16);

    eventDetailContainer.innerHTML = `
        <form id="edit-event-form" class="form-container" style="max-width: 900px; margin: auto;">
            <h1>Editando Evento</h1>
            <div class="form-group">
                <label for="event-title">Título del Evento</label>
                <input type="text" id="event-title" value="${event.title}" required>
            </div>
            <div class="form-group">
                <label for="event-description">Descripción</label>
                <textarea id="event-description" rows="5" required>${event.description}</textarea>
            </div>
            <div class="form-group">
                <label for="event-category">Categoría</label>
                <select id="event-category" required>
                    <option value="musica" ${event.category === 'musica' ? 'selected' : ''}>Música</option>
                    <option value="gastronomia" ${event.category === 'gastronomia' ? 'selected' : ''}>Gastronomía</option>
                    <option value="arte" ${event.category === 'arte' ? 'selected' : ''}>Arte</option>
                    <option value="deportes" ${event.category === 'deportes' ? 'selected' : ''}>Deportes</option>
                    <option value="turismo" ${event.category === 'turismo' ? 'selected' : ''}>Turismo</option>
                    <option value="talleres" ${event.category === 'talleres' ? 'selected' : ''}>Talleres</option>
                    <option value="ferias" ${event.category === 'ferias' ? 'selected' : ''}>Ferias</option>
                    <option value="otros" ${event.category === 'otros' ? 'selected' : ''}>Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label for="event-date">Fecha y Hora</label>
                <input type="datetime-local" id="event-date" value="${dateForInput}" required>
            </div>
            <div class="form-group">
                <label for="event-location-name">Nombre del Lugar</label>
                <input type="text" id="event-location-name" value="${event.locationName}" required>
            </div>
            <div class="form-group">
                <label for="event-address">Dirección</label>
                <input type="text" id="event-address" value="${event.address}" required>
            </div>
            <div class="form-group">
                <label for="event-price">Precio (C$)</label>
                <input type="number" id="event-price" value="${event.price}">
            </div>
            <div class="form-group">
                <label for="event-image">Enlace a la Imagen</label>
                <input type="url" id="event-image" value="${event.imageUrl || ''}">
            </div>
            <div class="form-actions">
                <button type="submit" id="save-event-btn" class="btn btn-primary">Guardar Cambios</button>
                <button type="button" id="cancel-edit-btn" class="btn btn-secondary">Cancelar</button>
            </div>
        </form>
    `;
}

async function handleContainerClick(e) {
    if (e.target.id === 'edit-event-btn') {
        renderEditForm(currentEventData);
    }

    if (e.target.id === 'cancel-edit-btn') {
        renderEventDetails(currentEventData);
    }

    if (e.target.id === 'save-event-btn') {
        e.preventDefault();
        
        const updatedData = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            category: document.getElementById('event-category').value,
            date: document.getElementById('event-date').value,
            locationName: document.getElementById('event-location-name').value,
            address: document.getElementById('event-address').value,
            price: Number(document.getElementById('event-price').value) || 0,
            imageUrl: document.getElementById('event-image').value,
        };

        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, updatedData);
            alert('¡Evento actualizado correctamente!');
            await loadEventDetails(); // Reload and render the updated details
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            alert('Hubo un error al actualizar el evento.');
        }
    }
}
