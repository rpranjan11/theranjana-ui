import React, { createContext, useContext, useState, useEffect } from "react";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, query, orderByChild, equalTo, onValue } from "firebase/database";

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
export const storage = getStorage(firebaseApp);
const database = getDatabase(firebaseApp);
export const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseProvider = (props) => {

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


    const getUserData = async (callback) => {
        const userRef = ref(database, `users`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getUsersBio = async (callback) => {
        const userRef = ref(database, `bio`);
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getProjects = async (callback) => {
        const projectRef = ref(database, `projects`);
        onValue(projectRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getExperiences = async (callback) => {
        const experienceRef = ref(database, `experiences`);
        onValue(experienceRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getCertifications = async (callback) => {
        const certificationRef = ref(database, `certifications`);
        onValue(certificationRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    const getVideos = async (callback) => {
        const paperRef = ref(database, `videos`);
        onValue(paperRef, (snapshot) => {
            const data = snapshot.val();
            callback(data);
        });
    }

    return (
        <FirebaseContext.Provider
            value={{
                getVideos,
                getDataOnce,
                getUserData,
                getProjects,
                getExperiences,
                getCertifications,
                getUsersBio,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};
