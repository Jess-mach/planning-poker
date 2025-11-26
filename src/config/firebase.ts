import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
// IMPORTANTE: Substitua estas credenciais pelas suas do Firebase Console
const firebaseConfig = {
  // A API Key para seu projeto. Esta é gerada automaticamente quando você cria um app web.
  // Você a encontrará no Firebase Console, em Project settings > Your apps > Selecione seu app web > Config.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI", // Exemplo: AIzaSyBnRKitQGBX0u8k4COtDTILYxCJuMf7xzE
  
  // Seu domínio de autenticação, baseado no seu Project ID.
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "plannig-pokt.firebaseapp.com",
  
  // O URL do seu Realtime Database.
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://plannig-pokt-default-rtdb.firebaseio.com",
  
  // O ID do seu projeto Firebase.
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "plannig-pokt",
  
  // O bucket de armazenamento padrão para seu projeto.
  // Geralmente é o seu Project ID com ".appspot.com" ou ".firebasestorage.app".
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "plannig-pokt.firebasestorage.app",
  
  // O ID do remetente para mensagens (usado pelo Firebase Cloud Messaging). É o Project Number.
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "516631768044",
  
  // O App ID exclusivo para seu aplicativo web específico dentro do projeto.
  // Você o encontrará no Firebase Console, em Project settings > Your apps > Selecione seu app web > Config.
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "SEU_APP_ID_AQUI" // Exemplo: 1:875614679042:web:5813c3e70a33e91ba0371b
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obter referência do Realtime Database
export const database = getDatabase(app);

export default app;

