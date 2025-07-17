import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const adminUid = "KmDTHeR4qLSyaUpvPJ3YTxjTZXJ2";
let currentUser = null;
let currentPymeData = null;
let pymeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    pymeId = params.get('id');
    const pymeDetailContainer = document.getElementById('pyme-detail-container');

    if (!pymeId) {
        pymeDetailContainer.innerHTML = '<p>No se ha especificado un ID de Pyme.</p>';
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        await loadPymeDetails();
    });

    pymeDetailContainer.addEventListener('click', handleContainerClick);
});

async function loadPymeDetails() {
    const pymeDetailContainer = document.getElementById('pyme-detail-container');
    try {
        const pymeRef = doc(db, 'pymes', pymeId);
        const docSnap = await getDoc(pymeRef);

        if (docSnap.exists()) {
            currentPymeData = docSnap.data();
            renderPymeDetails(currentPymeData);
        } else {
            pymeDetailContainer.innerHTML = '<p>La Pyme que buscas no existe o ha sido eliminada.</p>';
        }
    } catch (error) {
        console.error("Error al obtener los detalles de la Pyme:", error);
        pymeDetailContainer.innerHTML = '<p>Hubo un error al cargar los detalles de la Pyme.</p>';
    }
}

function renderPymeDetails(pyme) {
    const pymeDetailContainer = document.getElementById('pyme-detail-container');
    const isAdmin = currentUser && currentUser.uid === adminUid;

    pymeDetailContainer.innerHTML = `
        <article class="pyme-full-detail">
            ${isAdmin ? '<button id="edit-pyme-btn" class="btn btn-primary">Editar Pyme</button>' : ''}
            <img src="${pyme.logoUrl || 'logo.png'}" alt="Logo de ${pyme.name}" class="pyme-detail-image">
            <div class="pyme-detail-content">
                <span class="category-tag ${pyme.category}">${pyme.category}</span>
                <h1>${pyme.name}</h1>
                <p class="pyme-info"><i class="fas fa-map-marker-alt"></i> ${pyme.address}</p>
                <p class="pyme-info"><i class="fas fa-phone"></i> ${pyme.phone || 'No disponible'}</p>
                <p class="pyme-info"><i class="fas fa-envelope"></i> ${pyme.email || 'No disponible'}</p>
                
                <h2>Sobre Nosotros</h2>
                <p>${pyme.description.replace(/
/g, '<br>')}</p>
            </div>
        </article>
    `;
}

function renderEditForm(pyme) {
    const pymeDetailContainer = document.getElementById('pyme-detail-container');
    pymeDetailContainer.innerHTML = `
        <form id="edit-pyme-form" class="form-container" style="max-width: 900px; margin: auto;">
            <h1>Editando Pyme</h1>
            <div class="form-group">
                <label for="pyme-name">Nombre del Negocio</label>
                <input type="text" id="pyme-name" value="${pyme.name}" required>
            </div>
            <div class="form-group">
                <label for="pyme-description">Descripción</label>
                <textarea id="pyme-description" rows="5" required>${pyme.description}</textarea>
            </div>
            <div class="form-group">
                <label for="pyme-category">Categoría</label>
                <select id="pyme-category" required>
                    <option value="restaurante" ${pyme.category === 'restaurante' ? 'selected' : ''}>Restaurante/Comida</option>
                    <option value="artesania" ${pyme.category === 'artesania' ? 'selected' : ''}>Artesanía</option>
                    <option value="servicios" ${pyme.category === 'servicios' ? 'selected' : ''}>Servicios</option>
                    <option value="tienda" ${pyme.category === 'tienda' ? 'selected' : ''}>Tienda</option>
                    <option value="turismo-pyme" ${pyme.category === 'turismo-pyme' ? 'selected' : ''}>Turismo</option>
                    <option value="salud-belleza" ${pyme.category === 'salud-belleza' ? 'selected' : ''}>Salud y Belleza</option>
                    <option value="educacion" ${pyme.category === 'educacion' ? 'selected' : ''}>Educación</option>
                    <option value="otros" ${pyme.category === 'otros' ? 'selected' : ''}>Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label for="pyme-address">Dirección</label>
                <input type="text" id="pyme-address" value="${pyme.address}" required>
            </div>
            <div class="form-group">
                <label for="pyme-phone">Teléfono</label>
                <input type="tel" id="pyme-phone" value="${pyme.phone || ''}">
            </div>
            <div class="form-group">
                <label for="pyme-email">Email</label>
                <input type="email" id="pyme-email" value="${pyme.email || ''}">
            </div>
            <div class="form-group">
                <label for="pyme-logo">Enlace al Logo</label>
                <input type="url" id="pyme-logo" value="${pyme.logoUrl || ''}">
            </div>
            <div class="form-actions">
                <button type="submit" id="save-pyme-btn" class="btn btn-primary">Guardar Cambios</button>
                <button type="button" id="cancel-edit-btn" class="btn btn-secondary">Cancelar</button>
            </div>
        </form>
    `;
}

async function handleContainerClick(e) {
    if (e.target.id === 'edit-pyme-btn') {
        renderEditForm(currentPymeData);
    }

    if (e.target.id === 'cancel-edit-btn') {
        renderPymeDetails(currentPymeData);
    }

    if (e.target.id === 'save-pyme-btn') {
        e.preventDefault();
        
        const updatedData = {
            name: document.getElementById('pyme-name').value,
            description: document.getElementById('pyme-description').value,
            category: document.getElementById('pyme-category').value,
            address: document.getElementById('pyme-address').value,
            phone: document.getElementById('pyme-phone').value,
            email: document.getElementById('pyme-email').value,
            logoUrl: document.getElementById('pyme-logo').value,
        };

        try {
            const pymeRef = doc(db, 'pymes', pymeId);
            await updateDoc(pymeRef, updatedData);
            alert('¡Pyme actualizada correctamente!');
            await loadPymeDetails();
        } catch (error) {
            console.error("Error al actualizar la Pyme:", error);
            alert('Hubo un error al actualizar la Pyme.');
        }
    }
}
