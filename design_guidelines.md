# GfxStore Design Guidelines

## Design Approach

**Reference-Based Strategy**: Draw inspiration from Modrinth's clean interface, Discord's gaming aesthetic, and Steam's marketplace polish. Create a premium gaming marketplace that feels both professional and community-driven.

**Core Design Principles**:
- Gaming-first aesthetic with professional credibility
- High-performance, content-forward layouts
- Trust-building through polished UI and clear information hierarchy
- Community-centric with creator showcase elements

---

## Typography System

**Font Stack**:
- Primary: Inter or DM Sans (clean, modern readability)
- Accent: JetBrains Mono or Fira Code (for stats, version numbers, technical details)

**Hierarchy**:
- Hero Headlines: 4xl to 6xl, font-bold, tight tracking
- Section Headers: 3xl to 4xl, font-semibold
- Product Titles: xl to 2xl, font-semibold
- Body Text: base to lg, font-normal, leading-relaxed
- Metadata/Stats: sm to base, font-medium (use mono font)
- Buttons/CTAs: base, font-semibold, uppercase tracking-wide for primary actions

---

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 24 for consistent rhythm (p-4, gap-8, mt-12, py-24, etc.)

**Container Strategy**:
- Full-width sections with inner max-w-7xl for content
- Product grids: max-w-7xl
- Reading content: max-w-4xl
- Forms: max-w-md to max-w-lg

**Grid Patterns**:
- Product Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard Stats: grid-cols-2 lg:grid-cols-4
- Featured Content: Asymmetric 2-column (2/3 + 1/3 splits)

---

## Component Library

### Navigation
- Sticky header with backdrop blur
- Logo + primary nav links + search bar + user menu
- Category mega-menu on hover
- Mobile: Slide-out drawer with full navigation

### Product Cards
- Compact cards with image thumbnail (16:9 ratio)
- Gradient overlay on image for title text
- Icon badges for free/paid, category, verification
- Stats row: downloads, rating, version (mono font)
- Hover: Subtle lift (translate-y-1) with enhanced shadow

### Dashboard Cards
- Stats cards: Large number display with icon, description below
- Quick action cards: Icon + title + one-line description
- Chart containers: Minimal borders, generous padding (p-6)

### Forms & Inputs
- Floating labels or top-aligned labels
- Full-width inputs with generous padding (px-4 py-3)
- Focus states with ring effects
- Helper text in muted smaller size below inputs
- Upload areas: Dashed border, large drop zones with icons

### Tables
- Striped rows for readability
- Sticky headers for long tables
- Status badges (Pending/Paid/Delivered) with appropriate semantic styling
- Action buttons in rightmost column

### Modals & Overlays
- Backdrop blur with semi-transparent overlay
- Centered cards with max-w-2xl for content modals
- Slide-in panels from right for quick actions (max-w-md)

### Buttons
- Primary: Solid fill, font-semibold, px-6 py-3
- Secondary: Outline style with border-2
- Ghost: No background, hover shows subtle fill
- Icon buttons: Square aspect ratio, p-2 to p-3
- Blurred backgrounds when over images

### Product Detail Pages
- Two-column layout: Gallery (60%) + Info sidebar (40%)
- Tabbed content for description, changelog, reviews
- Sticky purchase/download card in sidebar
- Screenshot carousel with thumbnails

### Admin Tables
- Bulk selection checkboxes
- Filter pills above table
- Sortable column headers
- Expandable rows for detailed views
- Action dropdown menus

---

## Images Strategy

**Hero Section**: Full-width hero with dynamic gaming-themed illustration or 3D rendered Minecraft scenes. Height: 70vh on desktop. Title and CTA overlaid with blurred button backgrounds.

**Product Thumbnails**: 16:9 ratio images for all marketplace items. Placeholder gradient if no image provided.

**Category Banners**: Wide banners (21:9 ratio) representing each category with relevant imagery.

**User Avatars**: Circular, consistent sizes (w-8 h-8 for small, w-12 h-12 for medium, w-24 h-24 for profiles).

**VPS Plan Cards**: Background images showing server racks or tech-themed visuals with overlay gradients.

**Dashboard**: Avoid images except user avatars and product thumbnails to maintain speed.

**Featured Products**: Large hero-style cards with 2:1 ratio images.

---

## Page-Specific Layouts

### Landing Page
1. Hero: Full-width with gaming aesthetic image, search bar prominently centered, category quick links
2. Featured Products: Large 3-column grid with promoted items
3. Categories: Icon-driven 6-column grid (desktop) with hover effects
4. Top Charts: 2-column split (Most Downloaded | Top Rated)
5. VPS Plans: Horizontal scroll cards with pricing
6. Community Stats: 4-column counter section
7. CTA Section: Centered with dual actions (Browse | Start Selling)

### Marketplace
- Sidebar filters (left, sticky, collapsible on mobile)
- Product grid (main, 3-4 columns)
- Top bar: Search + sort dropdown + view toggle (grid/list)

### Dashboard
- Sidebar navigation (fixed, icons + labels)
- Main content: Stats grid → Recent Activity table → Quick actions
- Subpages maintain sidebar, swap main content area

### Admin Panel
- Condensed sidebar with grouped sections
- Top bar with quick stats and notifications
- Tables with advanced filtering and bulk actions
- Chart-heavy analytics page with 2-column layouts

---

## Responsive Behavior

- Mobile: Single column, bottom navigation bar, slide-out filters
- Tablet: 2-column grids, persistent sidebar collapses to icons
- Desktop: Full layouts, hover interactions enabled, sticky elements active

---

**Animation Philosophy**: Minimal but purposeful. Smooth transitions (duration-200 to duration-300) for state changes. Avoid distracting scroll animations. Focus on micro-interactions: hover lifts, loading states, and success confirmations.