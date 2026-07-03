import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
    transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await contactAPI.send(data);
      setSent(true);
      reset();
      toast.success('Message sent! We will get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp>
            <p className="section-label">Get in touch</p>
            <h1 className="section-title">Contact Us</h1>
            <p className="section-subtitle">Have a question, suggestion, or want to collaborate? We would love to hear from you.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <FadeUp>
              <div className="card">
                <h3 className="font-bold text-text-primary mb-5">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: 'hello@nachiketa.in', href: 'mailto:hello@nachiketa.in' },
                    { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                    { icon: MapPin, label: 'Address', value: 'Campus, Main Building, Room 101', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-indigo-500"/></div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
                        {href ? <a href={href} className="text-sm font-medium text-text-primary hover:text-indigo-600 transition-colors">{value}</a>
                          : <p className="text-sm font-medium text-text-primary">{value}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="card bg-gradient-to-br from-indigo-50 to-lavender-50 border-indigo-100">
                <h3 className="font-bold text-text-primary mb-2">Office Hours</h3>
                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex justify-between"><span>Monday - Friday</span><span className="font-medium">10AM - 5PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span className="font-medium">11AM - 2PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="text-text-muted">Closed</span></div>
                </div>
              </div>
            </FadeUp>
          </div>
          <div className="lg:col-span-3">
            <FadeUp delay={0.1}>
              {sent ? (
                <div className="card text-center py-16">
                  <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sage-100"><CheckCircle size={28} className="text-sage-500"/></div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Message received!</h2>
                  <p className="text-text-secondary text-sm mb-5">We will get back to you within 24-48 hours.</p>
                  <button onClick={()=>setSent(false)} className="btn-secondary">Send another message</button>
                </div>
              ) : (
                <div className="card">
                  <h3 className="font-bold text-text-primary mb-5">Send us a message</h3>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-group !mb-0">
                        <label className="label">Your name *</label>
                        <input {...register('name',{required:'Name is required'})} className={"input "+(errors.name?'input-error':'')} placeholder="Full name"/>
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                      </div>
                      <div className="form-group !mb-0">
                        <label className="label">Email address *</label>
                        <input {...register('email',{required:'Email is required'})} type="email" className={"input "+(errors.email?'input-error':'')} placeholder="you@example.com"/>
                        {errors.email && <p className="form-error">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="form-group !mb-0">
                      <label className="label">Phone number</label>
                      <input {...register('phone')} type="tel" className="input" placeholder="+91 98765 43210"/>
                    </div>
                    <div className="form-group !mb-0">
                      <label className="label">Subject *</label>
                      <input {...register('subject',{required:'Subject is required'})} className={"input "+(errors.subject?'input-error':'')} placeholder="What is this about?"/>
                      {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                    </div>
                    <div className="form-group !mb-0">
                      <label className="label">Message *</label>
                      <textarea {...register('message',{required:'Message is required',minLength:{value:20,message:'Message too short'}})} rows={5} className={"input resize-none "+(errors.message?'input-error':'')} placeholder="Tell us more..."/>
                      {errors.message && <p className="form-error">{errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 shadow-glow-indigo disabled:opacity-60 gap-2">
                      {isSubmitting ? 'Sending...' : <><Send size={15}/> Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
