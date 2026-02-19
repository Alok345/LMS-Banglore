# LMS Pro - Implementation Details

## 1. Data Structure (Firebase Firestore)
- **Employees Collection**: Stores the master record for each employee (`name`, `email`, `leaveBalance`).
- **Requests Collection**: Stores the leave applications (`employeeEmail`, `startDate`, `endDate`, `daysRequested`, `status`, `managerRemarks`).

## 2. Core Logic (Emulating Deluge)

### Pre-Submission Check
In the `handleSubmit` function in `page.jsx`, I implemented the following logic:
```javascript
const daysRequested = calculateDays(formData.startDate, formData.endDate);

// Block submission if status is insufficient
if (daysRequested > employee.leaveBalance) {
  alert("⚠️ Insufficient Balance...");
  return; 
}
```
This mirrors the Deluge pre-submission requirement.

### Approval Deductions
In the `handleAction` function (Manager side simulated), the system performs the following on approval:
```javascript
if (status === "Approved") {
  const empRef = doc(db, "employees", request.employeeId);
  await updateDoc(empRef, {
    leaveBalance: employee.leaveBalance - request.daysRequested
  });
}
```
This ensures strict data integrity between the Leave Request and the Master Employee Balance.

## 3. Real-time Synchronization
Used the `onSnapshot` listener from Firebase to ensure the dashboard reflects changes immediately without page refreshes, providing a smooth user experience.

## 4. UI/UX
- **Premium Design**: Used Glassmorphism principles with `backdrop-filter` and `Outfit` font.
- **Micro-animations**: Implemented simple CSS fade-ins.
- **Responsiveness**: Grid-based layouts ensure it looks good on all devices.
