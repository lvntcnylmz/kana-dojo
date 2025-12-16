import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getBlogPost,
  getBlogPosts,
  generateBlogMetadata,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateHreflang,
  getPostLocales,
  BlogPostComponent,
  mdxComponents
} from '@/features/Blog';
import { StructuredData } from '@/shared/components/SEO/StructuredData';
import { routing, type Locale } from '@/core/i18n/routing';
import type { Locale as BlogLocale } from '@/features/Blog';

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Generate static params for all blog posts across all locales
 * Enables static generation at build time for optimal SEO
 *
 * _Requirements: 3.4_
 */
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  // Generate params for each locale
  for (const locale of routing.locales) {
    const posts = getBlogPosts(locale as BlogLocale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

/**
 * Generate SEO metadata from blog post frontmatter
 *
 * _Requirements: 4.1_
 */
export async function generateMetadata({
  params
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale as BlogLocale);

  if (!post) {
    return {
      title: 'Post Not Found | KanaDojo Blog',
      description: 'The requested blog post could not be found.'
    };
  }

  // Generate base metadata from post
  const metadata = generateBlogMetadata(post);

  // Add hreflang alternates for multi-locale posts
  const availableLocales = getPostLocales(slug);
  if (availableLocales.length > 1) {
    const hreflangTags = generateHreflang(slug, availableLocales);
    const languages: Record<string, string> = {};
    for (const tag of hreflangTags) {
      if (tag.hreflang !== 'x-default') {
        languages[tag.hreflang] = tag.href;
      }
    }
    metadata.alternates = {
      ...metadata.alternates,
      languages
    };
  }

  return metadata;
}

/**
 * Individual Blog Post Page
 * Renders a full blog post with MDX content, structured data,
 * and related posts. Uses static generation for optimal SEO.
 *
 * _Requirements: 3.1, 3.4, 4.1, 4.2, 4.3_
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale as BlogLocale);

  if (!post) {
    notFound();
  }

  // Generate structured data schemas
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema(post);

  // Get related posts metadata
  const relatedPostsMeta = post.relatedPosts
    ? getBlogPosts(locale as BlogLocale).filter(p =>
        post.relatedPosts?.includes(p.slug)
      )
    : [];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />

      {/* Blog Post Content */}
      <div className='mx-auto max-w-6xl px-4 py-8'>
        <BlogPostComponent post={post} relatedPosts={relatedPostsMeta}>
          {/* Render MDX content using ReactMarkdown */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Map heading elements to ensure proper hierarchy
              h1: ({ children }) => (
                <h2 className='mb-4 mt-8 text-2xl font-bold text-[var(--main-color)]'>
                  {children}
                </h2>
              ),
              h2: ({ children }) => (
                <h2
                  className='mb-4 mt-8 text-2xl font-bold text-[var(--main-color)]'
                  id={generateHeadingId(String(children))}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  className='mb-3 mt-6 text-xl font-semibold text-[var(--main-color)]'
                  id={generateHeadingId(String(children))}
                >
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4
                  className='mb-2 mt-4 text-lg font-medium text-[var(--main-color)]'
                  id={generateHeadingId(String(children))}
                >
                  {children}
                </h4>
              ),
              p: ({ children }) => (
                <p className='mb-4 leading-relaxed text-[var(--secondary-color)]'>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className='mb-4 list-disc space-y-2 pl-6 text-[var(--secondary-color)]'>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className='mb-4 list-decimal space-y-2 pl-6 text-[var(--secondary-color)]'>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className='leading-relaxed'>{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className='text-[var(--main-color)] underline hover:opacity-80'
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href?.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className='my-4 border-l-4 border-[var(--main-color)] pl-4 italic text-[var(--secondary-color)]'>
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className='rounded bg-[var(--card-color)] px-1.5 py-0.5 font-mono text-sm text-[var(--main-color)]'>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className='block overflow-x-auto rounded-lg bg-[var(--card-color)] p-4 font-mono text-sm'>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className='my-4 overflow-x-auto rounded-lg bg-[var(--card-color)] p-4'>
                  {children}
                </pre>
              ),
              hr: () => <hr className='my-8 border-[var(--border-color)]' />,
              table: ({ children }) => (
                <div className='my-4 overflow-x-auto'>
                  <table className='w-full border-collapse border border-[var(--border-color)]'>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className='border border-[var(--border-color)] bg-[var(--card-color)] px-4 py-2 text-left font-semibold text-[var(--main-color)]'>
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className='border border-[var(--border-color)] px-4 py-2 text-[var(--secondary-color)]'>
                  {children}
                </td>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </BlogPostComponent>
      </div>
    </>
  );
}

/**
 * Helper function to generate heading IDs for anchor links
 */
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
