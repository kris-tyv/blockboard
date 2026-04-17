# BlockBoard

BlockBoard is a Trello-style task management application built with Next.js and TypeScript. The "block" word came from the company's name which is blocklabs and the word "board" is from task board.   It allows users to manage tasks through different workflow stages in a clean and interactive interface.

---

## Design Approach

The UI is inspired by the **Blocklabs logo and visual identity**.

- The application uses a **dark theme** to create a modern and focused workspace.
- Accent colors such as **blue, green, yellow, and red** are derived from the Blocklabs logo.
- These colors are used consistently across:
  - Task priorities
  - Workflow stages (To Do, In Progress, Done)
  - Buttons and highlights
- Subtle gradients and glow effects are applied to make the interface feel more dynamic and visually engaging.

---

## Features

### Task Management
- Users can **create new tasks** with:
  - Title
  - Description
  - Priority (Low, Medium, High)
  - Due date
  - Status (To Do, In Progress, Done)

###  Edit Tasks
- Users can **edit existing tasks**
- The form automatically populates with the selected task’s data
- Improves usability and avoids re-entering information

###  Move Tasks Between Stages
- Tasks can be moved across:
  - To Do → In Progress → Done
- This simulates a real **Kanban workflow system**

###  Delete Tasks
- Users can remove tasks from the board
- Helps keep the workspace clean and updated

###  Search & Filter
- Users can:
  - Search tasks by title or description
  - Filter tasks by priority
- Makes task management efficient when handling multiple items

###  Due Date Indicators
- Tasks display:
  - Due date
  - “Due Today” indicator
  - “Overdue” warning
- Helps users stay aware of deadlines

###  Persistent Storage
- Data is stored using **localStorage**
- Tasks remain even after refreshing the page

###  Task Overview
- Dashboard shows:
  - Total tasks
  - Tasks per stage
- Provides a quick summary of progress

---

##  Tech Stack

- Next.js
- TypeScript
- Tailwind CSS

---

##  Getting Started

### 1. Clone the repository
git clone https://github.com/kris-tyv/blockboard.git

### 2. Navigate to the project
cd taskflow

### 3. Install dependencies
npm install

### 4. Run the development server
npm run dev

### 5. Open in browser
http://localhost:3000

##  Author

**Annjela Kristy R. Nicolas**  
- GitHub: https://github.com/kris-tyv  
- Email: nicolasannjela@gmail.com or akrnicolas@mymail.mapua.edu.ph