import { Heart } from "lucide-react";

const features = [
  {
    icon: "🌿",
    title: "Our Formulation",
    desc: "Plant-powered, skin-friendly formulations.",
    bg: "bg-emerald-50/50",
    color: "text-emerald-700",
    border: "border-emerald-100/50",
  },
  {
    icon: "🚫",
    title: "Pure Integrity",
    desc: "Free from harsh chemicals.",
    bg: "bg-green-50/50",
    color: "text-green-700",
    border: "border-green-100/50",
  },
  {
    icon: "✨",
    title: "Real Impact",
    desc: "Thoughtfully crafted for real results.",
    bg: "bg-teal-50/50",
    color: "text-teal-700",
    border: "border-teal-100/50",
  },
  {
    icon: "🤝",
    title: "Your Satisfaction",
    desc: "Committed to quality and customer satisfaction.",
    bg: "bg-sage-50/50",
    color: "text-emerald-800",
    border: "border-emerald-50",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-24 md:py-32 bg-[#F9FBF9] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-[-10%] w-[30%] h-[60%] rounded-full bg-emerald-50/40 blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-[-10%] w-[25%] h-[50%] rounded-full bg-green-50/30 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="badge mb-4">The Pleux Promise</span>
          <h2 className="section-title">Why Choose Pleux?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            We believe true beauty comes from nature, and our mission is to bring you products 
            that help you look and feel your best—naturally.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2.5rem] border ${f.border} ${f.bg} flex flex-col items-center text-center transition-all duration-500 hover:shadow-glow-green group backdrop-blur-sm`}
            >
              <div className="text-4xl mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                {f.icon}
              </div>
              <h3 className="font-serif text-xl text-emerald-950 mb-4 leading-tight font-bold uppercase tracking-tight">
                {f.title}
              </h3>
              <div className="flex items-start justify-center gap-2 text-stone-500 text-sm md:text-base font-light">
                <span className="text-emerald-500 font-bold">✔</span>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Message */}
        <div className="text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-emerald-50 px-8 py-4 rounded-full border border-emerald-100 text-emerald-800 shadow-sm">
             <Heart className="fill-emerald-400 text-emerald-400" size={18} />
             <span className="text-xs md:text-sm font-bold tracking-tight uppercase">Thank you for choosing us as your trusted beauty partner</span>
             <span className="text-xl">🌿</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
