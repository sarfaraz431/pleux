import { Link } from "react-router-dom";
import { Sparkles, MessageCircle } from "lucide-react";

// Inline SVG social icons
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16.5 11.5c0 1.25-.45 2.15-1.3 2.75-.85.6-1.85.75-2.95.75-.55 0-1.05-.05-1.55-.15-.45-.1-.85-.25-1.2-.45V12.7c.35.25.75.45 1.2.6.45.15.95.2 1.45.2.75 0 1.3-.1 1.7-.35.4-.25.6-.7.6-1.35 0-.6-.2-1.05-.6-1.3-.4-.25-1-.35-1.75-.35h-.9v-1.6h1.1c.7 0 1.25-.1 1.6-.35.35-.25.55-.65.55-1.2 0-.55-.2-1-.6-1.25-.4-.25-.95-.4-1.65-.4-.65 0-1.2.1-1.65.25-.45.15-.8.35-1.05.55v-1.7c.3-.2.7-.35 1.2-.45.5-.1 1.05-.15 1.65-.15 1.2 0 2.15.25 2.85.75.7.5 1.05 1.2 1.05 2.1 0 .6-.15 1.1-.45 1.5-.3.4-.75.75-1.35 1 1 .2 1.7.65 2.15 1.2.45.55.65 1.25.65 2.1zm-8 4.5c.35.1.75.15 1.15.15 1.1 0 1.95-.2 2.55-.65.6-.45.9-1.15.9-2.05 0-1-.3-1.7-.85-2.15-.55-.45-1.4-.7-2.5-.7h-1.25v5.4zM4.5 12c0-2.1.75-3.9 2.2-5.35C8.15 5.2 9.95 4.5 12 4.5c2.1 0 3.9.75 5.35 2.2 1.45 1.45 2.2 3.25 2.2 5.35 0 2.1-.75 3.9-2.2 5.35-1.45 1.45-3.25 2.2-5.35 2.2-2.1 0-3.9-.75-5.35-2.2C5.2 15.9 4.5 14.1 4.5 12zm-2 0c0 2.65.9 4.85 2.75 6.7C7.15 20.6 9.35 21.5 12 21.5c2.65 0 4.85-.9 6.7-2.75 1.85-1.85 2.75-4.05 2.75-6.7 0-2.65-.9-4.85-2.75-6.7C16.85 3.5 14.65 2.5 12 2.5c-2.65 0-4.85.9-6.7 2.75C3.4 7.15 2.5 9.35 2.5 12z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#061C14] text-white/70 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col items-center mb-6">
              <img
                src="/assets/images/pleux-logo.png"
                alt="PLEUX™"
                className="h-10 w-auto mb-2"
              />

              <span className="text-sm tracking-wide text-gray-300">
                Powered by <span className="text-emerald-400 font-semibold">Nature</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-8 max-w-xs font-light">
              Elevating personal care through botanical excellence and conscious science.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <InstagramIcon />, href: "https://www.instagram.com/pleux_life", id: "footer-instagram" },
                { icon: <TwitterIcon />, href: "#", id: "footer-twitter" },
                { icon: <FacebookIcon />, href: "https://www.facebook.com/share/14h8eq5TZM6/", id: "footer-facebook" },
                { icon: <ThreadsIcon />, href: "#", id: "footer-threads" },
              ].map((s) => (
                <a key={s.id} id={s.id} href={s.href}
                  className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-500 border border-white/5">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          {/* <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Explore Catalog</h4>
            <ul className="space-y-4 text-sm">
              {[
                { label: "New Arrivals", to: "/products" },
                { label: "Botanical Skin", to: "/products" },
                { label: "Natural Hair", to: "/products" },
                { label: "Most Loved", to: "/products" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-stone-400 hover:text-emerald-400 transition-colors duration-300 font-medium">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Help */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              {[
                { label: "Who we are", to: "/our-story" },
                { label: "Why choose Pleux", to: "/why-choose-us" },
                { label: "Blogs", to: "/blogs" },
                // { label: "Track Order", to: "/track" },
                // { label: "Support", to: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-stone-400 hover:text-emerald-400 transition-colors duration-300 font-medium">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Address */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Connect with us</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Office Address</p>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Ground floor, SR NO-27/1,<br />
                  Old Mundhwa Road, Behind Relax Hotel,<br />
                  Pune - 411014
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Corporate Office</p>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  BramhaCorp Business park,<br />
                  The collection, wadgaon sheri,<br />
                  Pune - 411014
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Call us</p>
                  <a href="tel:9130165774" className="text-sm text-white font-bold hover:text-emerald-400 transition-colors">9130165774</a>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Mail us</p>
                  <a href="mailto:Pleuxlife@gmail.com" className="text-sm text-white font-bold hover:text-emerald-400 transition-colors lowercase">Pleuxlife@gmail.com</a>
                </div>
              </div>

              <a href="https://wa.me/919130165774" target="_blank" rel="noreferrer"
                id="footer-whatsapp"
                className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all duration-300 shadow-xl w-full justify-center">
                <MessageCircle size={14} /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} PLEUX Labs. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <Link to="/admin" id="footer-admin-link" className="hover:text-emerald-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


