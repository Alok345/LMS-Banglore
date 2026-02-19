# LMS Logic & Implementation Guide

This document explains the core business logic of the Leave Management System, particularly focusing on the workflows that simulate Zoho Creator's Deluge scripts.

## 1. The "On Submission" Logic (Deluge Script Equivalent)
In a standard Zoho Creator app, you would use an `On Success` script in the Form. 
In this app, the logic is handled in `src/app/page.jsx` inside the `handleSubmit` function:

- **Constraint Check**: Before saving to Firestore, the system queries the `userData` (cached via Context/LocalStorage).
- **Validation**: If `daysRequested > userData.leaveAmount`, the submission is blocked.
- **Initialization**: Every new request is hardcoded with a `status: "Pending"` to initiate the approval workflow.

## 2. The "On Approval" Logic (Workflow Update)
The most critical part of the system is the deduction of leave days. This happens in the `AdminPanel` (`src/app/admin/page.jsx`) within the `handleAction` function.

### How it works:
When an advisor/admin clicks **"Approve"**:
1. **Target User Identification**: The script extracts the `employeeId` from the request document.
2. **Atomic Update**: It uses Firestore's `increment` function to safely deduct the `daysRequested` from the user's `leaveAmount` field in the `users` collection.
```javascript
// The "Deluge-like" logic for approval
if (status === "Approved") {
    const userRef = doc(db, "users", request.employeeId);
    await updateDoc(userRef, {
        leaveAmount: increment(-request.daysRequested)
    });
}
```
3. **Status Sync**: The request status itself is updated to "Approved", which instantly reflects on the employee's dashboard via the `onSnapshot` listener.

## 3. Metrics Dashboard
The Admin Panel features a real-time summary dashboard that calculates:
- **Total Requests**: Complete count of all records in the system.
- **Pending Approvals**: Filtered count of active tasks requiring attention.
- **Registered Employees**: Total count of distinct users in the system.

## 4. Delivery Instructions
1. **Source Code**: Provide the link to your GitHub repository.
2. **Live Demo**: Deploy to Vercel/Netlify for a working URL.
3. **Walkthrough**: Record your screen using Loom or OBS. 
   - Show the **Signup** of a new employee.
   - Show the **Dashboard** starting with 15 days.
   - Show the **Submission** of a 3-day leave request.
   - Login as Admin (`alok.ad2click@gmail.com`), show the **Admin Dashboard**, and **Approve** the request.
   - Switch back to the employee to show the balance reduced to 12.
