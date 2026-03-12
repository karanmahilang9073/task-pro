# Email Configuration Fix - Change Summary

## Problem
Email sending was failing with error: `connect ECONNREFUSED ::1:587`. The application was trying to connect to localhost instead of Gmail's SMTP server due to environment variables not being loaded when the email transporter was initialized.

---

## Root Cause
ES module imports are hoisted, causing the email transporter to be created **before** `dotenv.config()` was called. This resulted in all environment variables being `undefined` at initialization time.

---

## Files Changed

### 1. **backend/config/email.js**
**Change:** Converted from eager to lazy initialization

**Before:**
```javascript
const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST,        // undefined at import time!
    port : parseInt(process.env.EMAIL_PORT),
    secure : false,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD
    }
})
export default transporter
```

**After:**
```javascript
let transporter = null

export const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,      // Loaded when first called
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        console.log('Email transporter initialized with host:', process.env.EMAIL_HOST)
    }
    return transporter
}

export default getTransporter
```

**Reason:** Transporter is now created on first use after env vars are loaded.

---

### 2. **backend/services/emailService.js**
**Change:** Updated to call lazy-initialized transporter

**Before:**
```javascript
import transporter from "../config/email.js"

export const sendEmail = async(to, subject, html) => {
    const info = await transporter.sendMail({...})
```

**After:**
```javascript
import { getTransporter } from "../config/email.js"

export const sendEmail = async(to, subject, html) => {
    try {
       const transporter = getTransporter()
       const info = await transporter.sendMail({...})
       console.log('email sent', info.messageId)
       return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('failed to send email:', error)
        throw new Error(`Email sending failed: ${error.message}`)
    }
}
```

**Reason:** Calls `getTransporter()` to ensure initialization happens after env vars are ready.

---

### 3. **backend/server.js**
**Changes:** 
- Moved `dotenv.config()` to the top before any other imports
- Added test email endpoint (optional)

**Before:**
```javascript
import express from 'express'
// ... other imports ...
import dotenv from 'dotenv'

dotenv.config()  // Called too late!
```

**After:**
```javascript
import dotenv from 'dotenv'
dotenv.config()  // Called first!

import express from 'express'
// ... other imports ...

// Optional: Test endpoint
app.get('/test-email', async (req, res) => {
    try {
        const result = await sendEmail('karanmahilang05@gmail.com', 'Test Email', '<h1>Hello!</h1>')
        res.json({ success: true, message: 'Email sent successfully', result })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})
```

**Reason:** Ensures environment variables are loaded before any module that depends on them.

---

### 4. **backend/controllers/taskController.js**
**Changes:** Added error handling around email calls

**Functions Modified:**
- `createTask()` - Lines 27-40
- `updateTask()` - Lines 100-116

**Pattern Applied:**
```javascript
if(task.assignedTo){
    const user = await User.findById(task.assignedTo)
    if(user && user.email){
        const emailHTML = taskAssignmentTemplate(...)
        try {
            await sendEmail(user.email, 'subject', emailHTML)
        } catch (emailError) {
            console.error('Email notification failed:', emailError.message)
            // Task proceeds even if email fails
        }
        // Continue with other operations...
    }
}
```

**Reason:** Prevents email failures from blocking task creation/updates. User gets notified via in-app notifications even if email fails.

---

### 5. **backend/utils/deadlineReminder.js**
**Change:** Added error handling around email call

**Location:** Lines 18-28 in the deadline check loop

**Pattern Applied:**
```javascript
try {
    await sendEmail(userEmail, 'task deadline reminder', deadlineReminderTemplate(...))
} catch (emailError) {
    console.error('Failed to send deadline reminder email:', emailError.message)
    // Continue processing other reminders
}
```

**Reason:** Ensures one failed email doesn't stop the entire reminder job from processing other users.

---

## Testing
Email sending was verified with a direct test:
- ✅ Environment variables loaded correctly
- ✅ Transporter connected to `smtp.gmail.com:587`
- ✅ Email sent successfully
- ✅ Message ID received

---

## How It Works Now

1. **Server starts** → `dotenv.config()` runs first
2. **Routes import** → modules load but don't initialize transporter yet
3. **First email send** → `getTransporter()` is called
4. **Transporter created** → Uses loaded environment variables
5. **Email sent** → Connects to Gmail SMTP successfully

---

## Summary of Fixes
| File | Issue | Solution |
|------|-------|----------|
| email.js | Undefined env vars | Lazy initialization with getTransporter() |
| emailService.js | Using undefined transporter | Updated to call getTransporter() |
| server.js | dotenv late load | Moved to top before imports |
| taskController.js | Email failure crashes task | Added try-catch blocks |
| deadlineReminder.js | Email failure stops job | Added try-catch block |

---

## Result
✅ Email system is now fully functional and robust against failures
