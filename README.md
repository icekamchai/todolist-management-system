# ToDoList Management System

[cite_start]A frontend web application for task management, inspired by Trello and Jira[cite: 2]. [cite_start]Built with React, TypeScript, and Redux, this project focuses on a clean user interface and an intuitive user experience[cite: 2].

![Project Screenshot](link_to_your_screenshot.png)

---

## ✨ Features (คุณสมบัติ)

### Core Features

- [cite_start]**User Authentication** [cite: 6]
  - [cite_start]User registration with email and password[cite: 8].
  - [cite_start]Strict password validation using Regex[cite: 9, 10, 11, 12, 13, 14].
  - [cite_start]User sign-in with registered credentials[cite: 15].
- [cite_start]**Task Management (CRUD)** [cite: 17]
  - [cite_start]Create, Read, Update, and Delete tasks[cite: 18, 19, 20].
  - [cite_start]View tasks in a board format[cite: 18].
- [cite_start]**Task Categorization** [cite: 22]
  - [cite_start]Create and manage custom categories (lists)[cite: 23].
  - [cite_start]Display the total number of tasks in each category[cite: 23].

### 🌟 Bonus Features

- **Modern Dark Theme:** A polished and intuitive dark theme for a better user experience.
- [cite_start]**Drag-and-Drop Sorting:** Rearrange tasks within and across categories by dragging and dropping them[cite: 30].
- [cite_start]**Due Dates & Reminders:** Set due dates for tasks, with visual highlights for tasks due today (amber) and overdue tasks (red)[cite: 31, 32, 33].
- [cite_start]**Image Uploads:** Add a cover image to each task for better visualization[cite: 34, 35].
- [cite_start]**Search Functionality:** A real-time search bar to filter tasks by title or details[cite: 27].
- **Detailed Task View:** Click a task to view its full details before entering edit mode.
- **Persistent State:** User data and tasks are saved in the browser's `localStorage`.

---

## 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

- [cite_start]**Build Tool:** Vite [cite: 40]
- [cite_start]**Frontend Framework:** React [cite: 41]
- [cite_start]**Language:** TypeScript [cite: 42]
- [cite_start]**State Management:** Redux [cite: 43]
- [cite_start]**Styling:** Tailwind CSS [cite: 44]
- [cite_start]**UI Components:** Ant Design [cite: 45]
- [cite_start]**Toast Notifications:** React Hot Toast [cite: 46]

---

## 🚀 Getting Started (เริ่มต้นใช้งาน)

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/YourRepositoryName.git](https://github.com/YourUsername/YourRepositoryName.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd YourRepositoryName
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    `bash
    npm run dev
    `
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## 💡 Challenges and Learnings

One of the main challenges was implementing a seamless drag-and-drop experience that allowed moving tasks between different categories, especially into empty lists. This was solved using `@dnd-kit` and a custom `DragOverlay` component to prevent visual glitches caused by CSS overflow properties. Another challenge was creating a fully consistent dark theme for the Ant Design component library, which was achieved by deeply customizing the theme using `ConfigProvider`.
