// auth-ui-manager.js
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const adminUid = "KmDTHeR4qLSyaUpvPJ3YTxjTZXJ2";

document.addEventListener('DOMContentLoaded', () => {
    const authButtonsContainer = document.querySelector('.auth-buttons');

    if (authButtonsContainer) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const isAdmin = user.uid === adminUid;
                let userDisplay = '<span>Mi Perfil</span>';
                if (isAdmin) {
                    userDisplay = '<span class="admin-tag">Admin</span>';
                }

                authButtonsContainer.innerHTML = `
                    ${userDisplay}
                    <a href="#" id="logout-btn" class="btn btn-secondary">Cerrar Sesión</a>
                `;

                const logoutBtn = document.getElementById('logout-btn');
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await signOut(auth);
                    window.location.href = 'index.html';
                });

            } else {
                authButtonsContainer.innerHTML = `
                    <a href="login.html" class="btn btn-secondary">Iniciar Sesión</a>
                    <a href="register.html" class="btn btn-primary">Registrarse</a>
                `;
            }
        });
    }
});
