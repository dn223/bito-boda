import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config pública del cliente (no es secreta: viaja en el bundle).
// Lo que protege los datos son las reglas de Firestore.
const firebaseConfig = {
  apiKey: 'AIzaSyAkM0hkgqhpPpox2wGCTpFQyen37zRsVh8',
  authDomain: 'boda-byc.firebaseapp.com',
  projectId: 'boda-byc',
  storageBucket: 'boda-byc.firebasestorage.app',
  messagingSenderId: '83830428661',
  appId: '1:83830428661:web:0449cb6ce94fd547e486bc',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const FAMILIES = 'families'
