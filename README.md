# VYC (Verify Your Customer) Platform

## Overview

**VYC** is a state-of-the-art KYC (Know Your Customer) verification platform that ensures user authenticity through advanced image verification technology. Our platform is designed to offer a seamless and secure identity verification experience for users and organizations alike.

## Features

### 1. **Liveness Detection**
   Ensure the live image is genuine with checks for blinking, head movement, and other behaviors to prevent photo-based spoofing.

### 2. **Document Upload**
   Securely upload ID documents for facial verification. Supported document types include:
   - Driving License
   - Passport
   - PAN Card

### 3. **AI-Generated Image Detection**
   Identify and flag AI-generated images to ensure only genuine photos are verified. Protect user identity with cutting-edge AI detection technology.

### 4. **Flexible Image Formats**
   Accepts multiple image formats (JPEG, PNG, etc.), ensuring accurate facial recognition despite variations in lighting, angles, or accessories (e.g., hats or glasses).

## User Interface

### Welcome Screen
The platform offers a welcoming and user-friendly interface. Users can sign up, log in, and initiate their identity verification journey through intuitive navigation.

![Welcome to KYC Verification Platform](https://github.com/coderiders22/Data-Mavericks/blob/e65495a5a8957769406cf5b265e466e4c52056a4/home.png)

### Feature Highlights
Here are some of the advanced features that make **VYC** a comprehensive KYC platform:

![Our Features](https://github.com/coderiders22/Data-Mavericks/blob/c78c02e125f0bc3f505d95b2939adb7ed0a5427f/features.png)

## Developer Team

### Meet Our Developers
Our dedicated team is responsible for building and enhancing the VYC Verification Platform.

- **Manav Rai**: Frontend Developer & Model Integration
- **Aryan**: Backend Developer
- **Raghav Asija**: Live Image Capture and Liveness Detection
- **Aviral Sharma**: Image Verification & Database Comparison
- **Chetanya Mahana**: Image Verification & Database Comparison

![Developer Team](https://github.com/coderiders22/Data-Mavericks/blob/0fd9dacb8fd2a878aa3c192e251e63b45ea6ed66/developer.png)

## Login and Signup Pages

### **Signup Page**
New users can create an account by providing basic information such as their full name, email address, password, and uploading a profile photo. The signup page includes real-time validation to ensure the correctness of data.

- **Signup Features**:
  - Input fields for full name, email, password, and confirmation.
  - Real-time validation to prevent errors.
  - Secure password storage with encryption.

![Signup Page](https://github.com/coderiders22/Data-Mavericks/blob/0fd9dacb8fd2a878aa3c192e251e63b45ea6ed66/signup.png)

### **Login Page**
The login page provides a simple and secure interface for users to access their accounts. Users must input their registered email and password to log in to the platform.

- **Login Features**:
  - Simple, user-friendly design.
  - Error handling for incorrect logins.
  - Password reset option.

![Login Page](https://github.com/coderiders22/Data-Mavericks/blob/0fd9dacb8fd2a878aa3c192e251e63b45ea6ed66/login.png)

## Dashboard

### **Dashboard Overview**
After logging in, users are directed to the dashboard where they can initiate or continue the KYC verification process. The dashboard also provides quick access to user account information, recent activity, and verification status.

![Dashboard Page](https://github.com/coderiders22/Data-Mavericks/blob/0fd9dacb8fd2a878aa3c192e251e63b45ea6ed66/dashboard.png)

## Document Upload and Capture Image

### **Capture Live Image**
Users can capture a live image using their device camera, ensuring they are present during the verification process. This feature ensures real-time verification and helps in detecting spoofing attempts.

### **Document Upload**
Users can upload their ID document (e.g., Passport, Driving License) for facial verification. Additionally, they can upload a second image for database comparison.



## Workflow Overview

1. **Capture Live Image**: The platform takes a live picture of the user to ensure they are physically present during the verification process.
2. **Upload Documents**: Users upload their ID document (e.g., Passport, Driving License) for facial verification and a second image for database comparison.
3. **Verification Process**:
   - Compare the live image with the face on the ID document.
   - Check the second image against a database to find similar images and return similarity scores.

## Documentation and Flowcharts
> You may check the documentation to know more about the problem, approaches, and see flowcharts.

## Project Links

- **Presentation**: [PPT](https://www.canva.com/design/DAGSGaAgzSs/0s_d8Uuawz2QKxEsNWhjVQ/edit?utm_content=DAGSGaAgzSs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- **Video Demo**: [Google Drive Video](insert_video_link_here)

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python (Flask/FastAPI, Streamlit)
- **Vector Database**: Pinecone for similarity search
- **Facial Recognition**: DeepFace, FaceNet, VGGFace
- **Liveness Detection**: OpenCV, Dlib, TensorFlow
- **Storage**: Amazon S3, Google Cloud Storage

## Backend Setup
backend/
├── app.py               # Flask application file
├── requirements.txt     # Python dependencies file
└── uploads/             # Folder for storing uploaded images (optional)
run python app.py


## Conclusion
In conclusion, **VYC** offers a secure, scalable, and efficient solution for KYC verification. It is equipped with advanced features for facial recognition, liveness detection, and AI-generated image detection, ensuring user authenticity and privacy.

---

### How to Use Verify Your Customer



This README now includes all the relevant pages, including Signup, Dashboard, Developer Team, and Document Upload/Capture Image.
