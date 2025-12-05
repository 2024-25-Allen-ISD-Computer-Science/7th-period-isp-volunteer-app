# HelpHive

### Overview  
HelpHive is a React Native app that lets students log community service hours and gives teachers tools to review and verify them. The goal is to replace x2VOL, a platform many students and teachers have found frustrating due to technical issues and its unintuitive UI.

This project includes:
- A web and mobile app for students and teachers built with React Native and Expo
- A small Node/Express backend for email verification and Google Places proxy
- Firebase for authentication and cloud functions

***

### Features

- **Student experience**
  - Sign up and sign in with email and password  
  - Optional Google sign-in  
  - Browse communities and opportunities  
  - Log hours for specific opportunities and communities  
  - View logged hours history  
  - See opportunities on a calendar and map  
  - Set up and edit a profile  

- **Teacher experience**
  - Teacher home dashboard  
  - Create and edit communities  
  - Create and manage service opportunities  
  - View and verify student hours  
  - View student profiles  
  - See total hours and progress for each community  

***

### Project Structure
```
.
├── App.js
├── index.js
├── auth.js
├── Components
│   ├── AuthScreen.js
│   ├── EmailSignUpScreen.js
│   ├── EmailSignInScreen.js
│   ├── ProfileSetup.js
│   ├── ProfileScreen.js
│   ├── StudentHomePage.js
│   ├── MobileStudentHomePage.js
│   ├── CommunitiesPage.js
│   ├── OpportunitiesPage.js
│   ├── LogHoursScreen.js
│   ├── ViewLoggedHoursScreen.js
│   ├── StudentMap.js
│   ├── StudentOpportunitiesCalendar.js
│   ├── CommunityProgressScreen.js
│   └── Teachers
│       ├── TeacherHomePage.js
│       ├── TeacherManagePage.js
│       ├── ManageCommunities.js
│       ├── CreateOpportunities.js
│       ├── ManageOpportunitiesPage.js
│       ├── VerifyHoursPage.js
│       └── StudentProfileScreen.js
├── verification-backend
│   └── server.js
├── functions
│   └── (Firebase Cloud Functions source and config)
├── app.json
├── firebase.json
└── babel.config.js
```

***

### Setup Instructions

1. **Clone the repository**
   - `git clone https://github.com/2024-25-Allen-ISD-Computer-Science/7th-period-isp-volunteer-app.git`  
   - `cd 7th-period-isp-volunteer-app`

2. **Install app dependencies (frontend)**
   - From the project root: `npm install`

3. **Install Firebase Functions dependencies**
   - `cd functions`  
   - `npm install`

4. **Install verification backend dependencies**
   - `cd ../verification-backend`  
   - `npm install`

5. **Configure environment variables**
   - In `verification-backend`, create a `.env` file with values like:  
     `MAP_API_KEY=your_google_maps_api_key`  
     `EMAIL_API_KEY=your_email_api_key`
   - In the app, add your Firebase config in a `firebaseConfig` file and import it wherever Firebase is used.

***

### Running the App

1. **Start the Expo app**
   - From the project root: `npm start`

2. **Start the verification backend**
   - `cd verification-backend`  
   - `node server.js`

3. **(Optional) run Firebase emulators**
   - `cd functions`  
   - `npm run serve`

4. **Deploy Firebase Functions (when ready)**
   - `cd functions`  
   - `npm run deploy`

***
