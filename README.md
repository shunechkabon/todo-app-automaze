# 📝 Task Manager (TODO App)

A full-stack TODO application with task management, filtering, and prioritization.

---

## ✨ Features

- Create and delete tasks
- Mark tasks as done / undone
- Assign priority (1-10)
- Categorize tasks (Work, Home, Study, Health, Other)
- Search tasks by title
- Filter tasks by status (all / done / undone)
- Sort tasks by priority
- Keyboard-friendly form (Enter to submit)
- Clean and user-friendly UI

---

## 🛠 Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Radix UI**
- **Lucide Icons**

### Backend

- **Node.js**
- **API routes (Next.js)**
- **Prisma ORM**
- **PostgreSQL**

---

## 📦 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/shunechkabon/todo-app-automaze.git
cd todo-app-automaze
```

### 2. Install dependencies

```sh
npm install
```

### 3. Environment variables

Create a `.env` file in the project root:

```sh
DATABASE_URL=your_postgresql_connection_string
```

### 4. Run database migrations

```sh
npx prisma migrate dev
```

### 5. Start the development server

```sh
npm run dev
```

The app will be available at:
👉 http://localhost:3000

---

## 🗂 Project Structure

```sh
.
├── app/                # Next.js app router
│   ├── api/            # Backend API routes
│   └── page.tsx        # Main page
├── components/
│   ├── todo/           # Feature-specific components
│   └── ui/             # shadcn/ui components
├── lib/                # API calls, db, services, types, utils, validators
├── prisma/             # Prisma schema & migrations
├── public/             # Static assets
└── README.md           # Project documentation
```

---

## 🚀 Deployment

The application is deployed and available here:
🔗 **Live Demo:** https://todo-app-automaze.vercel.app/

Repository:
🔗 **GitHub:** https://github.com/shunechkabon/todo-app-automaze

---

## 🧠 Notes

Key implementation details:

- Clean and maintainable code structure
- Predictable state management
- Thoughtful UX (loading states, keyboard interactions, form reset behavior)
- No authentication - tasks are shared globally.

The goal was to build a small but realistic full-stack feature
with attention to code quality and user experience.

---

## 👩‍💻 Author

Created by **Oleksandra Bondaruk**
Junior Full-Stack Developer
