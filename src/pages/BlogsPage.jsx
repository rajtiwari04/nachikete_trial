import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, ArrowRight, Tag } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import { blogsAPI } from '@/lib/api';
import { format } from 'date-fns';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
    transition={{duration:0.55,delay,ease:[0.16,1,0.3,1]}} className={className}>{children}</motion.div>
);
const CATS = ['all', 'awareness', 'wellbeing', 'rights', 'self-discovery', 'society', 'tips'];
const CAT_COLORS = {
  awareness: 'badge-indigo', wellbeing: 'badge-rose', rights: 'badge-lavender',
  'self-discovery': 'badge-amber', society: 'badge-green', tips: 'badge-amber', other: 'badge-gray'
};

function BlogCard({ blog, delay }) {
  return (
    <FadeUp delay={delay}>
      <Link to={`/blogs/${blog.slug}`} className="group block card-hover p-0 overflow-hidden h-full flex flex-col">
        <div className="h-48 bg-gradient-to-br from-indigo-50 to-lavender-50 overflow-hidden flex-shrink-0">
          {blog.coverImage
            ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
            : <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-indigo-200"/></div>
          }
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={CAT_COLORS[blog.category]||"badge-gray"}>{blog.category}</span>
            <span className="flex items-center gap-1 text-xs text-text-muted"><Clock size={11}/>{blog.readTime} min read</span>
          </div>
          <h3 className="font-bold text-text-primary line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors leading-snug flex-1">{blog.title}</h3>
          {blog.excerpt && <p className="text-sm text-text-muted line-clamp-2 mb-4">{blog.excerpt}</p>}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {blog.author?.name?.[0]||'N'}
              </div>
              <span className="text-xs text-text-muted">{blog.author?.name||'Nachiketa'}</span>
            </div>
            <span className="text-xs text-text-muted">{blog.publishedAt ? format(new Date(blog.publishedAt),'MMM d, yyyy') : ''}</span>
          </div>
        </div>
      </Link>
    </FadeUp>
  );
}

function FeaturedBlog({ blog }) {
  return (
    <FadeUp>
      <Link to={`/blogs/${blog.slug}`} className="group block">
        <div className="card-hover p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-auto bg-gradient-to-br from-indigo-50 to-lavender-50 overflow-hidden">
              {blog.coverImage
                ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                : <div className="w-full h-full flex items-center justify-center"><BookOpen size={48} className="text-indigo-200"/></div>
              }
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-indigo">Featured</span>
                <span className={CAT_COLORS[blog.category]||"badge-gray"}>{blog.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-indigo-600 transition-colors leading-snug">{blog.title}</h2>
              {blog.excerpt && <p className="text-text-secondary text-sm leading-relaxed mb-5">{blog.excerpt}</p>}
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Clock size={11}/>{blog.readTime} min read</span>
                <span>{blog.publishedAt ? format(new Date(blog.publishedAt),'MMM d, yyyy') : ''}</span>
              </div>
              <span className="mt-5 text-indigo-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Read article <ArrowRight size={13}/></span>
            </div>
          </div>
        </div>
      </Link>
    </FadeUp>
  );
}

export default function BlogsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const params = { page, limit: 9, ...(search?{search}:{}), ...(category!=='all'?{category}:{}) };
  const { data, isLoading } = useQuery({ queryKey: ['blogs', params], queryFn: () => blogsAPI.getAll(params), keepPreviousData: true });
  const { data: featuredData } = useQuery({ queryKey: ['blogs-featured'], queryFn: () => blogsAPI.getAll({ featured: true, limit: 1 }) });

  const blogs = data?.data?.blogs || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;
  const featured = featuredData?.data?.blogs?.[0];

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="Nachiketa Blog | Awareness, Wellbeing & Student Growth"
        description="Articles, guides, awareness insights, and student perspectives from Nachiketa Awareness Society."
        slug="/blogs"
      />

      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp>
            <p className="section-label">AWARENESS & ARTICLES</p>
            <h1 className="section-title">Blog & Articles</h1>
            <p className="section-subtitle">Insights, self-discovery guides, rights awareness, wellbeing tips, and stories from the Nachiketa community.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        {featured && !search && category === 'all' && page === 1 && (
          <div className="mb-12"><FeaturedBlog blog={featured}/></div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search awareness articles..." className="input pl-9 text-sm"/>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map(c => (
            <button key={c} onClick={()=>{setCategory(c);setPage(1);}} className={"px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 " + (category===c ? 'bg-indigo-500 text-white border-indigo-500 shadow-soft-sm' : 'bg-surface border-border text-text-secondary hover:border-indigo-200 hover:text-indigo-600')}>
              {c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_,i)=><div key={i} className="card p-0 overflow-hidden animate-pulse"><div className="skeleton h-48 rounded-none"/><div className="p-5 space-y-2"><div className="skeleton h-3 w-1/4 rounded"/><div className="skeleton h-5 w-full rounded"/><div className="skeleton h-3 w-2/3 rounded"/></div></div>)}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog,i)=><BlogCard key={blog._id} blog={blog} delay={i*0.08}/>)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">← Prev</button>
                <span className="text-sm text-text-muted px-3">Page {page} of {totalPages}</span>
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border">
            <BookOpen size={36} className="text-indigo-200 mx-auto mb-3"/>
            <p className="text-text-secondary font-medium">No articles found</p>
            {search && <p className="text-sm text-text-muted mt-1">Try a different search term</p>}
          </div>
        )}
      </div>
    </div>
  );
}
