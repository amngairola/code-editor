# Real-Time Collaborative Code Editor

**Live Application:** [**https://collabb.vercel.app/**](https://collabb.vercel.app/)

A web-based, real-time collaborative code editor that allows multiple users to write, edit, and view code changes simultaneously in a shared virtual room. This application leverages a modern tech stack to provide a seamless and intuitive pair-programming experience.

## ✨ Key Features

* **Real-Time Collaboration:** Code changes are synchronized across all connected clients in a room instantly using WebSockets.
* **Multi-Language Support:** A dynamic editor with syntax highlighting for popular languages including JavaScript, Python, and Java.
* **Code Execution:** Run code directly from the editor and view the results in a shared console, visible to all participants.
* **Shared Output Console:** The output from code execution is broadcast to all participants in the room in real-time.
* **Collaborator Tracking:** See a live list of all users currently present in the coding session.
* **Simple Room Management:** Users can easily create a new room with a unique ID or join an existing session.
* **Clean & Modern UI:** A sleek, dark-themed interface built for focus and usability.

## 🛠️ Tech Stack

This project is a full-stack application composed of a React frontend and a Node.js backend.

| Area         | Technology                                             |
| :----------- | :----------------------------------------------------- |
| **Frontend** | `React`, `React Router`, `Tailwind CSS`                |
| **Backend** | `Node.js`, `Express.js`                                |
| **Real-Time**| `Socket.io`, `Socket.io-client`                        |
| **Editor** | `CodeMirror 6` (`@uiw/react-codemirror`)               |
| **UI Tools** | `react-toastify` (notifications), `react-icons` (icons) |
| **Deployment**| Frontend on **Vercel**, Backend on **Render** |

## 🚀 How It Works

The application's real-time functionality is built upon a client-server architecture using WebSockets, managed by Socket.io.

1.  A user creates or joins a room from the `HomePage`.
2.  The frontend client establishes a persistent WebSocket connection to the Node.js backend server.
3.  The client emits a `join-room` event, and the server adds the user to a specific room, broadcasting the updated collaborator list to all clients in that room.
4.  When a user types in the editor, a `code-change` event is emitted to the server, which then broadcasts the new code to all other clients.
5.  When a user runs code, the frontend sends an API request to a secure backend endpoint. The backend processes the code, captures the output, and broadcasts it to all clients via an `output-change` event.
6.  On disconnection, the server notifies all remaining clients to update their collaborator list.

## 🔧 Local Setup and Installation

To run this project on your local machine, you will need to run both the frontend and backend servers.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
* `npm` or `yarn`

### Backend Setup (`server` folder)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/amngairola/code-editor.git](https://github.com/amngairola/code-editor.git)
    cd code-editor/server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the `server` directory and add the following variables:
    ```
    PORT=4000
    REACT_APP_FRONTEND_URL=http://localhost:5173
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:4000`.

### Frontend Setup (`clint` folder)

1.  **Navigate to the client directory:**
    Open a new terminal and navigate to the `clint` folder.
    ```bash
    cd code-editor/clint
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the `clint` directory and add the following variable:
    ```
    VITE_REACT_APP_BACKEND_URL=http://localhost:4000
    ```

4.  **Start the client:**
    ```bash
    npm run dev
    ```
    The application will open in your browser at `http://localhost:5173`.
