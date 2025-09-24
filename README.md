# Task Manager

A full-stack task management application built with React (frontend) and Node.js/Express (backend). Features include creating, updating, deleting, and organizing tasks with drag-and-drop functionality, dark/light theme support, and offline capabilities.

## Features

- Create, update, delete, and complete tasks
- Drag and drop task reordering
- Dark/Light theme toggle
- Mobile responsive design
-Offline support with localStorage
- Filter tasks by status (All, Pending, Completed)

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **@hello-pangea/dnd** - Drag and drop functionality
- **CSS** - Styling with CSS variables for theming

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishvajeet1999/task-manager.git
   cd task-manager
   ```

2. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

3. **Setup Backend (in a new terminal)**
   ```bash
   cd server
   npm install
   npm start
   ```
   The backend API will be available at `http://localhost:5000`

4. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=user your own mongodb uri (MONGO_URI="mongodb+srv://vishvajeet14321:mjSSFjWcxjJ2PCuD@cluster0.frt30w0.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster0") ---->>> use this mongdb uri inside server folder within .env file. i will cchange the password after one day.
```


### Frontend Development
```bash
cd client
npm run dev          # Start development server
```


## Features in Detail

### Task Management
- **Create Tasks**: Add new tasks with title and description
- **Update Tasks**: Edit task details inline
- **Delete Tasks**: Remove tasks with confirmation
- **Toggle Status**: Mark tasks as complete/pending
- **Drag & Drop**: Reorder tasks by dragging

### Theme Support
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for low-light usage
- **Persistent**: Theme preference saved in localStorage
- **Auto-detect**: Respects system theme preference

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Flexible Layout**: Adapts to different screen sizes
- **Touch-friendly**: Large touch targets for mobile

### Offline Support
- **Local Storage**: Tasks cached locally for offline access
- **Graceful Degradation**: App works without server connection
- **Auto-sync**: Syncs with server when connection restored

