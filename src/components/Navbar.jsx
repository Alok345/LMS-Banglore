"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navbar() {
    const { user, userData, logout } = useAuth();

    return (
        <nav className="glass-card" style={{
            margin: '1rem',
            padding: '1rem 2rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <h2 style={{ margin: 0, background: 'linear-gradient(to right, #5c67f2, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    LMS Pro
                </h2>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', color: '#a0a6b5', fontSize: '0.9rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link href="/" style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>

                        {userData?.userType === "admin" && (
                            <Link href="/admin" style={{ cursor: 'pointer', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                                Admin Panel
                            </Link>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'white', fontWeight: 500 }}>{userData?.name || "User"}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{userData?.userType || "Employee"}</div>
                            </div>
                            <button
                                onClick={logout}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/login" style={{ color: '#a0a6b5', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                            Login
                        </Link>
                        <Link href="/signup" style={{ color: 'white', textDecoration: 'none', background: 'var(--primary)', padding: '0.5rem 1.2rem', borderRadius: '8px' }}>
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
