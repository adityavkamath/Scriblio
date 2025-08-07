# Scriblio - Nextjs Application

## Features

- This application supports oauthentication provided by google as well as traditional credential login.
- The web socket establishes connections only with authenticated user for realtime communication.

# 🧩 Turborepo Monorepo Starter

A modern monorepo built using [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/). This setup is perfect for managing multiple apps (like `web`, `admin`, `docs`) and shared packages (like `ui`, `config`, `utils`) in a single, fast, and scalable codebase.

---

## 📦 Create This Monorepo

To get started quickly with a fresh turborepo setup:

```bash
npx create-turbo@latest

## 📁 Project Structure

```bash
my-turborepo/
├── apps/             # Application code
│   ├── web/          # Your frontend app (e.g., Next.js)
│   └── docs/         # Documentation site
├── packages/         # Shared code across apps
│   ├── ui/           # Reusable UI components
│   └── config/       # Shared configurations
├── turbo.json        # Turborepo pipeline config
├── package.json
└── pnpm-workspace.yaml
```

---

## ⚙️ Installation

```bash
cd my-turborepo
pnpm install
```

Make sure you have `pnpm` installed globally:

```bash
npm install -g pnpm
```

---

## 🚧 Build All Apps & Packages

```bash
pnpm build
```

This will run the build scripts for all apps and packages based on the dependency graph defined in `turbo.json`.

---

## 💻 Develop Locally

```bash
pnpm dev
```

This starts all apps in development mode concurrently using Turborepo's pipeline system.

---

## 🧰 Tech Stack

* 🧱 **Turborepo** — High-performance monorepo build system
* ⚡ **pnpm** — Fast and efficient package manager
* 🧑‍💻 **TypeScript** — Type-safe development across all apps
* ⚛️ **Next.js** — Full-stack React framework (for web app)
* 💅 **Tailwind CSS** — Utility-first styling (optional)

---

## 📝 Scripts

| Command       | Description                      |
| ------------- | -------------------------------- |
| `pnpm dev`    | Run all apps in development mode |
| `pnpm build`  | Build all apps and packages      |
| `pnpm lint`   | Run linting across the monorepo  |
| `pnpm format` | Format code using Prettier       |

> Add custom scripts inside each `apps/*` or `packages/*` folder as needed.

---

## 🧪 Testing (optional)

If you use testing tools like Jest or Vitest, you can add:

```bash
pnpm test
```

---

## ✅ Requirements

* [Node.js](https://nodejs.org/) v18 or higher
* [pnpm](https://pnpm.io/) v8 or higher

---



