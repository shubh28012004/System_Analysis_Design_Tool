Advanced Structural Analysis and Design Tool

Overview

This tool provides Finite Element Method (FEM) analysis and structural design capabilities for 2D and 3D meshes. Users can define and design 3D meshes using Three.js, perform 2D FEM simulations with Scikit-FEM, and visualize the results through a web-based interactive interface.

Features
	•	3D Mesh Definition – Users can define and design a mesh interactively using Three.js.
	•	2D FEM Analysis – Uses Scikit-FEM for numerical simulation and structural analysis.
	•	FastAPI Backend – Handles FEM computations, geometry processing, and API calls.
	•	REST API Integration – Facilitates seamless communication between frontend and backend.
	•	Google Login – Secure authentication using Google OAuth.
	•	Web-Based Deployment – Hosted on Vercel for easy accessibility.
	•	FAQ and How-To-Use Guide – Provides user assistance and troubleshooting.
	•	Footer Section – Improves navigation across the website.

Tech Stack

Frontend:
	•	Three.js – 3D mesh modeling and visualization
	•	React.js – User interface development
	•	Vercel – Deployment

Backend:
	•	Scikit-FEM – 2D FEM analysis
	•	FastAPI – API development
	•	REST API – Backend communication
	•	ngrok – Exposing backend APIs

Authentication:
	•	Google OAuth – Secure login

Installation and Setup

1. Clone the Repository

git clone <repository-url>
cd <repository-folder>

2. Set Up a Virtual Environment

python -m venv .venv
source .venv/bin/activate  # For Mac/Linux
.venv\Scripts\activate      # For Windows

3. Install Dependencies

pip install -r requirements.txt

4. Start the Backend (FastAPI Server)

Run the FastAPI server locally:

uvicorn main:app --reload

Expose the backend using ngrok:

ngrok http 8000

Copy the generated public URL and use it in the frontend.

5. Start the Frontend

Navigate to the frontend directory:

cd frontend
npm install
npm run dev

Usage
	1.	Login with Google – Secure authentication to access the platform.
	2.	Define Mesh – Use the web interface to create a 3D mesh using Three.js.
	3.	Perform FEM Analysis – The backend processes 2D FEM simulations with Scikit-FEM.
	4.	Visualize Results – View results in an interactive graphical interface.
	5.	Use Help Resources – The FAQ page and How-To-Use Guide provide support.

API Endpoints (FastAPI Backend via ngrok)

Method	Endpoint	Description
POST	/upload-mesh/	Uploads the mesh for processing
GET	/analyze-fem/	Runs FEM analysis on the uploaded mesh
GET	/get-results/	Fetches the simulation results
POST	/login/	Google OAuth authentication

Deployment

Frontend Deployment (Vercel)
	1.	Push the frontend code to GitHub.
	2.	Link the repository with Vercel.
	3.	Deploy directly from Vercel Dashboard.

Backend Deployment

The backend is exposed using ngrok, ensuring accessibility without manual server hosting.

To start ngrok automatically on system boot, use:

ngrok http 8000 --region=<preferred-region>

Future Improvements
	•	Extend FEM analysis to 3D models
	•	Implement real-time structural optimization
	•	Support additional export formats for FEM results

License

This project is licensed under the MIT License. See the LICENSE file for details.
