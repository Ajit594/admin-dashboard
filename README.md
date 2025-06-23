# AdminControlPanel

A modern, full-stack admin dashboard built with React, Express, Vite, and TypeScript. Features include analytics, Kanban board, data tables, calendar, notifications, authentication, and more.

## Features

- ⚡️ **Vite** for fast development and build
- 🖥️ **React 18** with modern hooks and context
- 🎨 **Tailwind CSS** for utility-first styling
- 📊 **Recharts** for analytics and charting
- 🗂️ **Kanban Board** for project/task management
- 📅 **Calendar** integration
- 🗄️ **Express** backend with session support
- 🗃️ **Drizzle ORM** for database access
- 💬 **Notifications** and toast system
- 🧩 Modular, reusable UI components (Radix UI, shadcn/ui)
- 🌗 **Dark mode** support

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/your-username/AdminControlPanel.git
cd AdminControlPanel
npm install
```

### Development

```bash
npm run dev
```

- The client and server will start in development mode.
- Visit [http://localhost:5173](http://localhost:5000) (or the port shown in your terminal).

### Build

```bash
npm run build
```

- Builds both the client and server for production.

### Production Start

```bash
npm run start
```

- Starts the server using the built files.

## Project Structure

```
AdminControlPanel/
├── client/         # React frontend (Vite, Tailwind, shadcn/ui)
├── server/         # Express backend (TypeScript)
├── shared/         # Shared types and schema
├── dist/           # Production build output
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

## Environment Variables

Create a `.env` file in the root for your environment variables (database, secrets, etc).

## Scripts

- `npm run dev` – Start development server (client + server)
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run check` – TypeScript check
- `npm run db:push` – Push database schema (Drizzle ORM)

## Technologies Used

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Passport.js](http://www.passportjs.org/)

## License

[MIT](LICENSE)

---

> Built with ❤️ by Ajit
