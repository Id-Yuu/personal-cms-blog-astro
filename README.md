# 📝 Personal CMS Blog Build in Astro

A full-featured blog platform built with [Astro](https://astro.build) and React, featuring a protected dashboard, post management, sidebar/widget configuration, user management, and token-based authentication.

> [!CAUTION] 
> **Not recommended for production.** This project uses flat JSON files as a database and was built for learning/demo purposes only. It lacks proper security hardening, scalability, and error handling required for a production environment.

---

## 🚀 Project Structure

```text
personal-cms-blog-astro/
├── public/                          # Static assets served at root
│   ├── favicon.ico                  # Site favicon (ICO format)
│   ├── favicon.svg                  # Site favicon (SVG format)
│   └── img/                         # Uploaded / static images folder
│
├── src/
│   ├── components/                  # Reusable UI components (React / JSX)
│   │   ├── Dashboard.jsx            # Main dashboard shell with tab navigation
│   │   ├── Footer.jsx               # Site-wide footer component
│   │   ├── Header.jsx               # Site-wide header component
│   │   ├── LoginForm.jsx            # Login form with credential validation
│   │   ├── Nav.jsx                  # Top navigation bar with links
│   │   ├── PostList.jsx             # Public post listing with pagination
│   │   ├── Sidebar.jsx              # Dynamic sidebar that renders assigned widgets
│   │   ├── TopWidget.jsx            # Featured / top widget display component
│   │   └── dashboard/               # Dashboard tab sub-components
│   │       ├── PostsTab.jsx         # CRUD management for blog posts
│   │       ├── SettingsTab.jsx      # Site settings editor (title, description, etc.)
│   │       ├── SidebarsTab.jsx      # Sidebar layout builder with widget assignment
│   │       ├── UsersTab.jsx         # User management with role-based access control
│   │       └── WidgetTab.jsx        # Widget creation and rich-text content editor
│   │
│   ├── hooks/                       # Custom React hooks for API interactions
│   │   ├── useAuth.js               # Auth state: login, logout, token management
│   │   ├── usePosts.js              # Post CRUD: fetch, create, update, delete
│   │   ├── useSettings.js           # Site settings: fetch and update
│   │   ├── useSidebars.js           # Sidebar config: fetch and update
│   │   ├── useUsers.js              # User list: fetch, add, delete, role update
│   │   └── useWidgets.js            # Widget CRUD operations
│   │
│   ├── layouts/                     # Astro layout wrappers
│   │   └── MainLayout.astro         # Base page layout (head, header, footer, slots)
│   │
│   ├── pages/                       # File-based routing (Astro pages)
│   │   ├── index.astro              # Homepage: post list + dynamic sidebar widgets
│   │   ├── about.astro              # About page with static content
│   │   ├── contact.astro            # Contact page with static content
│   │   ├── login.astro              # Login page — mounts LoginForm component
│   │   ├── dashboard/
│   │   │   └── index.astro          # Dashboard entry point (auth-gated)
│   │   └── posts/
│   │       └── [id].astro           # Dynamic single-post page (SSR, routed by post ID)
│   │
│   └── styles/                      # Global stylesheets
│       └── global.css               # Base styles, typography, layout, dark mode
│
├── server.js                        # REST API server (auth, posts, users, settings)
├── db.json                          # JSON database: site settings, widgets, sidebars
├── posts.json                       # JSON database: all blog post entries
├── users.json                       # JSON database: user accounts (hashed passwords + roles)
├── astro.config.mjs                 # Astro configuration (output mode, integrations)
├── package.json                     # Project dependencies and npm scripts
└── .gitignore                       # Git ignore rules
```

---

## 🧩 Architecture Overview

| Layer | Technology | Purpose |
| :---- | :--------- | :------ |
| Frontend | Astro + React (JSX) | File-based routing with React interactive islands |
| API Server | JSON Server (`server.js`) | REST endpoints for auth, posts, users, and settings |
| Data Store | JSON files (`*.json`) | Lightweight flat-file persistence (no external DB) |
| Auth | JWT tokens (`useAuth.js`) | Token-based login, stored in `localStorage` |
| Styling | Vanilla CSS (`global.css`) | Custom design system — no CSS framework |

---

## 🧞 Commands

All commands are run from the root of the project:

| Command            | Action                                                  |
| :----------------- | :------------------------------------------------------ |
| `npm install`      | Installs all dependencies                               |
| `npm run dev`      | Starts Astro dev server at `localhost:4321`             |
| `npm run build`    | Builds the production site to `./dist/`                 |
| `npm run preview`  | Preview the production build locally before deploying   |
| `node server.js`   | Starts the Express API server (required for all data)   |
| `npm run astro ...`| Run Astro CLI commands like `astro add`, `astro check`  |

> **Note:** Both the Astro dev server (`npm run dev`) and the API server (`node server.js`) must be running **simultaneously** for full functionality.

---

## 🔐 Authentication

- Login is handled via `POST /api/login` on the Express server
- On success, a **JWT token** is returned and stored in `localStorage`
- The dashboard (`/dashboard`) is **auth-gated** — unauthenticated users are redirected to `/login`
- Passwords are stored **hashed** in `users.json`

    ### 🖥️ Dashboard Access

    > Navigate to `/login` (e.g. `http://localhost:4321/login`) and sign in with the default admin credentials:
    >
    > | Field    | Value      |
    > | :------- | :--------- |
    > | Username | `admin`    |
    > | Password | `admin123` |
    >
    > **⚠️ Important:** Change the default password immediately in production. Update `users.json` with a new bcrypt-hashed password or use the **Users** tab in the dashboard.

---

## 📦 Data Files

| File | Description |
| :--- | :---------- |
| `db.json` | Stores site settings, widget definitions, and sidebar layout configurations |
| `posts.json` | Stores all blog post entries (title, content, author, date, status, etc.) |
| `users.json` | Stores registered users with hashed passwords and assigned roles |

---

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Astro Project Structure Guide](https://docs.astro.build/en/basics/project-structure/)
- [Astro Discord Community](https://astro.build/chat)
