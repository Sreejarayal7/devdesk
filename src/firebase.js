import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyC6tNIbAFlnRaYoTaJ_xgzrTcy_yO0CFKc",
  authDomain: "devdesk-50244.firebaseapp.com",
  projectId: "devdesk-50244",
  storageBucket: "devdesk-50244.firebasestorage.app",
  messagingSenderId: "862488851170",
  appId: "1:862488851170:web:75393ee7c62931f005e4bb"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)
export const logOut = () => signOut(auth)