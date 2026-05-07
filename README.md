# StudyBlog — Developer Q&A Community Platform

> A full-stack, community-driven Q&A platform inspired by Stack Overflow, built with Next.js 14, Prisma, Clerk, and powered by **Google Gemini 2.5 Flash AI** as a built-in study assistant.

---

## What Is StudyBlog?

StudyBlog is a **developer knowledge-sharing platform** where users can:
- Ask programming and study questions with a rich-text editor
- Answer others' questions
- Upvote / downvote questions and answers
- Save questions to a personal collection
- Build a public profile with reputation points
- Explore the community of contributors
- **Ask an AI assistant (StudyGuru)** powered by Google Gemini 2.5 Flash directly inside the platform

It mirrors the experience of Stack Overflow while layering in AI assistance, a personalized tag system, and a modern dark/light themed UI.

---

## Live Features

| Feature | Description |
|---|---|
| Authentication | Clerk-based sign-up/sign-in with webhook user sync |
| Ask Questions | Rich-text (TinyMCE) editor with tag support |
| Edit / Delete Questions | Owner-only controls with cache invalidation |
| Answer Questions | Rich-text answers with voting |
| Upvote / Downvote | On both questions and answers; mutually exclusive |
| ⭐ Save to Collection | Bookmark questions for later |
| Ask StudyGuru | Gemini 2.5 Flash AI assistant with Markdown rendering |
| User Profiles | Points, bio, portfolio, questions & answers tabs |
| Personal Tags | Users maintain their own interest tags in the sidebar |
| Search | Real-time title search with URL query params |
| Filters | Recommended, Newest, Most Upvoted, Unanswered |
| Pagination | 10 items per page, custom pagination component |
| Dark / Light Mode | System-aware theme with `next-themes` |
| Responsive UI | Mobile-first with collapsible sidebar and mobile filters |
| Toast Notifications | `sonner` toasts for all user actions |

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2.5 | App Router, Server Components, Server Actions, API Routes |
| **React** | 18 | UI library |
| **TypeScript** | 5 | Static typing throughout the entire codebase |

### Database & ORM
| Technology | Version | Purpose |
|---|---|---|
| **Prisma** | 6.18.0 | ORM — schema, migrations, type-safe queries |
| **MySQL** (PlanetScale / any MySQL) | — | Relational database (configured via `DATABASE_URL`) |

### Authentication
| Technology | Version | Purpose |
|---|---|---|
| **Clerk** | 5.7.5 | Full auth — sign-in, sign-up, sessions, webhooks |
| **Svix** | 1.81.0 | Webhook verification for Clerk events |

### AI Integration
| Technology | Version | Purpose |
|---|---|---|
| **Google Gemini 2.5 Flash** | REST API | AI-powered StudyGuru assistant |
| **Marked** | 17.0.1 | Parses Gemini Markdown output to HTML |

### UI & Styling
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | 3.4.1 | Utility-first CSS |
| **shadcn/ui (Radix UI)** | Various | Accessible headless components (Dialog, Select, Tabs, Toast…) |
| **TinyMCE React** | 5.1.1 | Rich-text WYSIWYG editor for questions/answers |
| **next-themes** | 0.3.0 | Dark/light mode with system preference |
| **Lucide React** | 0.408.0 | Icon set |
| **React Icons** | 5.2.1 | Additional icons (sidebar nav) |
| **Inter + Space Grotesk** | Google Fonts | Typography via `next/font` |
| **PrismJS** | 1.29.0 | Code syntax highlighting in parsed HTML |

### Forms & Validation
| Technology | Version | Purpose |
|---|---|---|
| **React Hook Form** | 7.52.1 | Form state management |
| **Zod** | 3.23.8 | Schema validation (questions, answers, profile) |
| **@hookform/resolvers** | 3.9.0 | Connects Zod schemas to React Hook Form |
| **react-tag-input** | 6.9.0 | Tag chips UI for question tags |

### Utilities
| Technology | Version | Purpose |
|---|---|---|
| **date-fns** | 3.6.0 | Date formatting |
| **react-moment** | 1.1.3 | Relative timestamps |
| **query-string** | 9.0.0 | URL search param management |
| **html-react-parser** | 5.1.10 | Safely renders TinyMCE HTML output |
| **uuid** | 10.0.0 | Unique ID generation |
| **clsx + tailwind-merge** | latest | Conditional className utilities |
| **sonner** | 1.5.0 | Toast notification system |

---

## Project Structure

```
studyBlog/
├── app/
│   ├── (auth)/                  # Auth route group
│   │   ├── sign-in/             # Clerk hosted sign-in page
│   │   └── sign-up/             # Clerk hosted sign-up page
│   ├── (root)/                  # Main app route group (with layout)
│   │   ├── (home)/page.tsx      # Home feed — all questions
│   │   ├── question/[id]/       # Question detail + answers page
│   │   ├── askQuestion/         # Create new question page
│   │   ├── ask-studyGuru/       # AI assistant page
│   │   ├── collection/          # Saved/bookmarked questions
│   │   ├── community/           # All users list
│   │   ├── profile/
│   │   │   ├── [id]/            # Public profile view
│   │   │   └── edit/            # Edit own profile
│   │   └── layout.tsx           # Shell: Header + LeftSidebar + RightSidebar
│   ├── api/
│   │   ├── clerk/route.ts       # Clerk webhook endpoint (user sync)
│   │   └── gemini/route.ts      # Gemini AI proxy endpoint
│   ├── globals.css              # Global Tailwind + custom CSS vars
│   └── layout.tsx               # Root layout (ClerkProvider + ThemeProvider)
│
├── components/
│   ├── ask/
│   │   ├── AskEditQuestion.tsx  # Unified create/edit question form (TinyMCE)
│   │   ├── AskStudyGuru.tsx     # AI chat interface (Gemini)
│   │   └── TagInput.tsx         # Tag chip input component
│   ├── global/
│   │   ├── QuestionCard.tsx     # Question list card (title, tags, metrics)
│   │   ├── Votes.tsx            # Upvote/downvote/save buttons
│   │   ├── Filters.tsx          # Desktop filter bar
│   │   ├── MobileFilters.tsx    # Mobile filter dropdown
│   │   ├── Searchbar.tsx        # URL-synced search input
│   │   ├── CustomPagination.tsx # Page navigation
│   │   ├── NoResult.tsx         # Empty state with CTA
│   │   ├── ParseHTML.tsx        # Safe HTML renderer with PrismJS
│   │   └── Metric.tsx           # Reusable metric stat (icon + value + label)
│   ├── navigation/
│   │   ├── Header.tsx           # Top navbar (logo, search, user button)
│   │   ├── LeftSidebar.tsx      # Sticky nav sidebar with active states
│   │   ├── RightSidebar.tsx     # Personal tags panel (signed-in only)
│   │   └── AddTag.tsx           # Tag management in right sidebar
│   ├── AllAnswers.tsx           # Paginated answers list for a question
│   ├── UserAnswer.tsx           # Answer submission form
│   ├── Profile.tsx              # Profile edit form (React Hook Form + Zod)
│   ├── QuestionTab.tsx          # Questions tab on profile page
│   ├── UserCard.tsx             # User card for community page
│   ├── TagCard.tsx              # Tag chip with delete (context-aware)
│   ├── EditDeleteButtons.tsx    # Owner-only edit/delete buttons
│   ├── Searchbar.tsx            # Global searchbar
│   ├── ProfileLink.tsx          # Portfolio link display
│   └── Theme/
│       └── theme-provider.tsx   # next-themes ThemeProvider wrapper
│
├── actions/                     # Next.js Server Actions ("use server")
│   ├── Question.ts              # AskQuestion, EditQuestion, DeleteQuestion
│   ├── answer.ts                # AddAnswer, DeleteAnswer
│   ├── upvote.ts                # UpvoteQuestionAnswer, DeleteUpvote
│   ├── downvote.ts              # DownvoteQuestionAnswer, DeleteDownvote
│   ├── collection.ts            # AddToCollection, DeleteCollection
│   ├── user.ts                  # createUser, updateUser, DeleteUser
│   ├── Tag.ts                   # AddTag, DeleteTag
│   ├── FetchQuestion.ts         # Client-side filter/sort logic
│   ├── FetchAnswers.ts          # Answer fetching helper
│   └── FetchUser.ts             # User fetching helper
│
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── utils.ts                 # cn(), getTimestamp(), formatAndDivideNumber(), URL query helpers
│   └── validation.ts            # Zod schemas: QuestionsSchema, AnswerSchema, ProfileSchema
│
├── constants/
│   ├── index.ts                 # sidebarLinks[] — nav items with icons
│   ├── filters.ts               # HomePageFilters, AnswerFilters, UserFilters, CollectionFilters
│   └── tags.ts                  # Predefined tag suggestions
│
├── prisma/
│   ├── schema.prisma            # Full DB schema (7 models)
│   └── migrations/              # Prisma migration history
│
├── styles/
│   ├── prism.css                # PrismJS syntax highlighting styles
│   └── theme.css                # CSS custom properties for dark/light theme
│
├── public/
│   └── assets/icons/            # SVG icons (upvote, downvote, star, search, etc.)
│
├── middleware.ts                # Clerk auth middleware (protects all routes)
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind theme tokens, dark mode config
├── prisma.config.ts             # Prisma config (env loading)
├── tsconfig.json                # TypeScript paths (@/ alias)
└── .env                         # Environment variables (not committed)
```

---

## Database Schema (Prisma + MySQL)

Seven models, all relationships using cascade deletes:

```prisma
model user {
  id               String   @id @default(cuid())
  userId           String   @unique   // Clerk's user ID
  name             String
  userName         String
  imageUrl         String
  email            String
  bio              String?
  portfolioWebsite String?
  points           Int      @default(0)   // Reputation system
  questions        question[]
  collection       collection[]
  upvotes          upvote[]
  downvotes        downvote[]
  tags             tag[]
  answer           answer[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model question {
  id          String     @id @default(cuid())
  title       String
  explanation String     @db.LongText   // TinyMCE HTML stored here
  userId      String
  user        user       @relation(...)
  saves       collection[]
  upvotes     upvote[]
  downvotes   downvote[]
  tags        tag[]
  answer      answer[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model answer { ... }       // Linked to question + user, has votes
model collection { ... }   // Junction: user saves a question
model upvote { ... }       // Polymorphic: can target question OR answer
model downvote { ... }     // Polymorphic: can target question OR answer
model tag { ... }          // Dual-purpose: attached to question OR user profile
```

### Key Design Decisions
- **Polymorphic votes**: `upvote` and `downvote` each have nullable `questionId` and `answerId` — one record type handles voting on both entities
- **Dual-purpose tags**: `tag` rows with `questionId = null` are the user's personal interest tags (shown in right sidebar). Tags with a `questionId` belong to a question
- **Points system**: +5 for asking, +10 for answering — tracked on the `user.points` field and incremented atomically

---

## How It Works — Data Flow

### 1. Authentication Flow
```
User visits site
  → Clerk Middleware (middleware.ts) checks session
  → If unauthenticated: redirected to /sign-in (Clerk-hosted UI)
  → On first sign-up: Clerk fires webhook → POST /api/clerk
  → Webhook handler creates user row in MySQL via Prisma
  → User is now synced between Clerk and the DB
```

### 2. Ask a Question
```
User fills AskEditQuestion form
  → Title (Input) + Explanation (TinyMCE rich editor) + Tags (TagInput chips)
  → Zod validates: title 5–130 chars, explanation ≥ 100 chars
  → On submit: AskQuestion() server action runs
  → Upserts user record if not yet in DB (edge case for local dev)
  → Creates question row + tag rows in DB
  → Awards +5 points to user
  → revalidatePath("/", "layout") purges Next.js cache
  → Redirects to home feed
```

### 3. Home Feed with Filters
```
GET / (with optional ?filter=recommended&q=search&page=2)
  → Server Component fetches questions from DB with Prisma:
      - Pagination: skip = 10 * page, take = 10
      - Search: title contains searchParams.q
      - Order: newest → createdAt desc, else asc
  → FetchQuestion() server action applies additional sorting:
      - "recommended" → questions matching user's personal tags first
      - "upvotes"     → sorted by upvote count desc
      - "unanswered"  → sorted by answer count asc
      - "newest"      → returned as-is (DB already sorted)
  → Renders QuestionCard list + Pagination
```

### 4. Question Detail Page
```
GET /question/[id]
  → Fetches question (with tags, answers, votes, user) via Prisma
  → Fetches paginated answers (10/page, filterable by recent/old)
  → Renders: author info → Votes component → ParseHTML (TinyMCE content)
              → Tags → AllAnswers → UserAnswer (submit form)
```

### 5. Voting System
```
User clicks upvote on a question/answer
  → Votes.tsx (client component) calls server action via useTransition
  → If already upvoted → DeleteUpvote (toggle off)
  → If downvoted first → DeleteDownvote + UpvoteQuestionAnswer (switch)
  → Else → UpvoteQuestionAnswer (new upvote)
  → revalidatePath triggers re-render with updated counts
  → sonner toast shown for feedback
```

### 6. AI StudyGuru (Gemini 2.5 Flash)
```
User types question in AskStudyGuru textarea
  → Form submits to /api/gemini (Next.js API Route)
  → Server reads GEMINI_API_KEY from env
  → POST to: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
  → Request body: { contents: [{ role: "user", parts: [{ text: question }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 8000 } }
  → Response extracted from candidates[0].content.parts
  → Returned to client as { answer: "..." }
  → marked.parse() converts Markdown → HTML
  → ParseHTML component renders it with code highlighting
```

### 7. User Sync via Clerk Webhooks
```
POST /api/clerk (svix-verified webhook)
  → user.created  → createUser() in DB
  → user.updated  → updateUser() with new name/image/email
  → user.deleted  → DeleteUser() cascades all their data
```

---

## Core Components Explained

### `AskEditQuestion.tsx`
The unified form used for both **creating** and **editing** questions. Detects mode via the presence of an existing `question` prop.
- Uses **TinyMCE** rich editor with theme-aware skin (`oxide` / `oxide-dark`)
- Plugins: anchor, autolink, codesample, image, link, lists, table, wordcount
- Forces LTR direction to prevent RTL rendering bugs
- Integrates `react-tag-input` for the tag chips field
- Validates via `QuestionsSchema` (Zod)

### `Votes.tsx`
Client component with `useTransition` for non-blocking vote actions.
- Handles upvote, downvote, and save (collection) for both `question` and `answer` types
- Mutual exclusivity: switching from downvote to upvote removes the downvote first
- Displays `formatAndDivideNumber()` counts (e.g., `1.2K`)
- Save icon toggles between star-filled and star-red

### `ParseHTML.tsx`
Safely renders TinyMCE-stored HTML using `html-react-parser`. Applies PrismJS for code block syntax highlighting after render.

### `LeftSidebar.tsx`
Sticky sidebar with active route detection. Profile link dynamically injects the Clerk `userId`. Shows Sign In / Sign Up buttons when unauthenticated.

### `RightSidebar.tsx`
Shows user's personal tags (fetched server-side). Users can add/delete interest tags that drive the "Recommended" filter algorithm.

### `FetchQuestion.ts` — The Recommendation Engine
```typescript
// Marks each question with whether it matches user's personal tags
const enhancedQuestions = questions.map(q => ({
  ...q,
  hasUserTags: q.tags.some(t => userTagNames.includes(t.tag))
}));

// "recommended" filter: user-tag-matched questions bubble to top
sortedQuestions = enhanced.sort((a, b) => {
  if (a.hasUserTags && !b.hasUserTags) return -1;
  if (!a.hasUserTags && b.hasUserTags) return 1;
  return 0;
});
```

---

## Zod Validation Schemas

```typescript
// lib/validation.ts

QuestionsSchema = {
  title:       z.string().min(5).max(130),
  explanation: z.string().min(100),        // Forces detailed questions
  tags:        z.object({ id, text }).array()
}

AnswerSchema = {
  answer: z.string().min(100)              // Forces detailed answers
}

ProfileSchema = {
  name:             z.string().min(5).max(50),
  userName:         z.string().min(5).max(50),
  bio:              z.string().min(10).max(150),
  portfolioWebsite: z.string().url()
}
```

---

## API Routes

### `POST /api/gemini`
Proxies requests to Google Gemini 2.5 Flash API.

| Field | Value |
|---|---|
| Method | POST |
| Body | `{ question: string }` |
| Response | `{ answer: string }` |
| Model | `gemini-2.5-flash` |
| Temperature | 0.3 (focused, factual) |
| Max tokens | 8000 |

### `POST /api/clerk`
Clerk webhook endpoint, verified with Svix signature.

| Event | Action |
|---|---|
| `user.created` | Creates user row in DB |
| `user.updated` | Updates name, email, imageUrl |
| `user.deleted` | Cascades deletion of all user data |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (MySQL connection string)
DATABASE_URL="mysql://user:password@host:3306/dbname"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Clerk Webhook (from Clerk Dashboard → Webhooks)
WEBHOOK_SECRET=whsec_...

# Google Gemini AI
GEMINI_API_KEY=AIza...

# TinyMCE Editor
NEXT_PUBLIC_TINY_EDITOR_API_KEY=your_tinymce_api_key
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database (local or hosted — PlanetScale, Railway, etc.)
- Clerk account (free tier)
- Google AI Studio API key (Gemini)
- TinyMCE account (free tier)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd studyBlog

# 2. Install dependencies (also runs `prisma generate` via postinstall)
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in all values in .env

# 4. Push schema to database
npx prisma db push

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Setting Up Clerk Webhooks (for user sync)
1. Go to [Clerk Dashboard](https://clerk.com) → Your App → Webhooks
2. Add endpoint: `https://your-domain.com/api/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Copy the **Signing Secret** → set as `WEBHOOK_SECRET` in `.env`
5. For local dev, use [ngrok](https://ngrok.com) to expose localhost

---

## NPM Scripts

```bash
npm run dev        # Start development server (next dev)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
```

`postinstall` automatically runs `prisma generate` after every `npm install`.

---

## Use Cases

- **Students** asking programming questions and getting community answers
- **Developers** sharing knowledge and building reputation
- **Learners** using the AI assistant (StudyGuru) to get instant explanations
- **Communities** running their own private Q&A platform
- **Educators** creating a structured question bank with tagging

---

## Page Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home feed with all questions, search, filters, pagination |
| `/question/[id]` | Public | Full question detail, all answers, voting, answer form |
| `/askQuestion` | Auth required | Create a new question (TinyMCE editor) |
| `/ask-studyGuru` | Auth required | AI chat with Gemini 2.5 Flash |
| `/collection` | Auth required | User's saved/bookmarked questions |
| `/community` | Public | All registered users |
| `/profile/[id]` | Public | User profile with questions, answers, tags, points |
| `/profile/edit` | Auth required | Edit own profile (bio, portfolio, username) |
| `/sign-in` | Guest only | Clerk-hosted sign-in |
| `/sign-up` | Guest only | Clerk-hosted sign-up |

---

## Gamification — Points System

| Action | Points Awarded |
|---|---|
| Ask a question | +5 points |
| Submit an answer | +10 points |

Points are stored on the `user.points` field and displayed on the public profile page, creating motivation for engagement.

---

## Design System

- **Fonts**: Inter (body) + Space Grotesk (headings) via `next/font/google`
- **Colors**: Custom CSS variables in `styles/theme.css` — separate light/dark palettes
- **Dark Mode**: System-aware default, stored in `localStorage` as `wcomblog`, togglable from header
- **Tailwind**: Extended with custom color tokens (`primary-500`, `dark-100` to `dark-500`, `light-700` to `light-900`), custom utilities (`flex-center`, `flex-between`, `card-wrapper`, `primary-gradient`, `dark-gradient`)
- **Components**: shadcn/ui primitives (Button, Form, Input, Textarea, Dialog, Select, Tabs, Toast, DropdownMenu, Menubar)

---

## Security

- **All routes protected** by Clerk middleware — unauthenticated users are redirected to sign-in for any page
- **Server Actions validate ownership** — `EditQuestion`, `DeleteQuestion` check that `userId === currentUser.id`
- **Webhook signature verified** via Svix HMAC before processing any Clerk events
- **Gemini API key** never exposed to client — all AI calls go through the `/api/gemini` server-side proxy
- **Cascade deletes** ensure no orphaned data when users or questions are deleted

---

## Key Dependencies Summary

```json
{
  "next": "14.2.5",
  "@clerk/nextjs": "^5.7.5",
  "@prisma/client": "^6.18.0",
  "@tinymce/tinymce-react": "^5.1.1",
  "marked": "^17.0.1",
  "react-hook-form": "^7.52.1",
  "zod": "^3.23.8",
  "next-themes": "^0.3.0",
  "sonner": "^1.5.0",
  "svix": "^1.81.0",
  "html-react-parser": "^5.1.10",
  "prismjs": "^1.29.0",
  "query-string": "^9.0.0",
  "tailwindcss": "^3.4.1"
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with  using Next.js 14, Prisma, Clerk, and Google Gemini AI</p>
