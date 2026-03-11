# Approvox - Administrative Dashboard (Frontend)

> **Status: Under Development**
> This repository contains the frontend application for the Approvox ecosystem. It is an administrative suite built for high-performance agency management.

## Project Overview

Approvox Frontend is a desktop-first, premium administrative dashboard. It serves as the visual and interactive layer for managing internal agency operations, team performance, and client relationships.

The interface is designed to translate the complex financial and operational data from the Approvox Backend into actionable insights and efficient workflows.

### Key UI/UX Features

- **Advanced Data Management**: Highly optimized table views for Clients and Team members featuring:
  - **Server-Side Sorting**: Global sorting logic that interacts directly with the API.
  - **Contextual Pagination**: Customizable rows-per-page with real-time state synchronization.
  - **Sticky Infrastructure**: Table headers anchored for efficient navigation of large datasets.
- **Administrative Control Suite**:
  - **Team Management**: Role-based access control, job titles, and internal staff monitoring.
  - **Client Portal Administration**: Management of external accounts, activations, and security resets.
- **Premium Design System**: 
  - Built with **Nuxt UI** and **Tailwind CSS**.
  - Modern aesthetic featuring glassmorphism effects, refined typography, and desktop-optimized layouts.
- **API Integrated Architecture**: Seamlessly consumes the Approvox backend API powered by Laravel Sanctum.

---

## Technical Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **UI Components**: [Nuxt UI](https://ui.nuxt.com/)
- **Styling**: Tailwind CSS
- **Iconography**: Lucide Icons
- **Language**: TypeScript
- **Package Manager**: pnpm

---

## Project Structure

- `app/components/`: Modular UI components following the Approvox design system.
- `app/composables/`: Business logic and API interaction layers (`useAppClients`, `useAppTeam`, `useAppAuth`).
- `app/pages/admin/`: Administrative views for clients, team members, and dashboard metrics.
- `app/i18n/`: Internationalization support (English/Spanish).

---

## Getting Started

### Prerequisites

- Node.js (Latest LTS)
- pnpm (7.x or higher)

### Setup

Install the required dependencies:

```bash
pnpm install
```

### Development

Run the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Production

Build the application for deployment:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

---

## Deployment

Refer to the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for detailed hosting instructions.
