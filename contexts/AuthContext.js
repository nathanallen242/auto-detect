import React, { createContext, useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { FIREBASE_APP } from '../config/FireBase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [error, setError] = useState(null);
 const auth = getAuth(FIREBASE_APP);
 const database = getDatabase(FIREBASE_APP);

 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (user) => {
     if (user) {
       setUser(user);
     } else {
       setUser(null);
     }
   });

   return () => unsubscribe();
 }, []);

 return (
   <AuthContext.Provider
     value={{
       user,
       setUser,
       error,
       setError,
       login: async (email, password) => {
         try {
           await signInWithEmailAndPassword(auth, email, password);
           setUser(user);
           setError(null);
         } catch (e) {
           setError(e.message);
           console.error(e);
         }
       },
       register: async (email, password) => {
         try {
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           const user = userCredential.user;
           await set(ref(database, 'users/' + user.uid), {
             email: email,
             uid: user.uid
           });
           setUser(user);
           setError(null);
         } catch (e) {
           setError(e.message);
           console.error(e);
         }
       },
       logout: async () => {
         try {
           await signOut(auth);
           setUser(null);
         } catch (e) {
           console.error(e);
         }
       },
     }}
   >
     {children}
   </AuthContext.Provider>
 );
};
