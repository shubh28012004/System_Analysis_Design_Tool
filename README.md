# Advanced Structural Analysis and Design Tool

## Overview
The **Advanced Structural Analysis and Design Tool** is a web-based platform that integrates **Finite Element Method (FEM) analysis** and **structural design capabilities** for **2D and 3D meshes**. Users can **define and design 3D meshes** using **Three.js**, perform **2D FEM simulations** with **Scikit-FEM**, and visualize the results through an **interactive web interface**.

## Features
- **3D Mesh Definition** – Interactive mesh modeling with **Three.js**.
- **2D FEM Analysis** – Numerical simulation and structural analysis using **Scikit-FEM**.
- **FastAPI Backend** – Manages FEM computations, geometry processing, and API calls.
- **REST API Integration** – Ensures seamless communication between the frontend and backend.
- **Google Authentication** – Secure login via **Google OAuth**.
- **Web-Based Deployment** – Hosted on **Vercel** for easy access.
- **Comprehensive User Support** – Includes an **FAQ section** and a **How-To-Use Guide**.
- **Footer Navigation** – Enhances user experience with structured navigation.

## Tech Stack
### **Frontend:**
- **Three.js** – 3D mesh modeling and visualization.
- **React.js** – User interface development.
- **Vercel** – Hosting and deployment.

### **Backend:**
- **Scikit-FEM** – 2D FEM analysis.
- **FastAPI** – API development.
- **REST API** – Backend communication.
- **ngrok** – Exposes backend APIs for remote access.

### **Authentication:**
-  Secure authentication mechanism.

## Installation and Setup
### **1. Clone the Repository**
```bash
git clone <repository-url>
cd <repository-folder>
```

### **2. Set Up a Virtual Environment**
```bash
python -m venv .venv
source .venv/bin/activate  # For Mac/Linux
.venv\Scripts\activate    # For Windows
```

### **3. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4. Start the Backend (FastAPI Server)**
Run the FastAPI server locally:
```bash
uvicorn main:app --reload
```
Expose the backend using **ngrok**:
```bash
ngrok http 8000
```
Copy the generated public URL and configure it in the frontend.

### **5. Start the Frontend**
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

## Usage
1. **Login with Google** – Secure authentication to access the platform.
2. **Define Mesh** – Create a **3D mesh** interactively using **Three.js**.
3. **Perform FEM Analysis** – Run **2D FEM simulations** via the backend.
4. **Visualize Results** – View **analysis results** in an interactive graphical interface.
5. **Access Support** – Use the **FAQ section** and **How-To-Use Guide** for assistance.

## API Endpoints (FastAPI Backend via ngrok)
| Method | Endpoint         | Description                          |
|--------|-----------------|--------------------------------------|
| **POST** | `/upload-mesh/` | Uploads the mesh for processing    |
| **GET**  | `/analyze-fem/` | Runs FEM analysis on the mesh      |
| **GET**  | `/get-results/` | Retrieves FEM simulation results   |
| **POST** | `/login/`      | Google OAuth authentication        |

## Deployment
### **Frontend Deployment (Vercel)**
1. Push the frontend code to GitHub.
2. Link the repository with **Vercel**.
3. Deploy directly from the **Vercel Dashboard**.

### **Backend Deployment**
The backend is exposed using **ngrok**, allowing remote access without manual server hosting.
To start **ngrok** automatically on system boot, use:
```bash
ngrok http 8000 --region=<preferred-region>
```

## Future Improvements
- Extend **FEM analysis** to **3D models**.
- Implement **real-time structural optimization**.
- Support additional **export formats** for FEM results.



