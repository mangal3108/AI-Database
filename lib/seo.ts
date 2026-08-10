import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  path: string
  keywords?: string[]
  schema?: object
  image?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://internite.ai'
const SITE_NAME = 'Internite AI'
const DEFAULT_DESCRIPTION = 'AI-powered database intelligence. Connect your database, ask questions in natural language, and get instant answers with visualizations.'

export function generateSEO(config: SEOConfig): Metadata {
  const { title, description, path, keywords = [], image } = config

  const fullTitle = `${title} — ${SITE_NAME}`
  const url = `${BASE_URL}${path}`
  const ogImage = image || `${BASE_URL}/og-default.png`

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'database AI', 'natural language SQL', 'AI chatbot'].join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@interniteai',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [
    'https://twitter.com/interniteai',
    'https://github.com/interniteai',
    'https://linkedin.com/company/interniteai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@internite.ai',
  },
}

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Software Application Schema
export function softwareSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${BASE_URL}${path}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  }
}

// FAQ Schema
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Breadcrumb Schema
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Article Schema
export function articleSchema(
  title: string,
  description: string,
  publishDate: string,
  author: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishDate,
    dateModified: publishDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

// Database Integrations Schema
export function productSchema(name: string, description: string, path: string, category: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${BASE_URL}${path}`,
    category,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}
