"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, onSnapshot, updateDoc, doc, where, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    managerRemarks: ""
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch Leave Requests for current user
    const reqQuery = query(
      collection(db, "requests"),
      where("employeeEmail", "==", user.email),
      orderBy("submissionDate", "desc")
    );

    const unsubscribeReq = onSnapshot(reqQuery, (snapshot) => {
      const reqList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(reqList);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribeReq();
  }, [user, authLoading, router]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e)) return 0;
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const daysRequested = calculateDays(formData.startDate, formData.endDate);

    if (daysRequested <= 0) {
      alert("Please select valid dates.");
      return;
    }

    // Pre-submission check (Balance check)
    const currentBalance = userData?.leaveAmount || 0;
    if (daysRequested > currentBalance) {
      alert(`Insufficient Balance. You requested ${daysRequested} days but only have ${currentBalance} left.`);
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        employeeName: userData?.name || user.displayName || "Unknown",
        employeeEmail: user.email,
        employeeId: user.uid,
        startDate: formData.startDate,
        endDate: formData.endDate,
        daysRequested: daysRequested,
        managerRemarks: formData.managerRemarks,
        status: "Pending",
        submissionDate: new Date()
      });

      setFormData({ startDate: "", endDate: "", managerRemarks: "" });
      alert("Leave request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Check console for details.");
    }
  };

  if (authLoading || loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading Workspace...</div>;

  const leaveAmount = userData?.leaveAmount !== undefined ? userData.leaveAmount : 15;

  return (
    <main className="container animate-fade-in">

      <div className="grid-3">
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back,</p>
          <h2 style={{ margin: '0.5rem 0' }}>{userData?.name || user?.displayName}</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{user?.email}</p>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Available Balance</p>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{leaveAmount}</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Days Remaining</p>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Requests</p>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>
            {requests.filter(r => r.status === "Pending").length}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>Pending Approval</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginTop: '2rem' }}>
        {/* Leave Request Form */}
        <section className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Apply for Leave</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Start Date</label>
              <input
                type="date"
                className="input-field"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>End Date</label>
              <input
                type="date"
                className="input-field"
                required
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Manager Remarks (Optional)</label>
              <textarea
                className="input-field"
                style={{ minHeight: '80px', resize: 'vertical' }}
                value={formData.managerRemarks}
                onChange={e => setFormData({ ...formData, managerRemarks: e.target.value })}
              ></textarea>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Days Requested: <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {calculateDays(formData.startDate, formData.endDate)}
                </span>
              </p>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Submit Request
            </button>
          </form>
        </section>

        {/* Status Tracker */}
        <section className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Your Requests</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Dates</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Days</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 500 }}>{req.startDate}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>to {req.endDate}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{req.daysRequested}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span className={`status-badge status-${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main >
  );
}
