import React, { createContext, useContext, useState, useEffect } from "react";

import { getStorage } from "firebase/storage";

import {
    getAuth,
    onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    child,
    get,
    query,
    orderByChild,
    equalTo,
    onValue,
} from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

const database = getDatabase(firebaseApp);

export const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {

    const [isUserLoggedIn, setIsUserLoggedIn] = useState("")

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user0) => {
            if (user0) {
                const uid = user0.uid;
                localStorage.setItem('mySpaceUid', uid)
                setIsUserLoggedIn(true)
            } else {
                setIsUserLoggedIn(false)
            }
        });
    }, []);

    // In userContext.js
    const getDataOnce = async (email) => {
        try {
            const data = query(
                child(ref(database), "users"),
                orderByChild("email"),
                equalTo(email)
            );
            const snapshot = await get(data);
            let ans = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    ans.push(childSnapshot.val());
                });
                return ans;
            }
            return []; // Return empty array if no data exists
        } catch (error) {
            if (error.code === 'PERMISSION_DENIED') {
                console.error("Permission denied:", error);
                throw new Error("You don't have permission to access this data");
            } else if (error.code === 'NETWORK_ERROR') {
                console.error("Network error:", error);
                throw new Error("Please check your internet connection");
            } else {
                console.error("Error fetching data:", error);
                throw new Error("An unexpected error occurred");
            }
        }
    };


    const getUserData = async (key, callback) => {
        const userRef = ref(database, `users/${key}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getUsersBio = async (key, callback) => {
        const userRef = ref(database, `bio/${key}`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getPapers = async (key, callback) => {
        const paperRef = ref(database, `papers/${key}`);
        onValue(paperRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getPresentations = async (key, callback) => {
        const presentationRef = ref(database, `presentations/${key}`);
        onValue(presentationRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getVideos = async (key, callback) => {
        const paperRef = ref(database, `videos/${key}`);
        onValue(paperRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }
    // getVideos("cS8oudEyTJYa7XpYdZHCNZte63n2", (data) => { console.log("data") })

    return (
        <FirebaseContext.Provider
            value={{
                getVideos,
                getDataOnce,
                getUserData,
                getPapers,
                getPresentations,
                getUsersBio,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};
