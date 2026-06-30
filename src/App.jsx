import { useState, useEffect, useRef } from "react";
import { ArrowRight, Truck, Globe2, Warehouse, Network, FileCheck, Settings, MapPin, Phone, Mail, Menu, X, ChevronRight, ChevronDown, Factory, Pickaxe, ShoppingBag, Wheat, HardHat, PackageSearch, Building2, Facebook, Linkedin, Instagram, Send, Loader2, Quote as QuoteIcon } from "lucide-react";

// ---------- Config ----------
// Web3Forms powers all forms. Get a free key at https://web3forms.com and put
// it in a .env file as VITE_WEB3FORMS_KEY (see .env.example).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// Update these with the company's real social profiles, then they go live.
const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

const CONTACT = {
  phone: "067 202 7777",
  phoneHref: "tel:+27672027777",
  email: "zenitglobe@gmail.com",
  location: "Centurion, Gauteng, South Africa",
};

async function submitToWeb3Forms(fields) {
  if (!WEB3FORMS_KEY) {
    throw new Error("Forms aren't configured yet. Add your Web3Forms access key to enable submissions.");
  }
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ---------- Logo ----------
function ZenitLogo({ light = false, className = "h-9 w-9" }) {
  const stroke = light ? "#FFFFFF" : "#0B1F3A";
  const accent = "#FF7A00";
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="16" stroke={stroke} strokeWidth="2" />
      <path d="M8 24h32M24 8c4.5 4.5 7 10 7 16s-2.5 11.5-7 16c-4.5-4.5-7-10-7-16s2.5-11.5 7-16Z" stroke={stroke} strokeWidth="1.4" opacity="0.5" />
      <path d="M10 30c5-2 9-2 14-2s9 0 14 2" stroke={stroke} strokeWidth="1.4" opacity="0.35" />
      <path d="M14 26c4 6 14 9 22 2" stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M30 22.5l7 4.5-7 4.5" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill={accent} />
    </svg>
  );
}

function LogoLockup({ light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <ZenitLogo light={light} />
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold text-[15px] tracking-tight ${light ? "text-white" : "text-[#0B1F3A]"}`} style={{ fontFamily: "Poppins, sans-serif" }}>
          ZENIT <span style={{ color: "#FF7A00" }}>GLOBAL</span>
        </span>
        <span className={`text-[9px] tracking-[0.18em] ${light ? "text-blue-100/70" : "text-[#344054]/70"}`}>INTERLINK</span>
      </div>
    </div>
  );
}

// ---------- Scroll reveal ----------
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0px)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function Counter({ end, suffix = "", duration = 1800 }) {
  const [ref, visible] = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3600); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm rounded-xl shadow-2xl border border-slate-100 bg-white px-5 py-4 flex items-start gap-3" style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }`}</style>
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#00C853" }}>
        <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0B1F3A]">{message}</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss" className="ml-auto text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
    </div>
  );
}

// ---------- Reusable form field styles ----------
const inputBase = "mt-2 w-full px-4 py-3 rounded-xl border text-sm text-[#344054] placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 focus:border-[#0066FF] transition-all";
const labelBase = "text-xs font-bold uppercase tracking-wider text-[#344054]/70";

function FieldError({ msg }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{msg}</p>;
}

// ---------- Page header (used on all sub-pages) ----------
function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1F3A, #0d2547)" }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0px, transparent 70px, #ffffff 70px, #ffffff 72px)" }} />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.25), transparent 70%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#FF7A00" }}>{eyebrow}</span>
          <h1 className="mt-3 font-extrabold text-white leading-tight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)" }}>{title}</h1>
          {subtitle && <p className="mt-4 text-blue-100/70 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Nav ----------
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { label: "Services", page: "services" },
    { label: "Industries", page: "industries" },
    { label: "About", page: "about" },
    { label: "Network", page: "network" },
    { label: "FAQ", page: "faq" },
    { label: "Contact", page: "contact" },
  ];
  const go = (p) => { setPage(p); setOpen(false); window.scrollTo(0, 0); };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{
      background: scrolled || page !== "home" ? "rgba(11,31,58,0.92)" : "rgba(11,31,58,0.35)",
      backdropFilter: "blur(16px)",
      borderBottom: scrolled || page !== "home" ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
    }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button onClick={() => go("home")} className="shrink-0" aria-label="Zenit Global Interlink home"><LogoLockup light /></button>
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.page} onClick={() => go(l.page)} className={`text-sm font-medium transition-colors relative group ${page === l.page ? "text-white" : "text-white/80 hover:text-white"}`}>
              {l.label}
              <span className={`absolute -bottom-1.5 left-0 h-[1.5px] bg-[#FF7A00] transition-all duration-300 ${page === l.page ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button onClick={() => go("contact")} className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg border border-white/30 hover:bg-white/10 transition-all">Contact Us</button>
          <button onClick={() => go("quote")} className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>
            Request Quote <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-white/10 px-6 py-6 flex flex-col gap-4" style={{ background: "#0B1F3A" }}>
          {links.map((l) => (
            <button key={l.page} onClick={() => go(l.page)} className="text-left text-white font-medium py-1">{l.label}</button>
          ))}
          <button onClick={() => go("quote")} className="mt-2 text-sm font-semibold text-white px-5 py-3 rounded-lg" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>Request Quote</button>
        </div>
      )}
    </nav>
  );
}

// ================= HOME PAGE =================
function Hero({ setPage }) {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1F3A 0%, #0d2547 45%, #0B1F3A 100%)" }}>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0px, transparent 70px, #ffffff 70px, #ffffff 72px)" }} />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.35), transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(255,122,0,0.18), transparent 70%)" }} />
      <div className="absolute bottom-24 left-0 w-full overflow-hidden h-px">
        <div className="h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent w-1/3 animate-[slide_4s_linear_infinite]" />
      </div>
      <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } } @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }`}</style>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20 w-full grid lg:grid-cols-[1.15fr,0.85fr] gap-16 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              <span className="text-xs font-medium text-blue-100/90 tracking-wide">Centurion, South Africa — Operating 24/7</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-extrabold text-white leading-[1.05] tracking-tight" style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(2.6rem, 5.2vw, 4.6rem)" }}>
              Logistics<br />Without <span style={{ color: "#FF7A00" }}>Limits.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg text-blue-50/75 max-w-xl leading-relaxed">
              Zenit Global Interlink delivers reliable local and international freight solutions that keep your business moving — across South Africa and beyond.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-4">
              <button onClick={() => setPage("quote")} className="group text-sm font-semibold text-white px-7 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-1 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>
                Request a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => setPage("contact")} className="text-sm font-semibold text-white px-7 py-4 rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all">Contact Us</button>
            </div>
          </Reveal>
        </div>
        <div className="relative hidden lg:block h-[420px]">
          <Reveal delay={250}>
            <div className="absolute top-0 right-4 w-64 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl" style={{ background: "rgba(255,255,255,0.06)", animation: "floatY 6s ease-in-out infinite" }}>
              <Truck className="w-6 h-6 text-[#FF7A00] mb-3" />
              <p className="text-white font-semibold text-sm">Cross-Border Fleet</p>
              <p className="text-blue-100/60 text-xs mt-1">Live route tracking across 7 SADC corridors</p>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="absolute top-44 left-0 w-60 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl" style={{ background: "rgba(255,255,255,0.06)", animation: "floatY 7s ease-in-out infinite 1s" }}>
              <Globe2 className="w-6 h-6 text-[#0066FF] mb-3" />
              <p className="text-white font-semibold text-sm">Global Import / Export</p>
              <p className="text-blue-100/60 text-xs mt-1">End-to-end customs & documentation</p>
            </div>
          </Reveal>
          <Reveal delay={550}>
            <div className="absolute bottom-0 right-10 w-56 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl" style={{ background: "rgba(255,255,255,0.06)", animation: "floatY 6.5s ease-in-out infinite 0.5s" }}>
              <Warehouse className="w-6 h-6 text-[#00C853] mb-3" />
              <p className="text-white font-semibold text-sm">Warehousing</p>
              <p className="text-blue-100/60 text-xs mt-1">Secure storage & distribution hubs</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function TrustStats() {
  const stats = [
    { val: 10, suffix: "+", label: "Years Experience" },
    { val: 1000, suffix: "+", label: "Loads Delivered" },
    { val: 24, suffix: "/7", label: "Customer Support" },
    { val: 7, suffix: "", label: "Cross-Border Routes" },
  ];
  return (
    <section className="relative bg-white py-16 -mt-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 rounded-2xl border border-slate-100 shadow-[0_8px_40px_rgba(11,31,58,0.06)] p-8 lg:p-10" style={{ background: "linear-gradient(180deg, #fff, #F8FAFC)" }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="text-center lg:border-r lg:last:border-r-0 border-slate-200">
                <div className="font-extrabold text-4xl lg:text-5xl" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}><Counter end={s.val} suffix={s.suffix} /></div>
                <p className="text-sm text-[#344054] mt-2 font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: Truck, title: "Road Freight", desc: "Local and cross-border transportation across South Africa and the SADC region.", detail: "Our road freight network covers full-load and part-load consignments, with GPS-tracked vehicles moving daily between major metros and cross-border posts.", benefits: ["Real-time GPS tracking", "Flexible full & part loads", "Dedicated route planning"], industries: ["Manufacturing", "Retail", "Agriculture"] },
  { icon: Globe2, title: "Import Logistics", desc: "End-to-end import support, customs clearance, and inland delivery.", detail: "We coordinate the full import journey — from origin booking through customs clearance to final inland delivery — so your goods land on time, every time.", benefits: ["Customs clearance handling", "Door-to-door coordination", "Duties & compliance support"], industries: ["Retail", "Construction", "Distribution Centres"] },
  { icon: FileCheck, title: "Export Logistics", desc: "Seamless export coordination with full documentation handling.", detail: "From export permits to bill of lading, we manage the documentation burden so your cargo clears borders without delay.", benefits: ["Export documentation", "Freight forwarding network", "Border compliance"], industries: ["Mining", "Agriculture", "Manufacturing"] },
  { icon: Warehouse, title: "Warehousing", desc: "Secure storage and distribution solutions at strategic hubs.", detail: "Strategically located storage facilities with inventory visibility, giving you flexible short and long-term warehousing options.", benefits: ["Secure, monitored facilities", "Inventory visibility", "Pick & pack support"], industries: ["Retail", "Distribution Centres", "Import/Export Businesses"] },
  { icon: Network, title: "Supply Chain Support", desc: "Integrated logistics management across your entire value chain.", detail: "We act as an extension of your operations team — coordinating multiple suppliers, carriers, and delivery points under one accountable partner.", benefits: ["End-to-end visibility", "Multi-vendor coordination", "Performance reporting"], industries: ["Manufacturing", "Mining", "Retail"] },
  { icon: Settings, title: "Custom Solutions", desc: "Tailored transport solutions built around your business needs.", detail: "Every business moves differently. We design bespoke logistics solutions around your volumes, timelines, and budget.", benefits: ["Tailored route design", "Scalable capacity", "Dedicated account management"], industries: ["Construction", "Import/Export Businesses", "Manufacturing"] },
];

function Services({ setPage }) {
  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#FF7A00" }}>What We Do</span>
            <h2 className="mt-3 font-extrabold text-3xl lg:text-4xl" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>Full-Spectrum Logistics Solutions</h2>
            <p className="mt-4 text-[#344054] leading-relaxed">From a single pallet to a full cross-border fleet movement, we engineer logistics solutions that scale with your business.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 80}>
                <div onClick={() => setPage("services")} className="group relative p-7 rounded-2xl bg-white border border-slate-100 hover:border-transparent transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(11,31,58,0.12)] cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: "linear-gradient(135deg, rgba(0,102,255,0.04), rgba(255,122,0,0.04))" }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-400 group-hover:scale-110" style={{ background: "linear-gradient(135deg, #0B1F3A, #0066FF)" }}><Icon className="w-6 h-6 text-white" /></div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>{s.title}</h3>
                    <p className="text-sm text-[#344054] leading-relaxed">{s.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#FF7A00" }}>Learn more <ChevronRight className="w-4 h-4" /></div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = ["Industry expertise across freight & supply chain", "Fast turnaround times, every shipment", "Competitive, transparent pricing", "Reliable fleet network nationwide", "Real-time communication & updates", "Professional, responsive customer service", "Strategic location in Centurion, Gauteng", "Proven cross-border capability"];
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1F3A, #101828)" }}>
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.25), transparent 70%)" }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#FF7A00" }}>Why Zenit</span>
            <h2 className="mt-3 font-extrabold text-3xl lg:text-4xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Built On Trust, Driven By Performance</h2>
            <p className="mt-4 text-blue-100/70 leading-relaxed max-w-lg">We combine deep industry expertise with a technology-driven approach, giving clients full visibility and confidence in every shipment.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <Reveal key={f} delay={i * 60}>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#00C853" }}>
                  <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span className="text-sm text-blue-50/85 leading-snug">{f}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner({ setPage }) {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>
      <Reveal>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-extrabold text-3xl lg:text-4xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Ready To Move Your Cargo Forward?</h2>
          <p className="mt-4 text-white/90 text-lg">Get a tailored freight quote within 24 hours.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button onClick={() => setPage("quote")} className="text-sm font-bold text-[#0B1F3A] bg-white px-7 py-4 rounded-xl hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center gap-2">Request a Quote <ArrowRight className="w-4 h-4" /></button>
            <button onClick={() => setPage("contact")} className="text-sm font-bold text-white px-7 py-4 rounded-xl border-2 border-white/40 hover:bg-white/10 transition-all">Speak To Our Team</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function HomePage({ setPage }) {
  return (
    <>
      <Hero setPage={setPage} />
      <TrustStats />
      <Services setPage={setPage} />
      <WhyChooseUs />
      <CTABanner setPage={setPage} />
    </>
  );
}

// ================= SERVICES PAGE =================
function ServicesPage({ setPage }) {
  return (
    <>
      <PageHeader eyebrow="Our Services" title="Logistics Solutions Built For Scale" subtitle="Detailed, dependable services covering every link in your supply chain — from first mile to final delivery." />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 60}>
                <div className={`grid lg:grid-cols-[0.9fr,1.1fr] gap-10 items-center p-8 lg:p-10 rounded-3xl border border-slate-100 ${i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`} style={{ background: "linear-gradient(180deg, #fff, #F8FAFC)" }}>
                  <div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #0B1F3A, #0066FF)" }}><Icon className="w-7 h-7 text-white" /></div>
                    <h3 className="font-extrabold text-2xl mb-3" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>{s.title}</h3>
                    <p className="text-[#344054] leading-relaxed">{s.detail}</p>
                    <button onClick={() => setPage("quote")} className="mt-6 inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>Get a Quote <ArrowRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#FF7A00" }}>Benefits</p>
                      <ul className="space-y-2">
                        {s.benefits.map((b) => (<li key={b} className="text-sm text-[#344054] flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-1.5 shrink-0" />{b}</li>))}
                      </ul>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#0066FF" }}>Industries Served</p>
                      <div className="flex flex-wrap gap-2">
                        {s.industries.map((ind) => (<span key={ind} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "#F8FAFC", color: "#0B1F3A" }}>{ind}</span>))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ================= INDUSTRIES PAGE =================
const INDUSTRIES = [
  { icon: Factory, title: "Manufacturing", desc: "Reliable component and finished-goods transport keeping production lines moving." },
  { icon: Pickaxe, title: "Mining", desc: "Heavy-duty freight solutions for bulk materials and remote-site logistics." },
  { icon: ShoppingBag, title: "Retail", desc: "Time-sensitive distribution keeping shelves stocked across regions." },
  { icon: Wheat, title: "Agriculture", desc: "Seasonal, temperature-aware transport for agricultural goods and produce." },
  { icon: HardHat, title: "Construction", desc: "Equipment and materials moved safely to site, on schedule." },
  { icon: PackageSearch, title: "Import/Export Businesses", desc: "Full customs and cross-border coordination for international trade." },
  { icon: Building2, title: "Distribution Centres", desc: "High-volume, high-frequency movement between hubs and end points." },
];

function IndustriesPage() {
  return (
    <>
      <PageHeader eyebrow="Industries We Serve" title="Trusted Across Every Major Sector" subtitle="Wherever your goods need to move, we bring sector-specific expertise to keep your operation running." />
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <Reveal key={ind.title} delay={i * 70}>
                <div className="p-7 rounded-2xl bg-white border border-slate-100 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(11,31,58,0.1)] transition-all duration-400">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}><Icon className="w-6 h-6 text-white" /></div>
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>{ind.title}</h3>
                  <p className="text-sm text-[#344054] leading-relaxed">{ind.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ================= ABOUT PAGE =================
const TIMELINE = [
  { year: "2014", label: "Company Founded" },
  { year: "2018", label: "Expanded Cross-Border Operations" },
  { year: "2021", label: "Warehousing Partnerships" },
  { year: "2025", label: "National Logistics Expansion" },
  { year: "Future", label: "Pan-African Logistics Network" },
];

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About Zenit" title="Taking You To Greater Heights" />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <Reveal>
            <p className="text-lg text-[#344054] leading-relaxed">
              Founded in August 2014, Zenit Global Interlink Pty Ltd is a dynamic logistics company based in Centurion, South Africa. We specialize in delivering efficient and reliable road freight solutions both locally and internationally.
            </p>
            <p className="mt-5 text-lg text-[#344054] leading-relaxed">
              Our mission is to ensure every client's logistics needs are fully met through tailored, timely, and professional solutions. Our vision is to go the extra mile in delivering value and excellence across borders.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <Reveal><h2 className="font-extrabold text-3xl mb-14 text-center" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>Our Journey</h2></Reveal>
          <div className="relative">
            <div className="absolute left-[7px] lg:left-1/2 top-0 bottom-0 w-px bg-slate-200" />
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 100}>
                <div className={`relative flex lg:items-center mb-10 last:mb-0 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow" style={{ background: "#FF7A00" }} />
                  <div className={`pl-8 lg:pl-0 lg:w-1/2 ${i % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                    <div className="inline-block p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <span className="font-extrabold text-xl" style={{ fontFamily: "Poppins, sans-serif", color: "#FF7A00" }}>{t.year}</span>
                      <p className="text-sm font-medium text-[#344054] mt-1">{t.label}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ================= NETWORK PAGE =================
const NETWORK_COUNTRIES = ["South Africa", "Botswana", "Namibia", "Zimbabwe", "Mozambique", "Zambia", "Lesotho", "Eswatini"];
const PROCESS_STEPS = [
  { n: "01", title: "Request Quote", desc: "Tell us your cargo details and route." },
  { n: "02", title: "Route Planning", desc: "We design the optimal, most efficient path." },
  { n: "03", title: "Cargo Collection", desc: "Pickup scheduled at your convenience." },
  { n: "04", title: "Transportation", desc: "Real-time tracked movement to destination." },
  { n: "05", title: "Delivery", desc: "Confirmed, documented final delivery." },
];

function NetworkPage() {
  return (
    <>
      <PageHeader eyebrow="Global Network" title="Connected Across Southern Africa" subtitle="Our cross-border network spans eight countries, with dedicated route partners and customs expertise at every post." />
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative p-10 rounded-3xl border border-slate-100 overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1F3A, #0d2547)" }}>
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent 0px, transparent 40px, #ffffff 40px, #ffffff 41px)" }} />
              <div className="relative z-10">
                <Globe2 className="w-16 h-16 text-[#0066FF] mb-6" />
                <h3 className="text-white font-extrabold text-2xl mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Eight Countries. One Partner.</h3>
                <p className="text-white/70 text-sm leading-relaxed">From our Centurion base we coordinate cross-border movements throughout the SADC region — managing customs documentation, route partners, and compliance at every post so your cargo never stalls at a border.</p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal><h3 className="font-extrabold text-2xl mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>Countries We Service</h3></Reveal>
            <div className="grid grid-cols-2 gap-3">
              {NETWORK_COUNTRIES.map((c, i) => (
                <Reveal key={c} delay={i * 50}>
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                    <span className="w-2 h-2 rounded-full bg-[#00C853]" />
                    <span className="text-sm font-medium text-[#0B1F3A]">{c}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <Reveal><h2 className="font-extrabold text-3xl mb-14 text-center" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>Our Freight Process</h2></Reveal>
          <div className="grid lg:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="relative p-6 rounded-2xl bg-white border border-slate-100 h-full">
                  <span className="font-extrabold text-3xl opacity-20" style={{ fontFamily: "Poppins, sans-serif", color: "#0066FF" }}>{s.n}</span>
                  <h4 className="font-bold mt-3 mb-2" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>{s.title}</h4>
                  <p className="text-sm text-[#344054] leading-relaxed">{s.desc}</p>
                  {i < PROCESS_STEPS.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-slate-300" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ================= TESTIMONIALS =================
const TESTIMONIALS = [
  { name: "L. Mokoena", role: "Operations Manager, Retail Group", quote: "Zenit has transformed how reliably our stores get stocked. Communication is excellent." },
  { name: "T. van Wyk", role: "Supply Chain Lead, Manufacturing", quote: "Cross-border documentation used to be our biggest headache — now it's seamless." },
  { name: "N. Dlamini", role: "Procurement Director, Construction", quote: "Equipment arrives on site exactly when promised. That reliability matters." },
];

function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal><h2 className="font-extrabold text-3xl mb-14 text-center" style={{ fontFamily: "Poppins, sans-serif", color: "#0B1F3A" }}>What Our Clients Say</h2></Reveal>
        <div className="grid lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="p-7 rounded-2xl border border-slate-100 bg-[#F8FAFC] h-full flex flex-col">
                <QuoteIcon className="w-7 h-7 mb-4" style={{ color: "#FF7A00" }} />
                <p className="text-[#344054] leading-relaxed flex-1">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #0B1F3A, #0066FF)" }}>{t.name.split(" ").map(n=>n[0]).join("")}</div>
                  <div>
                    <p className="text-sm font-bold text-[#0B1F3A]">{t.name}</p>
                    <p className="text-xs text-[#344054]/70">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ================= FAQ PAGE =================
const FAQS = [
  { q: "What areas do you service?", a: "We service all major metros across South Africa, with cross-border routes covering Botswana, Namibia, Zimbabwe, Mozambique, Zambia, Lesotho, and Eswatini." },
  { q: "How long do deliveries take?", a: "Local deliveries are typically same-day to next-day. Cross-border deliveries vary by destination and customs processing, generally 2–5 business days." },
  { q: "Do you offer cross-border logistics?", a: "Yes. Cross-border freight is one of our core specialties, with dedicated documentation and customs support at every border post we service." },
  { q: "Can you assist with import/export documentation?", a: "Yes, our team manages full import and export documentation, including customs clearance, permits, and compliance paperwork." },
  { q: "Do you provide warehousing?", a: "Yes. We offer secure, monitored warehousing and distribution solutions at strategic hubs, suitable for short and long-term storage." },
];

function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <>
      <PageHeader eyebrow="Support" title="Frequently Asked Questions" />
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 space-y-4">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left bg-[#F8FAFC] hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-[#0B1F3A]">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#0B1F3A] shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
                </button>
                <div style={{ maxHeight: openIdx === i ? "200px" : "0px", overflow: "hidden", transition: "max-height 0.35s ease" }}>
                  <p className="p-5 text-sm text-[#344054] leading-relaxed">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <TestimonialsSection />
    </>
  );
}

// ================= QUOTE PAGE (functional form) =================
const CARGO_TYPES = ["General Freight", "Refrigerated / Temperature-Controlled", "Hazardous / Dangerous Goods", "Oversized / Abnormal Load", "Bulk Cargo", "Containerised", "Other"];
const QUOTE_INITIAL = { company: "", contact: "", phone: "", email: "", pickup: "", destination: "", cargoType: "", weight: "", requirements: "" };

function QuotePage({ onAction }) {
  const [form, setForm] = useState(QUOTE_INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: "" });

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  const validate = () => {
    const er = {};
    if (!form.contact.trim()) er.contact = "Please enter a contact name.";
    if (!form.email.trim()) er.email = "Please enter your email.";
    else if (!isEmail(form.email)) er.email = "Please enter a valid email address.";
    if (!form.phone.trim()) er.phone = "Please enter a phone number.";
    if (!form.pickup.trim()) er.pickup = "Required.";
    if (!form.destination.trim()) er.destination = "Required.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ loading: true, error: "" });
    try {
      await submitToWeb3Forms({
        subject: `New Quote Request — ${form.company || form.contact}`,
        from_name: "Zenit Global Website",
        "Company": form.company,
        "Contact Person": form.contact,
        "Phone": form.phone,
        "Email": form.email,
        "Pickup Location": form.pickup,
        "Destination": form.destination,
        "Cargo Type": form.cargoType || "Not specified",
        "Weight (kg)": form.weight || "Not specified",
        "Special Requirements": form.requirements || "None",
      });
      setForm(QUOTE_INITIAL);
      setStatus({ loading: false, error: "" });
      onAction("Thank you. Our logistics team will contact you within 24 hours.");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <>
      <PageHeader eyebrow="Get Started" title="Request A Freight Quote" subtitle="Tell us about your shipment and our logistics team will respond within 24 hours." />
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <Reveal>
            <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-100 p-8 lg:p-10 shadow-[0_8px_40px_rgba(11,31,58,0.06)]">
              {/* Honeypot anti-spam field */}
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelBase}>Company Name</label>
                  <input value={form.company} onChange={set("company")} placeholder="e.g. Acme Manufacturing" className={`${inputBase} border-slate-200`} />
                </div>
                <div>
                  <label className={labelBase}>Contact Person *</label>
                  <input value={form.contact} onChange={set("contact")} placeholder="Full name" className={`${inputBase} ${errors.contact ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.contact} />
                </div>
                <div>
                  <label className={labelBase}>Phone *</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="+27 ..." className={`${inputBase} ${errors.phone ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.phone} />
                </div>
                <div>
                  <label className={labelBase}>Email *</label>
                  <input value={form.email} onChange={set("email")} placeholder="name@company.com" className={`${inputBase} ${errors.email ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <label className={labelBase}>Pickup Location *</label>
                  <input value={form.pickup} onChange={set("pickup")} placeholder="City, region" className={`${inputBase} ${errors.pickup ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.pickup} />
                </div>
                <div>
                  <label className={labelBase}>Destination *</label>
                  <input value={form.destination} onChange={set("destination")} placeholder="City, region" className={`${inputBase} ${errors.destination ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.destination} />
                </div>
                <div>
                  <label className={labelBase}>Cargo Type</label>
                  <select value={form.cargoType} onChange={set("cargoType")} className={`${inputBase} border-slate-200`}>
                    <option value="">Select cargo type</option>
                    {CARGO_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelBase}>Weight (kg)</label>
                  <input value={form.weight} onChange={set("weight")} inputMode="numeric" placeholder="e.g. 2500" className={`${inputBase} border-slate-200`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelBase}>Special Requirements</label>
                  <textarea value={form.requirements} onChange={set("requirements")} rows={3} placeholder="Temperature control, fragile goods, customs notes..." className={`${inputBase} border-slate-200 resize-none`} />
                </div>
              </div>
              {status.error && <p className="mt-5 text-sm font-medium text-red-500">{status.error}</p>}
              <button type="submit" disabled={status.loading} className="mt-7 w-full text-sm font-bold text-white px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>
                {status.loading ? <>Sending… <Loader2 className="w-4 h-4 animate-spin" /></> : <>Submit Quote Request <Send className="w-4 h-4" /></>}
              </button>
              <p className="mt-3 text-xs text-center text-[#344054]/60">We typically respond within 24 hours. Fields marked * are required.</p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ================= CONTACT PAGE (functional form) =================
const CONTACT_INITIAL = { name: "", email: "", message: "" };

function ContactPage({ onAction }) {
  const [form, setForm] = useState(CONTACT_INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: "" });

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!form.email.trim()) er.email = "Please enter your email.";
    else if (!isEmail(form.email)) er.email = "Please enter a valid email address.";
    if (!form.message.trim()) er.message = "Please enter a message.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ loading: true, error: "" });
    try {
      await submitToWeb3Forms({
        subject: `New Contact Message — ${form.name}`,
        from_name: "Zenit Global Website",
        "Name": form.name,
        "Email": form.email,
        "Message": form.message,
      });
      setForm(CONTACT_INITIAL);
      setStatus({ loading: false, error: "" });
      onAction("Thanks for reaching out — our team will be in touch shortly.");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  const contactCards = [
    { icon: Phone, label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
    { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: MapPin, label: "Location", value: CONTACT.location, href: "https://www.google.com/maps/search/?api=1&query=Centurion+Gauteng+South+Africa" },
  ];

  return (
    <>
      <PageHeader eyebrow="Get In Touch" title="Contact Our Team" />
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div className="space-y-5">
              {contactCards.map((c) => {
                const Icon = c.icon;
                return (
                  <a key={c.label} href={c.href} target={c.label === "Location" ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:border-[#FF7A00]/40 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0B1F3A, #0066FF)" }}><Icon className="w-5 h-5 text-white" /></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-[#344054]/60">{c.label}</p><p className="font-semibold text-[#0B1F3A]">{c.value}</p></div>
                  </a>
                );
              })}
              <div className="rounded-2xl overflow-hidden border border-slate-100 h-56">
                <iframe
                  title="Zenit Global Interlink location — Centurion, Gauteng"
                  src="https://www.google.com/maps?q=Centurion,+Gauteng,+South+Africa&output=embed"
                  className="w-full h-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-100 p-8 shadow-[0_8px_40px_rgba(11,31,58,0.06)]">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <div className="space-y-4">
                <div>
                  <label className={labelBase}>Name *</label>
                  <input value={form.name} onChange={set("name")} placeholder="Your name" className={`${inputBase} ${errors.name ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.name} />
                </div>
                <div>
                  <label className={labelBase}>Email *</label>
                  <input value={form.email} onChange={set("email")} placeholder="you@company.com" className={`${inputBase} ${errors.email ? "border-red-300" : "border-slate-200"}`} />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <label className={labelBase}>Message *</label>
                  <textarea value={form.message} onChange={set("message")} rows={4} placeholder="How can we help?" className={`${inputBase} ${errors.message ? "border-red-300" : "border-slate-200"} resize-none`} />
                  <FieldError msg={errors.message} />
                </div>
                {status.error && <p className="text-sm font-medium text-red-500">{status.error}</p>}
                <button type="submit" disabled={status.loading} className="w-full text-sm font-bold text-white px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0" style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }}>
                  {status.loading ? <>Sending… <Loader2 className="w-4 h-4 animate-spin" /></> : "Send Message"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ================= FOOTER =================
function Footer({ setPage, onAction }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  const subscribe = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setStatus({ loading: false, error: "Enter a valid email." }); return; }
    setStatus({ loading: true, error: "" });
    try {
      await submitToWeb3Forms({
        subject: "New Newsletter Subscription",
        from_name: "Zenit Global Website",
        "Subscriber Email": email,
      });
      setEmail("");
      setStatus({ loading: false, error: "" });
      onAction("You're subscribed — thanks for joining our network updates.");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden" style={{ background: "linear-gradient(165deg, #0B1F3A, #060f1f)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.5), transparent)" }} />
      <div className="absolute -top-40 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,102,255,0.15), transparent 70%)" }} />
      <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,122,0,0.08), transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <Reveal>
          <form onSubmit={subscribe} className="flex flex-col lg:flex-row items-center justify-between gap-6 p-7 lg:p-9 rounded-3xl border border-white/10 backdrop-blur-sm mb-16" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div>
              <h3 className="font-extrabold text-xl lg:text-2xl text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Stay In The Loop</h3>
              <p className="text-sm text-blue-100/60 mt-1">Logistics insights and network updates, straight to your inbox.</p>
              {status.error && <p className="text-xs text-red-300 mt-1.5">{status.error}</p>}
            </div>
            <div className="flex w-full lg:w-auto items-center gap-3">
              <input value={email} onChange={(e) => { setEmail(e.target.value); setStatus({ loading: false, error: "" }); }} type="email" placeholder="you@company.com" className="flex-1 lg:w-64 h-12 px-4 rounded-xl border border-white/15 bg-white/5 text-sm text-white placeholder:text-blue-100/40 leading-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40" />
              <button type="submit" disabled={status.loading} style={{ background: "linear-gradient(135deg, #FF7A00, #FF9933)" }} className="h-12 px-5 rounded-xl text-sm font-bold text-white shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none disabled:opacity-70">
                {status.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe <Send className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </form>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-2">
            <LogoLockup light />
            <p className="mt-5 text-sm text-blue-100/60 leading-relaxed max-w-xs">Taking You To Greater Heights — reliable freight, import, export, and supply chain solutions across South Africa and beyond.</p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} target={href !== "#" ? "_blank" : undefined} rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-blue-100/70 hover:text-white hover:border-[#FF7A00] hover:bg-white/5 transition-all"><Icon className="w-4 h-4" /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/60">
              {SERVICES.slice(0,5).map(s => <li key={s.title} onClick={() => { setPage("services"); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">{s.title}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-blue-100/60">
              <li onClick={() => { setPage("about"); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li onClick={() => { setPage("industries"); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">Industries</li>
              <li onClick={() => { setPage("network"); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">Global Network</li>
              <li onClick={() => { setPage("faq"); window.scrollTo(0, 0); }} className="hover:text-white cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-blue-100/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FF7A00]" /> <a href={CONTACT.phoneHref} className="hover:text-white transition-colors">{CONTACT.phone}</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FF7A00]" /> <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">{CONTACT.email}</a></li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FF7A00]" /> Centurion, Gauteng, SA</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-blue-100/40">
          <span>© 2026 Zenit Global Interlink Pty Ltd. All rights reserved.</span>
          <span className="italic">Taking You To Greater Heights</span>
        </div>
      </div>
    </footer>
  );
}

// ================= APP =================
export default function ZenitSite() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const handleAction = (msg) => setToast(msg);

  const pages = {
    home: <HomePage setPage={setPage} />,
    services: <ServicesPage setPage={setPage} />,
    industries: <IndustriesPage />,
    about: <AboutPage />,
    network: <NetworkPage />,
    faq: <FAQPage />,
    quote: <QuotePage onAction={handleAction} />,
    contact: <ContactPage onAction={handleAction} />,
  };

  return (
    <div className="w-full bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Nav page={page} setPage={setPage} />
      {pages[page] || pages.home}
      <Footer setPage={setPage} onAction={handleAction} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
