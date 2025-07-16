import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
    const pymeDetailContainer = document.getElementById('pyme-detail-container');
    
    // Get pyme ID from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const pymeId = params.get('id');

    if (!pymeId) {
        pymeDetailContainer.innerHTML = '<p>No se ha especificado un ID de pyme.</p>';
        return;
    }

    try {
        const pymeRef = doc(db, 'pymes', pymeId);
        const docSnap = await getDoc(pymeRef);

        if (docSnap.exists()) {
            const pyme = docSnap.data();
            renderPymeDetails(pyme);
        } else {
            pymeDetailContainer.innerHTML = '<p>La pyme que buscas no existe o ha sido eliminada.</p>';
        }
    } catch (error) {
        console.error("Error al obtener los detalles de la pyme:", error);
        pymeDetailContainer.innerHTML = '<p>Hubo un error al cargar los detalles de la pyme. Por favor, intenta de nuevo.</p>';
    }
});

function renderPymeDetails(pyme) {
    const pymeDetailContainer = document.getElementById('pyme-detail-container');
    
    pymeDetailContainer.innerHTML = `
        <article class="pyme-full-detail">
            <img src="${pyme.logoUrl || 'logo.png'}" alt="Logo de ${pyme.name}" class="pyme-detail-image">
            <div class="pyme-detail-content">
                <span class="category-tag ${pyme.category}">${pyme.category}</span>
                <h1>${pyme.name}</h1>
                <p class="pyme-info"><i class="fas fa-map-marker-alt"></i> ${pyme.address}</p>
                <p class="pyme-info"><i class="fas fa-phone"></i> ${pyme.phone || 'No disponible'}</p>
                <p class="pyme-info"><i class="fas fa-envelope"></i> ${pyme.email || 'No disponible'}</p>
                
                <h2>Sobre Nosotros</h2>
                <p>${pyme.description}</p>
            </div>
        </article>
    `;
}
