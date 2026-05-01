import { motion } from "framer-motion";
import { Sparkles, Heart, Leaf, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const OurStory = () => {
   return (
      <div className="min-h-screen bg-white">
         {/* Cinematic Hero */}
         <section className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal">
            <div className="absolute inset-0">
               <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80"
                  alt="Premium Botanical Background"
                  className="w-full h-full object-cover scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/40" />
            </div>
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
               <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white mb-12 hover:text-emerald-400 transition-colors group"
               >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Home
               </Link>
               <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
               >
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.6em] text-emerald-400 mb-8 block drop-shadow-md">
                     Established with Intent
                  </span>
                  <h1 className="font-serif text-5xl md:text-9xl text-white mb-10 leading-[1] md:leading-[0.9] tracking-tight">
                     Rooted in <br /> <span className="italic font-light text-emerald-100">Purity.</span>
                  </h1>
                  <div className="w-24 h-[1px] bg-emerald-500/50 mx-auto mb-10" />
                  <p className="text-white/90 text-base md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-sm">
                     A symphony of ancient botanical wisdom and <br className="hidden md:block" /> modern clinical science, crafted for your rhythm.
                  </p>
               </motion.div>
            </div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1, duration: 1 }}
               className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
               <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">The Journey</span>
               <div className="w-[1px] h-16 bg-gradient-to-b from-emerald-500/80 to-transparent" />
            </motion.div>
         </section>

         {/* The Mission */}
         <section className="py-24 px-4">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
               >
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                     <img src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80" alt="Botanical formulation process" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full -z-10 blur-3xl opacity-60" />
                  <div className="absolute -top-10 -left-10 p-10 bg-white rounded-3xl shadow-xl z-20 hidden md:block">
                     <p className="text-3xl font-black text-emerald-600">100%</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Botanical Actives</p>
                  </div>
               </motion.div>

               <div className="space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Our Mission</span>
                  <h2 className="font-serif text-4xl md:text-5xl text-charcoal leading-tight">Beyond Skin Deep.</h2>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                     We don't just create products; we curate experiences that honor your body's natural rhythm. Every formula is meticulously crafted with high-altitude botanical extracts and bio-available nutrients that penetrate deep to nourish from within.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-6">
                     <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <Leaf size={20} />
                        </div>
                        <h4 className="font-bold text-charcoal">Clean sourcing</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Sustainably harvested ingredients from ethical, organic farms.</p>
                     </div>
                     <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                           <ShieldCheck size={20} />
                        </div>
                        <h4 className="font-bold text-charcoal">Triple tested</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Every batch is verified for purity and potency in certified labs.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Values Banner */}
         <section className="py-24 bg-emerald-900 text-white rounded-[3rem] md:rounded-[5rem] mx-4 mb-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px]" />
            <div className="max-w-7xl mx-auto px-4 relative z-10">
               <div className="grid md:grid-cols-3 gap-12 text-center">
                  <div className="space-y-4">
                     <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 mb-6">
                        <Sparkles size={32} />
                     </div>
                     <h3 className="font-serif text-2xl">Innovation</h3>
                     <p className="text-emerald-100/60 text-sm">Pushing the boundaries of botanical pharmacology.</p>
                  </div>
                  <div className="space-y-4 border-y md:border-y-0 md:border-x border-white/10 py-12 md:py-0">
                     <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 mb-6">
                        <Heart size={32} />
                     </div>
                     <h3 className="font-serif text-2xl">Kindness</h3>
                     <p className="text-emerald-100/60 text-sm">Cruelty-free, vegan, and kind to all living beings.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 mb-6">
                        <Leaf size={32} />
                     </div>
                     <h3 className="font-serif text-2xl">Earth First</h3>
                     <p className="text-emerald-100/60 text-sm">Carbon neutral shipping and plastic-positive packaging.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Founder Quote */}
         <section className="pb-32 px-4">
            <div className="max-w-3xl mx-auto text-center space-y-10">
               <div className="text-5xl text-emerald-100 font-serif">"</div>
               <p className="font-serif text-3xl md:text-4xl text-charcoal leading-relaxed italic">
                  Wellness isn't a destination; it's the beautiful, rhythmic journey of returning to yourself.
               </p>
               <div className="pt-4">
                  <p className="text-sm font-black uppercase tracking-widest text-charcoal">The PLEUX Team</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Established with Intent</p>
               </div>

               <div className="pt-12">
                  <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all group">
                     Discover Our Formulas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};

export default OurStory;
