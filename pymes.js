// pymes.js
import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const pymesGrid = document.querySelector('.card-grid');
    const adminUid = "KmDTHeR4qLSyaUpvPJ3YTxjTZXJ2";
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        loadPymes();
    });

    async function loadPymes() {
        if(!pymesGrid) return;
        pymesGrid.innerHTML = '';
        const pymesRef = collection(db, "pymes");
        const isAdmin = currentUser && currentUser.uid === adminUid;

        let q;
        if (isAdmin) {
            // Admin sees all pymes
            q = query(pymesRef);
        } else {
            // Regular users only see approved pymes
            q = query(pymesRef, where("approved", "==", true));
        }

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            pymesGrid.innerHTML = '<p>No se encontraron Pymes.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const pyme = doc.data();
            const pymeId = doc.id;
            const pymeCard = document.createElement('div');
            pymeCard.classList.add('event-card');
            if (!pyme.approved) {
                pymeCard.classList.add('pending-approval');
            }

            let adminButtons = '';
            if (isAdmin) {
                adminButtons = `
                    <div class="admin-actions">
                        ${!pyme.approved ? `<button class="btn btn-approve" data-id="${pymeId}">Aprobar</button>` : ''}
                        <button class="btn btn-delete" data-id="${pymeId}">Eliminar</button>
                    </div>
                `;
            }

            pymeCard.innerHTML = `
                <div class="card-image-placeholder">
                     ${pyme.logoUrl ? `<img src="${pyme.logoUrl}" alt="${pyme.name}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
                    <span class="category-tag ${pyme.category}">${pyme.category}</span>
                </div>
                <div class="card-content">
                    <h3>${pyme.name}</h3>
                    <p class="card-info"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${pyme.address}</p>
                    <p class="card-info"><i class="fas fa-phone" aria-hidden="true"></i> ${pyme.phone}</p>
                    <p class="card-info"><i class="fas fa-envelope" aria-hidden="true"></i> ${pyme.email}</p>
                    ${adminButtons}
                </div>
            `;
            pymesGrid.appendChild(pymeCard);
        });
    }

    pymesGrid.addEventListener('click', async (e) => {
        const target = e.target;
        const pymeId = target.dataset.id;
        if (!pymeId) return;

        if (target.classList.contains('btn-approve')) {
            await updateDoc(doc(db, "pymes", pymeId), { approved: true });
            loadPymes();
        } else if (target.classList.contains('btn-delete')) {
            if (confirm('¿Estás seguro de que quieres eliminar este negocio?')) {
                await deleteDoc(doc(db, "pymes", pymeId));
                loadPymes();
            }
        }
    });
});
