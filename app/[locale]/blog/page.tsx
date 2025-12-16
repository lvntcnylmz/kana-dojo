import type { Metadata } from 'next';
import { getBlogPosts, BlogList } from '@/features/Blog';
import { routing, type Locale } from '@/core/i18n/routing';

/**
 * Generate static params for all supported locales
 * Enables static generation at build time for optimal SEO
 *
 * _Requirements: 2.4_
 */
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

/**
 * Generate SEO metadata for the blog listing page
 */
export const metadata: Metadata = {
  title: 'Blog - Japanese Learning Articles | KanaDojo',
  description:
    'Explore our collection of Japanese learning articles covering Hiragana, Katakana, Kanji, vocabulary, grammar, and Japanese culture. Free educational content for all levels.',
  openGraph: {
    title: 'Blog - Japanese Learning Articles | KanaDojo',
    description:
      'Explore our collection of Japanese learning articles covering Hiragana, Katakana, Kanji, vocabulary, grammar, and Japanese culture.',
    url: 'https://kanadojo.com/en/blog',
    type: 'website'
  },
  alternates: {
    canonical: 'https://kanadojo.com/en/blog'
  }
};

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Blog Listing Page
 * Displays all published blog posts sorted by date with category filtering.
 * Uses static generation for optimal SEO performance.
 *
 * _Requirements: 2.1, 2.4_
 */
export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  // Fetch all posts for the current locale
  const posts = getBlogPosts(locale as Locale);

  return (
    <div className='mx-auto max-w-6xl px-4 py-8'>
      {/* Page Header */}
      <header className='mb-8'>
        <h1 className='mb-4 text-3xl font-bold text-[var(--main-color)] md:text-4xl'>
          Blog
        </h1>
        <p className='text-lg text-[var(--secondary-color)]'>
          Explore our collection of Japanese learning articles covering
          Hiragana, Katakana, Kanji, vocabulary, grammar, and Japanese culture.
        </p>
      </header>

      {/* Blog List with Category Filter */}
      <BlogList posts={posts} showFilter={true} />
    </div>
  );
}
