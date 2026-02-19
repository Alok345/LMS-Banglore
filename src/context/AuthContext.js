"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Try to get initial state from localStorage to avoid flicker
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("lms_user");
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                const userDocRef = doc(db, "users", firebaseUser.uid);

                const unsubDoc = onSnapshot(userDocRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setUserData(data);
                        // Save to local storage for persistence
                        localStorage.setItem("lms_user", JSON.stringify(data));
                    }
                    setLoading(false);
                });

                return () => unsubDoc();
            } else {
                setUser(null);
                setUserData(null);
                localStorage.removeItem("lms_user");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUserProfile = {
            name,
            email,
            uid: firebaseUser.uid,
            userType: "employee",
            leaveAmount: 15,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", firebaseUser.uid), newUserProfile);

        // Instant update to local storage
        setUserData(newUserProfile);
        localStorage.setItem("lms_user", JSON.stringify(newUserProfile));

        return userCredential;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setUserData(null);
        localStorage.removeItem("lms_user");
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
