import { motion } from "framer-motion";
import { Leaf, ShieldCheck, BadgeCheck, Heart, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Leaf size={32} />,
    title: "Plant-Powered",
    desc: "Plant-powered, skin-friendly formulations that honor your natural biology.",
    bg: "bg-emerald-50",
    color: "text-emerald-700",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Pure Integrity",
    desc: "Strictly free from harsh chemicals, parabens, and synthetic irritants.",
    bg: "bg-green-50",
    color: "text-green-700",
  },
  {
    icon: <Sparkles size={32} />,
    title: "Real Impact",
    desc: "Thoughtfully crafted formulas designed for visible, lasting transformative results.",
    bg: "bg-teal-50",
    color: "text-teal-700",
  },
  {
    icon: <BadgeCheck size={32} />,
    title: "Your Satisfaction",
    desc: "Unwavering commitment to premium quality and total customer satisfaction.",
    bg: "bg-sage-50",
    color: "text-emerald-800",
  },
];

const WhyChooseUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80"
            alt="Botanical Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-950/80 to-emerald-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-12 hover:text-white transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge !bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30 mb-6"
          >
            The Pleux Promise
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl mb-8 leading-tight  text-white"
          >
            Why Choose Pleux?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-100/70 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            We believe true beauty comes from nature, and our mission is to bring you products
            that help you look and feel your best—naturally.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 md:p-16 rounded-[3rem] border border-emerald-50 ${f.bg} flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500`}
              >
                <div className={`w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-serif text-3xl text-emerald-950 mb-6 font-bold uppercase tracking-tight">
                  {f.title}
                </h3>
                <div className="flex items-start justify-center gap-3 text-stone-600 text-lg md:text-xl font-light leading-relaxed">
                  <span className="text-emerald-500 font-bold mt-1">✔</span>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-stone-50 border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          <Heart className="mx-auto text-emerald-500 fill-emerald-500" size={48} />
          <h2 className="font-serif text-4xl md:text-5xl text-emerald-950 font-bold">Our Philosophy</h2>
          <p className="text-stone-500 text-xl md:text-2xl font-light leading-relaxed italic">
            "Wellness isn't just about what you put on your body; it's about honoring the connection between your inner vitality and the world around you."
          </p>
          <div className="pt-8">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-emerald-800">The Pleux Commitment</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto bg-emerald-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 font-bold">Experience the Difference.</h2>
            <p className="text-emerald-100/60 text-lg mb-12 max-w-xl mx-auto">
              Join thousands of others who have embraced a more natural, effective way to care for their skin and soul.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/products" className="btn-primary px-12 py-5 text-base">
                Explore Collection <ArrowRight size={20} />
              </Link>
              <span className="text-emerald-100/40 text-xs font-bold uppercase tracking-widest">
                Trusted by 2,400+ members
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer message */}
      <div className="py-12 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-400">
          Thank you for choosing us as your trusted beauty partner 🌿
        </p>
      </div>
    </div>
  );
};

export default WhyChooseUsPage;
