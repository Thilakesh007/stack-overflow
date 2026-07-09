stackoverflow
Stack Overflow Clone is a MERN-based Q&A platform with authentication, multilingual support, subscriptions, reward points, friend requests, OTP verification, login history, browser/device detection, IP tracking, and secure access controls for an enhanced user experience.

Stack Overflow Clone with Advanced Security & Social Features
📌 Project Description
This project is a full-stack Stack Overflow-inspired Question & Answer platform developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js). It allows users to ask questions, answer queries, interact socially, earn reward points, and subscribe to premium plans.

In addition to the basic Stack Overflow functionalities, the project includes several advanced security, authentication, multilingual, and social networking features.

🚀 Features
👤 User Authentication
User Registration
User Login
JWT Authentication
Password Encryption using bcrypt
Forgot Password
One-time password reset per day
🌐 Multilingual Support
English
Hindi
Spanish
Portuguese
Chinese
French
Language Verification
French language change requires Email OTP verification.
Other languages require Mobile OTP verification (or simulated OTP if SMS service is unavailable).
❓ Question & Answer System
Ask Questions
Answer Questions
Edit Questions
Delete Questions
Vote Questions
Vote Answers
Search Questions
👥 Social Features
User Profiles
Friend Requests
Accept Friend Requests
Friends List
Social Feed
🏆 Reward Points System
Users earn reward points.
Reward points can be transferred to other registered users.
Minimum reward points required for transfer.
Reward balance displayed on profile.
💳 Subscription Plans
Free
Bronze
Silver
Gold
🔐 Advanced Login Security
Browser Detection
The system detects:

Google Chrome
Microsoft Edge
Firefox
Other Browsers
Chrome Login
Requires Email OTP Verification before login.
Microsoft Edge Login
Direct login without OTP.
Mobile Login Restriction
Users logging in from mobile devices are allowed access only between:

10:00 AM
1:00 PM
Outside this period login is denied.

📜 Login History
Every login stores:

Browser Name
Operating System
Device Type
IP Address
Login Date & Time
Users can view their login history from their profile.

📧 Email Services
Implemented using Nodemailer.

Used for:

Login OTP
Language Change OTP
Password Reset
🛠 Technology Stack
Frontend
React.js
Next.js
TypeScript
Tailwind CSS
Shadcn UI
Axios
React Router
React Toastify
i18next
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
Nodemailer
ua-parser-js
Database
MongoDB

📂 Project Structure
client/
│
├── components/
├── pages/
├── layout/
├── lib/
├── hooks/
└── public/

server/
│
├── controller/
├── models/
├── routes/
├── middleware/
├── config/
└── index.js
Installation
Install Frontend
cd client
npm install
Install Backend
cd server
npm install
Environment Variables
Create a .env file inside the server folder.

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password
Run Backend
npm run dev
Run Frontend
npm run dev
Future Improvements
Google OAuth Login
Real SMS OTP Integration
Push Notifications
Video Calling
AI Question Recommendation
Admin Dashboard
Dark Mode
Two-Factor Authentication
Security Features
JWT Authentication
Password Hashing
Email OTP Verification
Browser Detection
Device Detection
Login History
Mobile Login Time Restriction
IP Tracking
