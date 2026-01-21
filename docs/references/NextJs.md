# Next.js Cheat Sheet - Beginner to Pro

## Table of Contents
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Pages & Layouts](#pages--layouts)
- [Server Components](#server-components)
- [Client Components](#client-components)
- [Data Fetching](#data-fetching)
- [Dynamic Routes](#dynamic-routes)
- [API Routes](#api-routes)
- [Middleware](#middleware)
- [Image Optimization](#image-optimization)
- [Font Optimization](#font-optimization)
- [Metadata & SEO](#metadata--seo)
- [Styling](#styling)
- [Static Assets](#static-assets)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Loading States](#loading-states)
- [Redirects & Rewrites](#redirects--rewrites)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Best Practices](#best-practices)

---

## Setup & Installation

### Create New App
```bash
# Create Next.js app
npx create-next-app@latest my-app

# With TypeScript
npx create-next-app@latest my-app --typescript

# Interactive setup
npx create-next-app@latest
# Choose: TypeScript, ESLint, Tailwind CSS, App Router, etc.
```

### Manual Installation
```bash
npm install next@latest react@latest react-dom@latest

# package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## Project Structure

### App Router Structure (Next.js 13+)
```
my-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Loading UI
│   ├── error.tsx           # Error UI
│   ├── not-found.tsx       # 404 page
│   ├── about/
│   │   └── page.tsx        # /about
│   ├── blog/
│   │   ├── page.tsx        # /blog
│   │   └── [slug]/
│   │       └── page.tsx    # /blog/:slug
│   └── api/
│       └── route.ts        # API endpoint
├── components/
│   └── Header.tsx
├── lib/
│   └── utils.ts
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Routing

### File-Based Routing
```tsx
// app/page.tsx → /
export default function Home() {
  return <h1>Home Page</h1>
}

// app/about/page.tsx → /about
export default function About() {
  return <h1>About Page</h1>
}

// app/blog/page.tsx → /blog
export default function Blog() {
  return <h1>Blog</h1>
}

// app/blog/[slug]/page.tsx → /blog/:slug
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}
```

### Navigation
```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  
  return (
    <nav>
      {/* Link component */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => router.push('/dashboard')}>
        Dashboard
      </button>
      
      {/* With query params */}
      <Link href="/search?q=nextjs">Search</Link>
      
      {/* Replace history */}
      <button onClick={() => router.replace('/login')}>
        Login
      </button>
      
      {/* Go back */}
      <button onClick={() => router.back()}>Back</button>
    </nav>
  )
}
```

---

## Pages & Layouts

### Root Layout
```tsx
// app/layout.tsx
export const metadata = {
  title: 'My App',
  description: 'Description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>Header</header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}
```

### Nested Layouts
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <div>{children}</div>
    </div>
  )
}
```

### Page Component
```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Home page content</p>
    </div>
  )
}
```

---

## Server Components

### Basic Server Component
```tsx
// app/posts/page.tsx (Server Component by default)
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

### Server Component Features
```tsx
// Direct database access
import { db } from '@/lib/db'

export default async function UsersPage() {
  const users = await db.user.findMany()
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// Access environment variables securely
export default async function ServerPage() {
  const apiKey = process.env.SECRET_API_KEY // Only on server
  const data = await fetch(`https://api.example.com?key=${apiKey}`)
  
  return <div>{/* Render data */}</div>
}
```

---

## Client Components

### Creating Client Components
```tsx
'use client' // Mark as client component

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### Interactive Features
```tsx
'use client'

import { useEffect, useState } from 'react'

export default function InteractiveComponent() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Browser APIs
    console.log(window.innerWidth)
    
    // Event listeners
    const handleResize = () => {
      console.log('Resized')
    }
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  if (!mounted) return null
  
  return <div>Interactive Content</div>
}
```

### Composing Server & Client Components
```tsx
// app/page.tsx (Server Component)
import ClientCounter from '@/components/ClientCounter'

async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  
  return (
    <div>
      <h1>{data.title}</h1>
      {/* Client component for interactivity */}
      <ClientCounter initialCount={data.count} />
    </div>
  )
}
```

---

## Data Fetching

### Server-Side Fetching
```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // SSR - always fresh
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

### Static Site Generation (SSG)
```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // SSG - cached at build time
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

### Incremental Static Regeneration (ISR)
```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

### Parallel Data Fetching
```tsx
// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user')
  return res.json()
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function Dashboard() {
  // Fetch in parallel
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts()
  ])
  
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      {/* Render posts */}
    </div>
  )
}
```

### Sequential Data Fetching
```tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
}

async function getUserPosts(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}/posts`)
  return res.json()
}

export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  const posts = await getUserPosts(user.id) // Wait for user first
  
  return (
    <div>
      <h1>{user.name}</h1>
      {/* Render posts */}
    </div>
  )
}
```

---

## Dynamic Routes

### Dynamic Segments
```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}
```

### Multiple Dynamic Segments
```tsx
// app/shop/[category]/[product]/page.tsx
export default function Product({
  params
}: {
  params: { category: string; product: string }
}) {
  return (
    <div>
      <p>Category: {params.category}</p>
      <p>Product: {params.product}</p>
    </div>
  )
}
```

### Catch-All Segments
```tsx
// app/docs/[...slug]/page.tsx
// Matches /docs/a, /docs/a/b, /docs/a/b/c
export default function Docs({ params }: { params: { slug: string[] } }) {
  return <h1>Docs: {params.slug.join('/')}</h1>
}
```

### Optional Catch-All Segments
```tsx
// app/docs/[[...slug]]/page.tsx
// Matches /docs, /docs/a, /docs/a/b
export default function Docs({
  params
}: {
  params: { slug?: string[] }
}) {
  return <h1>Docs: {params.slug?.join('/') || 'Home'}</h1>
}
```

### Generate Static Params
```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json())
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}
```

---

## API Routes

### Basic API Route
```tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

### Route Handlers
```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  // Fetch user
  const user = await db.user.findUnique({ where: { id } })
  
  return NextResponse.json(user)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Create user
  const user = await db.user.create({ data: body })
  
  return NextResponse.json(user, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  
  // Update user
  const user = await db.user.update({
    where: { id: body.id },
    data: body
  })
  
  return NextResponse.json(user)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  await db.user.delete({ where: { id } })
  
  return NextResponse.json({ message: 'Deleted' })
}
```

### Dynamic API Routes
```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  })
  
  return NextResponse.json(user)
}
```

---

## Middleware

### Basic Middleware
```tsx
// middleware.ts (root level)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add custom header
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'my-value')
  
  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

### Authentication Middleware
```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## Image Optimization

### Next.js Image Component-
```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/profile.jpg"
        alt="Profile"
        width={500}
        height={500}
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Remote"
        width={500}
        height={500}
      />
      
      {/* Fill container */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/hero.jpg"
          alt="Hero"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Priority loading */}
      <Image
        src="/important.jpg"
        alt="Important"
        width={500}
        height={500}
        priority
      />
    </div>
  )
}
```

### Configure Remote Domains
```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}
```

---

## Font Optimization

### Google Fonts
```tsx
// app/layout.tsx
import { Inter, Roboto } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Local Fonts
```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './fonts/MyFont.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Metadata & SEO

### Static Metadata
```tsx
// app/page.tsx
export const metadata = {
  title: 'Home',
  description: 'Welcome to my website',
  keywords: ['next.js', 'react', 'seo'],
}

export default function Home() {
  return <h1>Home Page</h1>
}
```

### Dynamic Metadata
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return <article>{/* Post content */}</article>
}
```

### Advanced Metadata
```tsx
export const metadata = {
  title: {
    default: 'My App',
    template: '%s | My App', // %s is replaced with page title
  },
  description: 'My app description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [
      {
        url: 'https://myapp.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@myapp',
    creator: '@creator',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

---

## Styling

### Global CSS
```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### CSS Modules
```tsx
// app/page.tsx
import styles from './page.module.css'

export default function Page() {
  return <div className={styles.container}>Content</div>
}
```

### Tailwind CSS
```tsx
// app/page.tsx
export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Title</h1>
      <p className="text-gray-600">Content</p>
    </div>
  )
}
```

---

## Static Assets

### Public Folder
```tsx
// Files in /public are accessible from /
export default function Page() {
  return (
    <div>
      <img src="/logo.png" alt="Logo" />
      <link rel="icon" href="/favicon.ico" />
    </div>
  )
}
```

---

## Environment Variables

### Environment Files
```bash
# .env.local
DATABASE_URL=postgres://...
API_KEY=secret123

# .env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Using Environment Variables
```tsx
// Server components only
const apiKey = process.env.API_KEY

// Client components (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

---

## Error Handling

### Error Boundary
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found
```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  )
}

// Trigger not found programmatically
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  
  if (!user) {
    notFound()
  }
  
  return <div>{user.name}</div>
}
```

---

## Loading States

### Loading UI
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div>
      <p>Loading dashboard...</p>
      <Spinner />
    </div>
  )
}
```

### Streaming with Suspense
```tsx
// app/page.tsx
import { Suspense } from 'react'

async function Posts() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}

export default function Page() {
  return (
    <div>
      <h1>My App</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

---

## Redirects & Rewrites

### Configuration
```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },
}
```

### Programmatic Redirects
```tsx
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return <div>Dashboard</div>
}
```

---

## Authentication

### Basic Auth Pattern
```tsx
// lib/auth.ts
import { cookies } from 'next/headers'

export async function getSession() {
  const token = cookies().get('token')?.value
  if (!token) return null
  
  // Verify token and return user
  const user = await verifyToken(token)
  return user
}

// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function Dashboard() {
  const user = await getSession()
  
  if (!user) {
    redirect('/login')
  }
  
  return <div>Welcome {user.name}</div>
}
```

---

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables
```bash
# Set environment variables in Vercel dashboard
# or use vercel env command
vercel env add
```

---

## Best Practices

### Server vs Client Components
```tsx
// ✅ Good: Keep components as Server Components by default
export default async function Page() {
  const data = await getData()
  return <div>{data}</div>
}

// ✅ Good: Use Client Components only when needed
'use client'
export default function Interactive() {
  const [state, setState] = useState(0)
  return <button onClick={() => setState(s => s + 1)}>{state}</button>
}

// ❌ Bad: Unnecessary Client Component
'use client'
export default function Static() {
  return <div>Static content</div> // No need for client
}
```

### Data Fetching Patterns
```tsx
// ✅ Good: Fetch at the component level
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <div>{user.name}</div>
}

// ✅ Good: Parallel fetching
const [users, posts] = await Promise.all([getUsers(), getPosts()])

// ❌ Bad: Sequential fetching when parallel is possible
const users = await getUsers()
const posts = await getPosts() // Could be parallel
```

### Caching Strategy
```tsx
// SSG: Static, regenerate on deploy
fetch(url, { cache: 'force-cache' })

// ISR: Static, regenerate periodically
fetch(url, { next: { revalidate: 3600 } })

// SSR: Dynamic, always fresh
fetch(url, { cache: 'no-store' })

// On-demand revalidation
import { revalidatePath, revalidateTag } from 'next/cache'
revalidatePath('/posts')
revalidateTag('posts')
```

### Image Optimization
```tsx
// ✅ Good: Use Image component
<Image src="/photo.jpg" alt="Photo" width={500} height={500} />

// ✅ Good: Set priority for above-the-fold images
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

// ❌ Bad: Regular img tag
<img src="/photo.jpg" alt="Photo" />
```

### Metadata
```tsx
// ✅ Good: Define metadata for SEO
export const metadata = {
  title: 'My Page',
  description: 'Description',
  openGraph: {
    images: ['/og-image.jpg'],
  },
}

// ✅ Good: Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.id)
  return { title: post.title }
}
```

### Code Organization
```
app/
├── (auth)/           # Route group (doesn't affect URL)
│   ├── login/
│   └── register/
├── (marketing)/
│   ├── about/
│   └── contact/
├── dashboard/
│   ├── layout.tsx    # Dashboard layout
│   ├── page.tsx
│   └── settings/
└── api/
```

---

**Pro Tip:** Embrace Server Components as the default, use Client Components sparingly, leverage streaming for better UX, implement proper caching strategies, and optimize images with the Image component!