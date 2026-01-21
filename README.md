# Happy Happy Feet

**Happy Happy Feet** is a modern, premium e-commerce application designed for browsing and ordering footwear. It provides a seamless shopping experience with a clean, minimalist UI, focusing on performance and ease of use. The platform leverages a "WhatsApp-first" ordering approach, combining the convenience of web browsing with the personal touch of direct messaging.

This project is built for customers who appreciate high-quality footwear and a streamlined, personal purchasing process.

## Features

- **Product Catalog**: distinctive shop grid with category filtering and sorting.
- **Dynamic Product Details**: Rich product pages with image galleries, size selection, and related products.
- **Shopping Cart**: Fully functional cart with persistent state and real-time total calculation.
- **WhatsApp Ordering System**: simplified checkout flow that generates a pre-filled WhatsApp message for order completion.
- **Admin Dashboard**: Secured area for order management and product administration.
- **Responsive Design**: Mobile-first architecture ensuring a premium experience across all devices.
- **Size Guide**: Dedicated section helping customers find their perfect fit.
- **Search Functionality**: fast, client-side search for products.
- **SEO Optimization**: Metadata and structured content for better visibility.

## Tech Stack

**Core Frameworks**
- **Next.js 16 (App Router)**: React framework for production.
- **React 19**: UI library.
- **TypeScript**: Static typing for reliability.

**Styling & UI**
- **Tailwind CSS 4**: Utility-first CSS framework.
- **Shadcn/ui & Radix UI**: Accessible, re-usable component primitives.
- **Framer Motion**: Smooth, declarative animations.
- **Lucide React**: Modern icon set.

**Backend & Data**
- **Supabase**: Open source Firebase alternative for Database and Auth.
- **PostgreSQL**: Robust relational database (via Supabase).

**State Management**
- **React Context API**: Used for Cart, Search, and Admin Auth state.

## Architecture Overview

The application follows the modern **Next.js App Router** architecture, prioritizing server-side rendering (SSR) where possible and using Client Components for interactive elements.

- **`src/app`**: Contains all routes (`/shop`, `/checkout`, `/admin`, etc.) and layouts.
- **`src/components`**: Modular UI components.
    - `ui/`: Low-level design system components (buttons, inputs).
    - Feature-specific components (e.g., `ShoeCard`, `CartSheet`) are kept at the top level or grouped by feature.
- **`src/lib`**: Utilities and backend logic.
    - `supabase.ts`: Database client configuration.
    - `orders.ts` / `products.ts`: Data fetching and mutation logic.
- **`src/context`**: Global state providers (`CartContext`, `AdminAuthContext`).

**Data Flow**:
Product data is fetched from Supabase (mostly server-side) and passed to components. The Cart state is managed locally via Context. When a user checks out, an order record is created in Supabase via a Server Action, and the user is then redirected to WhatsApp with the order details.

## Getting Started

### Prerequisites
- Node.js 18+ installed.
- npm or yarn package manager.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Caleb-Kiune/Happy-Happy-Feet.git
    cd happy-happy-feet
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages & layouts
│   │   ├── admin/           # Admin dashboard routes
│   │   ├── checkout/        # Checkout flow
│   │   ├── shop/            # Product browsing routes
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/              # Shadcn UI primitives
│   │   ├── CartSheet.tsx    # Shopping cart sidebar
│   │   ├── Header.tsx       # Main navigation
│   │   └── ...
│   ├── context/             # React Context providers
│   ├── lib/                 # Utilities & database logic
│   └── assets/              # Static assets
├── supabase/                # Supabase configuration & migrations
├── public/                  # Public static files
├── next.config.ts           # Next.js config
└── tailwind.config.ts       # Tailwind config (v4 integrated)
```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Design & UX Decisions

- **Minimalist Aesthetic**: The design uses plenty of whitespace, clean typography, and a restrained color palette to let the products stand out.
- **Performance First**: Optimizations like `next/image` and dynamic imports ensure fast load times, essential for e-commerce conversion.
- **Mobile-First**: Creating a great experience on phones was a priority, given the WhatsApp-based workflow which is predominantly mobile-centric.
- **Micro-interactions**: Subtle animations using Framer Motion (like the floating WhatsApp button) add a premium feel without overwhelming the user.

## Ordering Flow

1.  **Browse**: User browses the shop and selects a product.
2.  **Select**: User chooses a size and adds the item to the cart.
3.  **Cart**: User reviews items in the cart sidebar.
4.  **Checkout**: User proceeds to the checkout page and enters delivery details (Name, Phone, Location).
5.  **Submit**:
    - The system saves the order to the Supabase database.
    - An automatic WhatsApp message is generated containing the Order ID and itemized list.
6.  **Complete**: The user is redirected to WhatsApp to send the message to the merchant, confirming the order and delivery fees.

## Limitations

- **No Online Payment Gateway**: Payments are handled off-platform (via WhatsApp/Mobile Money), which simplifies the tech stack but requires manual verification.
- **Manual Inventory Management**: Stock levels need to be updated by the admin and are not automatically deducted in real-time during the WhatsApp conversation gap.
- **Region Specific**: The delivery logic is currently tailored to a specific operational region.

## Author

**Caleb Kiune**
- Full Stack Engineer
