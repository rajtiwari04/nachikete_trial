import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import { galleryAPI } from '@/lib/api';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
    transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);
const CATS = ['all','awareness','cultural','wellbeing','sessions','community','other'];

export default function GalleryPage() {
  const [category, setCategory] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ['gallery', category],
    queryFn: () => galleryAPI.getAll(category !== 'all' ? { category } : {}),
  });
  const images = data?.data?.images || [];

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => (i > 0 ? i - 1 : images.length - 1));
  const nextImg = () => setLightbox(i => (i < images.length - 1 ? i + 1 : 0));

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="Nachiketa Gallery | Awareness, Cultural & Community Moments"
        description="Snapshots from awareness sessions, cultural activities, workshops, conversations, celebrations and moments shared by our community."
        slug="/gallery"
      />

      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp>
            <p className="section-label">COMMUNITY MOMENTS</p>
            <h1 className="section-title">Life at Nachiketa</h1>
            <p className="section-subtitle">Snapshots from awareness sessions, cultural activities, workshops, conversations, celebrations and moments shared by our community.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCategory(c)} className={"px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all " + (category===c ? 'bg-indigo-500 text-white border-indigo-500 shadow-soft-sm' : 'bg-surface border-border text-text-secondary hover:border-indigo-200 hover:text-indigo-600')}>
              {c==='all'?'All':c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(12)].map((_,i)=><div key={i} className="skeleton aspect-square rounded-xl"/>)}
          </div>
        ) : images.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img,i)=>(
              <motion.div key={img._id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.03}}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl" onClick={()=>openLightbox(i)}>
                <img src={img.thumbnailUrl||img.imageUrl} alt={img.title ? `Students participating in ${img.title} - Nachiketa Awareness Society` : 'Students participating in a Nachiketa Awareness Society program'} className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-xl flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs font-medium truncate">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border">
            <ImageIcon size={36} className="text-indigo-200 mx-auto mb-3"/>
            <p className="text-text-muted">No images found in this category.</p>
          </div>
        )}
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={24}/></button>
            <button onClick={(e)=>{e.stopPropagation();prevImg();}} className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronLeft size={28}/></button>
            <motion.img key={lightbox} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
              src={images[lightbox]?.imageUrl} alt={images[lightbox]?.title || 'Nachiketa Gallery Image'}
              className="max-h-[85vh] max-w-full object-contain rounded-xl" onClick={e=>e.stopPropagation()}/>
            <button onClick={(e)=>{e.stopPropagation();nextImg();}} className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-lg transition-colors"><ChevronRight size={28}/></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">{lightbox+1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
