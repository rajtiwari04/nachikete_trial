import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, CreditCard, User, CheckCircle, Clock, ArrowRight, Award, Zap } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { usersAPI, paymentsAPI, membershipAPI } from "@/lib/api";
import { format } from "date-fns";

const FadeUp = ({ children, delay=0, className="" }) => (
  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay}} className={className}>{children}</motion.div>
);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: profileData } = useQuery({ queryKey: ["my-profile"], queryFn: () => usersAPI.getProfile() });
  const { data: paymentsData } = useQuery({ queryKey: ["my-payments"], queryFn: () => paymentsAPI.history() });
  const { data: membershipData } = useQuery({ queryKey: ["my-membership"], queryFn: () => membershipAPI.myMembership() });

  const profile = profileData?.data?.user || user;
  const payments = paymentsData?.data?.payments || [];
  const membership = membershipData?.data?.membership;
  const registeredEvents = profile?.registeredEvents || [];

  const initials = profile?.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "U";

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-gradient-to-r from-indigo-50 to-lavender-50">
        <div className="container-lg px-4 py-8">
          <FadeUp className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-lavender-400 flex items-center justify-center shadow-soft-md">
              {profile?.avatar ? <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover"/> : <span className="text-white font-bold text-2xl">{initials}</span>}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Welcome, {profile?.name?.split(" ")[0]}!</h1>
              <p className="text-text-secondary text-sm">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {membership ? <span className="badge-indigo flex items-center gap-1"><Zap size={10}/>Member</span> : <span className="badge-gray">Free Account</span>}
                {profile?.isEmailVerified ? <span className="badge-green flex items-center gap-1"><CheckCircle size={10}/>Verified</span> : <span className="badge-amber">Unverified</span>}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="container-lg section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FadeUp delay={0.05}>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-text-primary flex items-center gap-2"><Calendar size={16} className="text-indigo-500"/>Registered Events</h2>
                  <Link to="/events" className="btn-ghost text-xs text-indigo-600 gap-1">Browse <ArrowRight size={11}/></Link>
                </div>
                {registeredEvents.length > 0 ? (
                  <div className="space-y-3">
                    {registeredEvents.map(event=>(
                      <Link key={event._id} to={"/events/"+event.slug} className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors border border-transparent hover:border-border">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0"><Calendar size={14} className="text-indigo-500"/></div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                          <p className="text-xs text-text-muted">{event.date ? format(new Date(event.date),"MMM d, yyyy") : ""}</p>
                        </div>
                        <span className={"badge capitalize flex-shrink-0 " + (event.status==="upcoming"?"badge-green":event.status==="completed"?"badge-gray":"badge-indigo")}>{event.status}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Calendar size={32} className="text-indigo-200 mx-auto mb-3"/>
                    <p className="text-text-muted text-sm">You have not registered for any events yet.</p>
                    <Link to="/events" className="btn-secondary mt-3 text-sm">Explore Events</Link>
                  </div>
                )}
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="card">
                <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2"><CreditCard size={16} className="text-indigo-500"/>Payment History</h2>
                {payments.length > 0 ? (
                  <div className="space-y-2">
                    {payments.slice(0,5).map(p=>(
                      <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-cream-50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center"><CreditCard size={13} className="text-indigo-400"/></div>
                          <div>
                            <p className="text-xs font-medium text-text-primary capitalize">{p.type} payment</p>
                            <p className="text-2xs text-text-muted">{format(new Date(p.createdAt),"MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-text-primary">₹{p.amount.toLocaleString("en-IN")}</p>
                          <span className={p.status==="paid"?"badge-green text-2xs":"badge-gray text-2xs"}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-muted text-sm text-center py-8">No payment history yet.</p>
                )}
              </div>
            </FadeUp>
          </div>

          <div className="space-y-5">
            <FadeUp delay={0.15}>
              <div className="card">
                <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2"><User size={15} className="text-indigo-500"/>Profile</h3>
                <div className="space-y-2.5 text-sm">
                  {[["College", profile?.college], ["Year", profile?.year], ["Branch", profile?.branch], ["Roll No.", profile?.rollNumber]].filter(([,v])=>v).map(([l,v])=>(
                    <div key={l} className="flex justify-between"><span className="text-text-muted">{l}</span><span className="font-medium text-text-primary">{v}</span>
                  </div>
                  ))}
                  {!profile?.college && <p className="text-text-muted text-xs text-center py-2">Complete your profile for better experience.</p>}
                </div>
                <Link to="/profile" className="btn-secondary w-full mt-4 text-sm">Edit Profile</Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              {membership ? (
                <div className="card bg-gradient-to-br from-indigo-50 to-lavender-50 border-indigo-100">
                  <div className="flex items-center gap-2 mb-3"><Zap size={16} className="text-indigo-500"/><h3 className="font-bold text-indigo-700">Active Membership</h3></div>
                  <p className="text-sm text-indigo-600 capitalize font-medium mb-1">{membership.plan} Plan</p>
                  <p className="text-xs text-indigo-500">Expires {format(new Date(membership.expiryDate),"MMM d, yyyy")}</p>
                  <div className="mt-3 pt-3 border-t border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium mb-2">Your benefits:</p>
                    {["Event discounts","Priority registration","Certificate priority"].map(b=>(
                      <div key={b} className="flex items-center gap-1.5 text-xs text-indigo-600 mb-1"><CheckCircle size={10}/>{b}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card">
                  <h3 className="font-bold text-text-primary mb-2">Upgrade to Member</h3>
                  <p className="text-sm text-text-secondary mb-4">Get event discounts, priority registration, and exclusive benefits.</p>
                  <Link to="/membership" className="btn-primary w-full text-sm shadow-glow-indigo">View Plans</Link>
                </div>
              )}
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
