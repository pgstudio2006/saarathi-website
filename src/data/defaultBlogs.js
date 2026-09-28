// Seed content for the blog system.
//
// The 9 original hand-written articles used to live in a separate static page
// (ArticlePage) that the admin panel could not see, edit, unpublish or delete.
// They are converted here into the same "blog" shape the admin publishes, so
// they are seeded into storage on first run and become fully manageable.
import { articles } from './articles.js'

const toBlog = (a) => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  tag: a.tag,
  readTime: a.readTime,
  date: a.date,
  featured: Boolean(a.featured),
  color: a.color,
  bg: a.bg,
  published: true,
  blocks: [
    { type: 'text', html: true, value: `<p>${a.intro}</p>` },
    ...a.sections.flatMap((s) => [
      ...(s.heading ? [{ type: 'heading', value: s.heading }] : []),
      { type: 'text', html: true, value: s.paragraphs.map((p) => `<p>${p}</p>`).join('') },
    ]),
    { type: 'heading', value: a.keyPointsTitle },
    { type: 'text', html: true, value: `<ul>${a.keyPoints.map((k) => `<li>${k}</li>`).join('')}</ul>` },
    { type: 'text', html: true, value: `<blockquote><p>${a.closing}</p></blockquote>` },
  ],
})

export const defaultBlogs = articles.map(toBlog)

export const DEFAULT_CATEGORIES = [...new Set(articles.map((a) => a.tag))]
