import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, BookOpen } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import { blogsAPI } from '@/lib/api';
import { format } from 'date-fns';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data, isLoading, error } = useQuery({ queryKey: ['blog', slug], queryFn: () => blogsAPI.getOne(slug) });
  const blog = data?.data?.blog;

  if (isLoading) return (
    <div className="container-md section animate-pulse space-y-4">
      <div className="skeleton h-8 w-3/4 rounded"/><div className="skeleton h-64 rounded-2xl"/><div className="space-y-2">{[...Array(6)].map((_,i)=><div key={i} className="skeleton h-4 rounded"/>)}</div>
    </div>
  );
  if (error||!blog) return (
    <div className="container-md section text-center py-20">
      <BookOpen size={40} className="text-indigo-200 mx-auto mb-4"/>
      <h2 className="text-xl font-bold text-text-primary mb-2">Article not found</h2>
      <Link to="/blogs" className="btn-primary mt-4">Browse all articles</Link>
    </div>
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const articleSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt,
      image: blog.coverImage,
      datePublished: blog.publishedAt,
      author: {
        '@type': 'Person',
        name: blog.author?.name || 'Nachiketa Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Nachiketa Awareness Society',
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/src/assets/nachiketa-logo.jpeg`,
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin || '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blogs` },
        { '@type': 'ListItem', position: 3, name: blog.title, item: `${origin}/blogs/${blog.slug}` },
      ],
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title={`${blog.title} | Nachiketa Blog`}
        description={blog.excerpt || `Read ${blog.title} on Nachiketa Awareness Society Blog.`}
        image={blog.coverImage || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'}
        type="article"
        slug={`/blogs/${blog.slug}`}
        schema={articleSchema}
      />

      <div className="border-b border-border bg-cream-50/50 py-3">
        <div className="container-md px-4 flex items-center gap-2 text-xs text-text-muted">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blogs" className="hover:text-indigo-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-none">{blog.title}</span>
        </div>
      </div>
      {blog.coverImage && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <motion.img initial={{scale:1.05,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.8}}
            src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover"/>
        </div>
      )}
      <div className="container-sm section">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="badge-indigo capitalize">{blog.category}</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><Clock size={11}/>{blog.readTime} min read</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-6">{blog.title}</h1>
          <div className="flex items-center gap-4 pb-6 mb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">{blog.author?.name?.[0]||'N'}</div>
              <div><p className="text-sm font-medium text-text-primary">{blog.author?.name||'Nachiketa'}</p><p className="text-xs text-text-muted">Author</p></div>
            </div>
            {blog.publishedAt && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted ml-auto">
                <Calendar size={12}/>{format(new Date(blog.publishedAt),'MMMM d, yyyy')}
              </div>
            )}
          </div>
          <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-line text-base">
            {blog.content}
          </div>
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              {blog.tags.map(tag=>(
                <span key={tag} className="badge-gray text-xs"># {tag}</span>
              ))}
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-border">
            <Link to="/blogs" className="btn-secondary gap-2"><ArrowLeft size={14}/> All articles</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
