"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    getDoc,
    orderBy,
    increment
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
    const { user, userData, loading: authLoading } = useAuth();
    const router = useRouter();

    const [allRequests, setAllRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("requests");
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        remarks: ""
    });

    useEffect(() => {
        if (authLoading) return;
        if (!user || userData?.userType !== "admin") {
            router.push("/");
            return;
        }

        // 1. Fetch all Leave Requests
        const reqQuery = query(collection(db, "requests"), orderBy("submissionDate", "desc"));
        const unsubscribeReq = onSnapshot(reqQuery, (snapshot) => {
            setAllRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        // 2. Fetch all Users
        const usersQuery = query(collection(db, "users"));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeReq();
            unsubscribeUsers();
        };
    }, [user, userData, authLoading, router]);

    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        if (isNaN(s) || isNaN(e)) return 0;
        const diffTime = Math.abs(e - s);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        const days = calculateDays(formData.startDate, formData.endDate);

        if (days <= 0) {
            alert("Please select valid dates.");
            return;
        }

        try {
            await addDoc(collection(db, "requests"), {
                employeeName: userData?.name || "Admin",
                employeeEmail: user.email,
                employeeId: user.uid,
                startDate: formData.startDate,
                endDate: formData.endDate,
                daysRequested: days,
                managerRemarks: formData.remarks,
                status: "Approved", // Admins are auto-approved for their own leaves
                submissionDate: new Date()
            });

            // Also deduct balance immediately for admin
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                leaveAmount: increment(-days)
            });

            alert("Leave applied and auto-approved!");
            setFormData({ startDate: "", endDate: "", remarks: "" });
            setActiveTab("requests");
        } catch (error) {
            console.error("Error applying leave:", error);
            alert("Failed to apply leave.");
        }
    };

    const handleAction = async (request, status) => {
        try {
            // 1. Update request status
            await updateDoc(doc(db, "requests", request.id), { status });

            // 2. If approved, deduct from user's balance in 'users' collection
            if (status === "Approved") {
                const userRef = doc(db, "users", request.employeeId);

                // Use increment(-days) to safely deduct
                await updateDoc(userRef, {
                    leaveAmount: increment(-request.daysRequested)
                });
            }

            alert(`Request ${status} successfully!`);
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error processing action. Check console.");
        }
    };

    if (authLoading || loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading Admin Workspace...</div>;

    return (
        <main className="container animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Administration</p>
                    <h1 style={{ margin: 0 }}>Zoho Creator LMS</h1>
                </div>

                <div className="glass-card" style={{ display: 'flex', gap: '0.3rem', padding: '0.4rem' }}>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={activeTab === "requests" ? "btn-primary" : ""}
                        style={{ border: 'none', fontSize: '0.85rem', background: activeTab === "requests" ? 'var(--primary)' : 'transparent', color: 'white', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab("apply")}
                        className={activeTab === "apply" ? "btn-primary" : ""}
                        style={{ border: 'none', fontSize: '0.85rem', background: activeTab === "apply" ? 'var(--primary)' : 'transparent', color: 'white', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Apply Leave
                    </button>
                    <button
                        onClick={() => setActiveTab("employees")}
                        className={activeTab === "employees" ? "btn-primary" : ""}
                        style={{ border: 'none', fontSize: '0.85rem', background: activeTab === "employees" ? 'var(--primary)' : 'transparent', color: 'white', padding: '0.5rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        Directory
                    </button>
                </div>
            </header>

            {/* Metrics Dashboard */}
            <div className="grid-3" style={{ marginBottom: '2rem' }}>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Requests</p>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{allRequests.length}</h2>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending Approvals</p>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{allRequests.filter(r => r.status === "Pending").length}</h2>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Registered Employees</p>
                    <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{users.length}</h2>
                </div>
            </div>

            {activeTab === "requests" ? (
                <section className="glass-card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: 0 }}>Pending Approvals</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Employee</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Dates</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Days</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Remarks</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Status</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allRequests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row-hover">
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{req.employeeName}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{req.employeeEmail}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{req.startDate}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>to {req.endDate}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                {req.daysRequested}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                                            {req.managerRemarks || "—"}
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <span className={`status-badge status-${req.status.toLowerCase()}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            {req.status === "Pending" && (
                                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                                    <button
                                                        onClick={() => handleAction(req, "Approved")}
                                                        style={{ background: '#2ed573', border: 'none', color: 'black', fontWeight: 'bold', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    >Approve</button>
                                                    <button
                                                        onClick={() => handleAction(req, "Rejected")}
                                                        style={{ background: '#ff4757', border: 'none', color: 'white', fontWeight: 'bold', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    >Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {allRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No leave requests in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : activeTab === "apply" ? (
                <section className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Apply for Your Leave</h3>
                    <form onSubmit={handleApplyLeave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    required
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>End Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    required
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Remarks</label>
                            <textarea
                                className="input-field"
                                style={{ minHeight: '100px' }}
                                placeholder="Reason for leave..."
                                value={formData.remarks}
                                onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                            ></textarea>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Calculation:</span>
                            <span style={{ fontWeight: 'bold' }}>{calculateDays(formData.startDate, formData.endDate)} Days</span>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Confirm & Approve Leave
                        </button>
                    </form>
                </section>
            ) : (
                <section className="glass-card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: 0 }}>Employee Directory</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Name</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Contact</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Location</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Leave Amount</th>
                                    <th style={{ padding: '1.2rem 1.5rem' }}>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{u.name}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>UID: {u.uid}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{u.email}</div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{u.phone}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{u.city}, {u.country}</div>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: (u.leaveAmount || 15) < 5 ? '#ff4757' : '#2ed573' }}>
                                                {u.leaveAmount ?? 15}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.7rem',
                                                background: u.userType === 'admin' ? 'rgba(92, 103, 242, 0.2)' : 'rgba(255,255,255,0.05)',
                                                color: u.userType === 'admin' ? '#5c67f2' : 'white',
                                                border: u.userType === 'admin' ? '1px solid #5c67f2' : '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {u.userType?.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            <style jsx>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>
        </main>
    );
}
