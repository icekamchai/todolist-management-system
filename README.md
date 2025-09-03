# ToDoList Management System ✨

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React Badge"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript Badge"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white&style=for-the-badge" alt="Redux Badge"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS Badge"/>
</p>

A frontend web application for task management, inspired by Trello and Jira. This project showcases skills in modern frontend development, state management, and creating an intuitive user experience.

---

## 🌟 Features

### Core Features

- **User Authentication**: Secure registration with strict password validation (Regex) and login functionality using `localStorage` to simulate a user database.
- **Task Management (CRUD)**: Full capabilities to create, read, update, and delete tasks.
- **Category Management**: Users can create, rename, and delete task categories (lists).
- **Task Count Display**: Each category header shows the total number of tasks within it.

### Bonus Features

- **Modern Dark Theme**: A polished and intuitive dark theme, fully customized for all Ant Design components.
- **Drag-and-Drop**: Smoothly rearrange tasks within and across categories using `@dnd-kit`. Includes a `DragOverlay` to solve visual clipping issues.
- **Due Dates & Reminders**: Set due dates for tasks, with visual highlights for tasks due **today** (amber) and **overdue** (red).
- **Image Uploads**: Add a cover image to each task. This feature simulates uploads by converting files to Base64 and storing them in `localStorage`.
- **Real-time Search**: A search bar in the navbar to instantly filter tasks by title or details.
- **Detailed Task View**: Click a task to open a "view mode" modal before switching to "edit mode", improving the user workflow.

---

## 🛠️ Tech Stack

- **Build Tool:** Vite
- **Language:** TypeScript
- **Frontend Framework:** React
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** Ant Design
- **Notifications:** React Hot Toast
- **Drag & Drop:** `@dnd-kit`

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/icekamchai/todolist-management-system.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd todolist-management-system
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173` (or the next available port).
