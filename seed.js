
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrsS4hEGPSy9vYQK7JCIBzw0Md3VkH-uQ",
  authDomain: "el-pointnica.firebaseapp.com",
  projectId: "el-pointnica",
  storageBucket: "el-pointnica.appspot.com",
  messagingSenderId: "668872948763",
  appId: "1:668872948763:web:6c7fd1fdd78c82d4484cbe",
  measurementId: "G-CGG0MSKRCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const events = [
  {
    title: "Concierto Acústico en el Lago",
    description: "Disfruta de una noche mágica con música en vivo a la orilla del lago.",
    category: "musica",
    date: "2024-09-15T20:00:00",
    locationName: "Puerto Salvador Allende, Managua",
    address: "Managua",
    price: 300,
    imageUrl: "https://images.unsplash.com/photo-1524368535-096e19a78287?w=800",
    approved: true,
    creatorId: "system"
  },
  {
    title: "Feria de Artesanías y Gastronomía",
    description: "Apoya el talento local y disfruta de la comida nicaragüense.",
    category: "ferias",
    date: "2024-10-05T10:00:00",
    locationName: "Parque Nacional de Ferias, Managua",
    address: "Managua",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1582221862532-6b3a4a1a5a78?w=800",
    approved: true,
    creatorId: "system"
  },
  {
    title: "Noche de Cine al Aire Libre",
    description: "Proyección de películas clásicas bajo las estrellas.",
    category: "arte",
    date: "2024-09-28T19:00:00",
    locationName: "Antiguo Estadio Nacional, Managua",
    address: "Managua",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    approved: false,
    creatorId: "system"
  }
];

const pymes = [
  {
    name: "Café de las Sonrisas",
    description: "Un café que apoya a personas con discapacidad auditiva. ¡El mejor café de Granada!",
    category: "restaurante",
    address: "Calle La Calzada, Granada",
    phone: "+505 8888 7777",
    email: "info@cafedelassonrisas.com",
    logoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    approved: true,
    creatorId: "system"
  },
  {
    name: "Taller de Cerámica 'El Torito'",
    description: "Aprende a crear tus propias piezas de cerámica con artesanos locales.",
    category: "artesania",
    address: "San Juan de Oriente, Masaya",
    phone: "+505 8765 4321",
    email: "eltorito@ceramica.com",
    logoUrl: "https://images.unsplash.com/photo-1558961363-fa8fdfc9db3b?w=800",
    approved: true,
    creatorId: "system"
  },
    {
    name: "Vivero 'El Paraíso Verde'",
    description: "Encuentra una gran variedad de plantas ornamentales y frutales para tu hogar.",
    category: "tienda",
    address: "Km 14 Carretera a Masaya, Managua",
    phone: "+505 2279 9999",
    email: "ventas@paraisoverde.com",
    logoUrl: "https://images.unsplash.com/photo-1585320806232-a793a3c13a36?w=800",
    approved: false,
    creatorId: "system"
  }
];

const seedCollection = async (collectionName, data) => {
  const collectionRef = collection(db, collectionName);
  console.log(`Seeding ${collectionName}...`);
  for (const item of data) {
    try {
      await addDoc(collectionRef, item);
      console.log(`Added ${item.title || item.name}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log(`${collectionName} seeding complete.`);
};

const seedDatabase = async () => {
    console.log("Starting database seeding...");
    await seedCollection('events', events);
    await seedCollection('pymes', pymes);
    console.log("Database seeding finished.");
}

seedDatabase();
