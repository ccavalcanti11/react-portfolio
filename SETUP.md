# Environment Setup Guide

This guide covers how to set up a fresh machine to run this project — a Next.js portfolio with React, Apollo Client, and GraphQL.

---

## 1. Install Node.js (via NVM — recommended)

[NVM](https://github.com/nvm-sh/nvm) lets you manage multiple Node versions easily.

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Reload your shell config (or restart the terminal)
source ~/.bashrc   # or ~/.zshrc if using Zsh

# Install the latest LTS version of Node.js
nvm install --lts

# Set it as default
nvm alias default node

# Verify installation
node -v
npm -v
```

> **Why NVM?** It avoids permission issues with global packages and makes switching Node versions painless.

---

## 2. (Optional but recommended) Install a faster package manager

```bash
# Enable Corepack (ships with Node.js 16.9+)
corepack enable

# Install pnpm (faster and more disk-efficient than npm)
corepack prepare pnpm@latest --activate

# Verify
pnpm -v
```

You can stick with `npm` if you prefer — all commands below have `npm` equivalents.

---

## 3. Clone the project and install dependencies

```bash
# Clone the repo (adjust the URL to your own)
git clone <your-repo-url>
cd react-portfolio

# Install all dependencies (React, Next.js, Apollo Client, GraphQL, etc.)
npm install
# or
pnpm install
```

This installs everything declared in `package.json`, including:

| Package | Purpose |
|---|---|
| `next` | The React framework (App Router, SSR, SSG) |
| `react` / `react-dom` | Core React library |
| `@apollo/client` | GraphQL client with caching and hooks |
| `graphql` | GraphQL query/schema parsing |
| `tailwindcss` | Utility-first CSS framework |
| `typescript` | Type safety |
| `jest` + `@testing-library/react` | Unit testing |

---

## 4. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Other useful commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Start production server (after build)
npm start

# Lint the code
npm run lint
```

---

## 6. Editor setup (VS Code recommended)

Install these extensions for the best experience:

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`
- **Apollo GraphQL** — `apollographql.vscode-apollo`
- **TypeScript** — built-in, no install needed

---

## Quick checklist for a new machine

- [ ] NVM + Node.js LTS installed
- [ ] `npm install` (or `pnpm install`) run inside the project folder
- [ ] Dev server starts with `npm run dev`
- [ ] Tests pass with `npm test`
