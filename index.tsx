/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Firebase SDKs ---
// These will be loaded dynamically after DOM content is loaded

// --- Firebase Configuration ---
// Actual Firebase project configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCrsS4hEGPSy9vYQK7JCIBzw0Md3VkH-uQ",
  authDomain: "el-pointnica.firebaseapp.com",
  projectId: "el-pointnica",
  storageBucket: "el-pointnica.appspot.com", // Corrected to use the standard .appspot.com domain
  messagingSenderId: "668872948763",
  appId: "1:668872948763:web:6c7fd1fdd78c82d4484cbe",
  measurementId: "G-CGG0MSKRCG"
};

// --- Global Firebase instances (initialized later) ---
let firebaseApp: any = null; // Using 'any' for simplicity with compat library
let firebaseAuth: any = null;
let firestore: any = null; // Will be used later
let analytics: any = null; // For Firebase Analytics

// --- Function to load Firebase SDKs ---
function loadFirebaseSDKs(callback: () => void) {
    const scripts = [
        "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js",
        "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js",
        "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js", // For later use
        "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics-compat.js" // For Firebase Analytics
    ];
    let loadedScripts = 0;

    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            loadedScripts++;
            if (loadedScripts === scripts.length) {
                console.log("Firebase SDKs loaded.");
                // Initialize Firebase now that SDKs are available
                try {
                    // @ts-ignore
                    firebaseApp = window.firebase.initializeApp(firebaseConfig);
                    console.log("Firebase app object initialized:", firebaseApp);

                    // Get services from the initialized app instance
                    if (firebaseApp) {
                        // @ts-ignore
                        firebaseAuth = firebaseApp.auth(); // Get auth from app instance
                        // @ts-ignore
                        firestore = firebaseApp.firestore(); // Get firestore from app instance
                        // @ts-ignore
                        analytics = firebaseApp.analytics(); // Get analytics from app instance
                    } else {
                        console.error("firebaseApp object is null or undefined after initialization.");
                    }
                    

                    if (firebaseApp && firebaseAuth && typeof firebaseAuth.onAuthStateChanged === 'function') {
                        console.log("Firebase initialized successfully with Auth and Analytics.");
                        callback(); // Proceed with Firebase-dependent logic
                    } else {
                        console.error("Firebase SDKs loaded but core initialization (app/auth) failed.", { app: firebaseApp, auth: firebaseAuth });
                        if(firebaseApp && (!firebaseAuth || typeof firebaseAuth.onAuthStateChanged !== 'function')) {
                            console.error("firebaseAuth object seems invalid or onAuthStateChanged is missing:", firebaseAuth);
                        }
                    }
                } catch (e) {
                    console.error("Error during Firebase initialization:", e);
                     // @ts-ignore
                    console.error("State of window.firebase at time of error:", window.firebase);
                }
            }
        };
        script.onerror = () => {
            console.error(`Failed to load Firebase SDK: ${src}`);
            loadedScripts++; 
             if (loadedScripts === scripts.length) {
                console.error("One or more Firebase SDKs failed to load. Initialization aborted.");
             }
        };
        document.head.appendChild(script);
    });
}


// --- Firebase Authentication Functions ---
async function signInWithGoogle() {
    if (!firebaseAuth || typeof firebaseAuth.GoogleAuthProvider !== 'function') {
        console.error("Firebase Auth or GoogleAuthProvider not initialized properly.");
        alert("Error de autenticación. Intenta de nuevo más tarde.");
        return;
    }
    // @ts-ignore
    const provider = new firebaseAuth.GoogleAuthProvider();
    try {
        // @ts-ignore
        await firebaseAuth.signInWithPopup(provider);
        // onAuthStateChanged will handle UI updates
        console.log("Signed in with Google successfully.");
        // Redirect to homepage or dashboard after successful login
        window.location.href = 'index.html'; 
    } catch (error: any) {
        console.error("Error during Google Sign-In:", error);
        alert(`Error al iniciar sesión con Google: ${error.message}`);
    }
}

async function signOutUser() {
    if (!firebaseAuth) {
        console.error("Firebase Auth not initialized.");
        return;
    }
    try {
        await firebaseAuth.signOut();
        // onAuthStateChanged will handle UI updates
        console.log("User signed out.");
         window.location.href = 'index.html'; // Refresh or go to home
    } catch (error: any) {
        console.error("Error signing out:", error);
        alert(`Error al cerrar sesión: ${error.message}`);
    }
}

// --- UI Update Functions ---
function updateAuthUI(user: any) { // user can be firebase.User or null
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) return;

    authButtonsContainer.innerHTML = ''; // Clear existing buttons

    if (user) {
        // User is signed in
        const displayName = user.displayName || 'Usuario';
        const userDisplay = document.createElement('span');
        userDisplay.classList.add('user-display-name');
        userDisplay.textContent = `Hola, ${displayName}`;

        const logoutButton = document.createElement('button');
        logoutButton.classList.add('btn', 'btn-logout');
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.addEventListener('click', signOutUser);

        authButtonsContainer.appendChild(userDisplay);
        authButtonsContainer.appendChild(logoutButton);
    } else {
        // User is signed out
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.classList.add('btn', 'btn-secondary');
        loginLink.textContent = 'Iniciar Sesión';

        const registerLink = document.createElement('a');
        registerLink.href = 'register.html';
        registerLink.classList.add('btn', 'btn-primary');
        registerLink.textContent = 'Registrarse';

        authButtonsContainer.appendChild(loginLink);
        authButtonsContainer.appendChild(registerLink);
    }
    // Re-apply active class highlighting for new buttons if any
    updateActiveNavLinks();
}


// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("ElPointNica script starting...");

    loadFirebaseSDKs(() => {
        // This callback runs after Firebase is initialized
        if (firebaseAuth && typeof firebaseAuth.onAuthStateChanged === 'function') {
            firebaseAuth.onAuthStateChanged((user: any) => {
                updateAuthUI(user);
                // If on login/register page and user gets signed in, redirect
                const currentPage = window.location.pathname.split('/').pop();
                if (user && (currentPage === 'login.html' || currentPage === 'register.html')) {
                    // window.location.href = 'index.html'; // Or user dashboard
                }
            });
        } else {
            console.error("Firebase Auth is not available or onAuthStateChanged is not a function after SDK load and init.");
            // Display fallback UI or error message for auth buttons
            updateAuthUI(null); 
        }

        // Setup Google Sign-In buttons if they exist on the current page
        const googleSignInBtnLogin = document.getElementById('google-signin-btn-login');
        if (googleSignInBtnLogin) {
            googleSignInBtnLogin.addEventListener('click', signInWithGoogle);
        }
        const googleSignInBtnRegister = document.getElementById('google-signin-btn-register');
        if (googleSignInBtnRegister) {
            googleSignInBtnRegister.addEventListener('click', signInWithGoogle);
        }
    });

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', (!isExpanded).toString());
            
            let mobileMenuContainer = document.querySelector<HTMLElement>('.mobile-menu-container');
            if (!isExpanded) {
                if (!mobileMenuContainer) {
                    mobileMenuContainer = document.createElement('div');
                    mobileMenuContainer.classList.add('mobile-menu-container');
                    
                    const clonedNav = mainNav.cloneNode(true) as HTMLElement;
                    
                    const currentAuthButtons = document.querySelector('.auth-buttons');
                    let clonedAuth: HTMLElement | null = null;
                    if (currentAuthButtons) {
                        clonedAuth = currentAuthButtons.cloneNode(true) as HTMLElement;
                        const logoutBtnInMobile = clonedAuth.querySelector('.btn-logout');
                        if (logoutBtnInMobile) {
                            logoutBtnInMobile.addEventListener('click', signOutUser);
                        }
                        // Ensure Google Sign In buttons in mobile menu also work if they exist
                        const googleSignInBtnLoginMobile = clonedAuth.querySelector('#google-signin-btn-login');
                        if (googleSignInBtnLoginMobile) {
                             googleSignInBtnLoginMobile.addEventListener('click', signInWithGoogle);
                        }
                        const googleSignInBtnRegisterMobile = clonedAuth.querySelector('#google-signin-btn-register');
                        if (googleSignInBtnRegisterMobile) {
                            googleSignInBtnRegisterMobile.addEventListener('click', signInWithGoogle);
                        }
                    }
                    
                    mobileMenuContainer.appendChild(clonedNav);
                    if (clonedAuth) {
                        const userDisplayNameElement = clonedAuth.querySelector<HTMLElement>('.user-display-name');
                        if (userDisplayNameElement) {
                            const mobileUserDisplay = document.createElement('div');
                            mobileUserDisplay.classList.add('user-display-name');
                            mobileUserDisplay.textContent = userDisplayNameElement.textContent;
                            mobileMenuContainer.appendChild(mobileUserDisplay);
                        }
                        mobileMenuContainer.appendChild(clonedAuth);
                    }
                    
                    mobileMenuContainer.style.position = 'absolute';
                    const headerElement = document.querySelector<HTMLElement>('.main-header');
                    if (headerElement) {
                        mobileMenuContainer.style.top = headerElement.clientHeight + 'px';
                    } else {
                        mobileMenuContainer.style.top = '0px';
                    }
                    
                    mobileMenuContainer.style.left = '0';
                    mobileMenuContainer.style.width = '100%';
                    mobileMenuContainer.style.backgroundColor = 'var(--primary-color)';
                    mobileMenuContainer.style.padding = '1em';
                    mobileMenuContainer.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

                    clonedNav.style.display = 'block';
                    (clonedNav.querySelector('ul') as HTMLElement).style.flexDirection = 'column';
                    (clonedNav.querySelector('ul') as HTMLElement).style.alignItems = 'center';
                     Array.from(clonedNav.querySelectorAll('li')).forEach(li => (li as HTMLElement).style.margin = '0.5em 0');

                    if (clonedAuth) {
                        clonedAuth.style.display = 'flex';
                        clonedAuth.style.flexDirection = 'column';
                        clonedAuth.style.marginTop = '1em';
                        Array.from(clonedAuth.querySelectorAll<HTMLElement>('.btn, .btn-logout, .btn-google')).forEach(btn => {
                            btn.style.margin = '0.5em 0';
                            btn.style.width = '100%';
                        });
                        const clonedAuthUserDisplay = clonedAuth.querySelector<HTMLElement>('.user-display-name');
                        if(clonedAuthUserDisplay) clonedAuthUserDisplay.style.display = 'none';
                    }

                    if (headerElement) {
                        headerElement.insertAdjacentElement('afterend', mobileMenuContainer);
                    } else {
                        document.body.insertAdjacentElement('afterbegin', mobileMenuContainer); 
                        console.warn("Main header not found for mobile menu insertion.");
                    }
                }
                if (mobileMenuContainer) { 
                    mobileMenuContainer.style.display = 'flex';
                    mobileMenuContainer.style.flexDirection = 'column';
                    mobileMenuContainer.style.alignItems = 'center';
                }
            } else {
                if (mobileMenuContainer) {
                    mobileMenuContainer.style.display = 'none';
                }
            }
        });
    }

    // Favorite button interaction
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.toggle('far'); // outlined
                icon.classList.toggle('fas'); // solid
                if (icon.classList.contains('fas')) {
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.setAttribute('aria-pressed', 'false');
                }
            }
        });
    });

    // Active navigation link highlighting (initial call after UI might be set by auth)
    updateActiveNavLinks();
});

function updateActiveNavLinks() {
    const navLinks = document.querySelectorAll('.main-nav a, .auth-buttons a.btn, .auth-buttons button.btn-logout');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkElement = link as HTMLAnchorElement | HTMLButtonElement; // Can be <a> or <button>
        
        let linkPath: string | undefined;
        if (linkElement.tagName === 'A') {
            linkPath = (linkElement as HTMLAnchorElement).href.split('/').pop();
        } else if (linkElement.classList.contains('btn-logout')) {
            // Logout button doesn't have a path, so skip 'active' state for it
            linkElement.classList.remove('active');
            return;
        }

        if (linkPath === currentPath) {
            linkElement.classList.add('active');
        } else {
            linkElement.classList.remove('active');
        }
    });
}
