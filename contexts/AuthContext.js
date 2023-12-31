import React, { createContext, useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword as updateFirebasePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { FIREBASE_APP } from '../config/FireBase';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import { EXPO_APP_ID, EXPO_APP_TOKEN } from '@env';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const auth = getAuth(FIREBASE_APP);
  const database = getDatabase(FIREBASE_APP);

 const updatePassword = async (currentPassword, newPassword) => {
   if (user) {
     // Create a credential
     const credential = EmailAuthProvider.credential(
       user.email,
       currentPassword
     );
 
     // Reauthenticate the user
     return reauthenticateWithCredential(user, credential)
       .then(() => {
         // User reauthenticated
         // Now we can update the password
         return updateFirebasePassword(user, newPassword)
           .then(() => {
             setError(null);
           })
           .catch((error) => {
             // An error occurred
             setError(error.message);
             throw error;
           });
       })
       .catch((error) => {
         // The reauthentication failed
         setError('Current password is incorrect.');
         throw error;
       });
   }
 };

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
        updatePassword,
        error,
        setError,
        notificationsEnabled,
        setNotificationsEnabled,
        login: async (email, password) => {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUser(user);
            setError(null);
            // Native Notify Indie ID registration
            registerIndieID(user.uid, EXPO_APP_ID, EXPO_APP_TOKEN);
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
            // Native Notify Indie ID registration
            registerIndieID(user.uid, EXPO_APP_ID, EXPO_APP_TOKEN);
          } catch (e) {
            setError(e.message);
            console.error(e);
          }
        },
        logout: async () => {
          try {
            // Native Notify Indie Push Registration Code
            unregisterIndieDevice(user.uid, EXPO_APP_ID, EXPO_APP_TOKEN);
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