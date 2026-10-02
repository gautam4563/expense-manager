import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCSgCeBjOneYAsWirysIPdoNyzxXdeSkTA',
  authDomain: 'expense-manager-2da99.firebaseapp.com',
  projectId: 'expense-manager-2da99',
  storageBucket: 'expense-manager-2da99.firebasestorage.app',
  messagingSenderId: '606269469410',
  appId: '1:606269469410:web:f75ad436c5df698a2964bb',
  measurementId: 'G-XJLVCK6LRW',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)