import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, animate, useInView } from 'motion/react';
import { 
  FileText, TrendingUp, Users, ListCheck, Settings, CheckCircle2, 
  Shield, Calendar, ArrowRight, ArrowDown, Menu, X, Mail, Phone
} from 'lucide-react';
import { VoiceAgent } from './components/VoiceAgent';

const CALENDLY_LINK = "https://calendly.com/workwithpaarthpandya/30min";
const WHATSAPP_LINK = "https://wa.me/919099690220";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-10%" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate(v) {
          if (nodeRef.current) {
            nodeRef.current.textContent = prefix + Math.round(v).toString() + suffix;
          }
        }
      });
      return controls.stop;
    }
  }, [inView, value, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand-accent z-[60] origin-left" style={{ scaleX }} />
      <nav className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled ? 'top-4 px-6 md:px-8' : 'top-0 px-6 md:px-8'}`}>
        <div className={`mx-auto transition-all duration-500 flex items-center justify-between ${scrolled ? 'max-w-[1000px] bg-brand-bg/95 backdrop-blur-xl border border-brand-dark/10 shadow-lg rounded-full py-3 px-6' : 'max-w-[1100px] bg-transparent py-6'}`}>
          <div className="font-display text-xl font-medium text-brand-primary tracking-tight">
            Parth <span className="text-brand-dark font-light italic">K. Pandya</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">Services</a>
            <a href="#process" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">Process</a>
            <a href="#results" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">Results</a>
            <a href="#stack" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">Stack</a>
            <a href="#faq" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">FAQ</a>
            <a href="#about" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">About</a>
            <a href="#contact" className="text-[13px] font-medium text-brand-dark/70 hover:text-brand-accent tracking-wide border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 py-1">Contact</a>
            <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" className="bg-[#B8960C] text-white text-[13px] font-medium px-6 py-2.5 rounded hover:bg-[#9A7A0A] hover:shadow-[0_4px_12px_rgba(184,150,12,0.3)] transition-all duration-200 ml-2">Book a Call</a>
          </div>

          <button className="md:hidden text-brand-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="md:hidden absolute top-[calc(100%+16px)] left-6 right-6 bg-white border border-brand-dark/10 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-5">
                <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">Services</a>
                <a href="#process" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">Process</a>
                <a href="#results" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">Results</a>
                <a href="#stack" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">Stack</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">FAQ</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">About</a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-brand-dark/70 hover:text-brand-accent border-b-2 border-transparent hover:border-brand-accent transition-all duration-200 w-max pb-1">Contact</a>
                <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)} className="bg-[#B8960C] hover:bg-[#9A7A0A] hover:shadow-[0_4px_12px_rgba(184,150,12,0.3)] transition-all duration-200 text-white text-center py-3 rounded-lg text-sm font-medium">Book a Call</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

function Hero() {
  return (
    <section className="relative bg-brand-bg bg-grain bg-grid pt-48 pb-24 lg:pt-56 lg:pb-32 overflow-hidden">
      <div className="absolute top-10 left-10 w-[40vw] h-[40vw] bg-brand-accent/5 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
      <div className="absolute top-0 right-0 w-[45%] h-full bg-brand-primary-light/50 [clip-path:polygon(12%_0,100%_0,100%_100%,0%_100%)] -z-10 hidden lg:block"></div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center"
      >
        <div>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2.5 bg-brand-accent-light/50 text-brand-accent text-[11px] font-semibold tracking-[1.5px] uppercase px-4 py-2 rounded-sm mb-8 border border-brand-accent/20 shadow-sm">
            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></span>
            MCA Operations · Live Portfolio
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="font-display text-[clamp(38px,4vw,60px)] font-bold leading-[1.1] tracking-tight mb-6">
            I run the operations<br/>your <em className="text-brand-primary font-light italic">deals depend on.</em>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base text-brand-dark/70 leading-relaxed mb-10 max-w-[460px]">
            Specialized MCA & commercial lending operations — pre-underwriting through collections — for US & Canadian firms. No overhead. No ramp-up. Embedded from day one.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-5">
            <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" className="group bg-[#B8960C] text-white font-medium text-sm px-8 py-3.5 rounded hover:bg-[#9A7A0A] hover:shadow-[0_4px_12px_rgba(184,150,12,0.3)] transition-all duration-200 flex items-center gap-2">
              Book a Strategy Call <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform ease-out text-white" />
            </a>
            <a href="#results" className="group text-brand-dark text-sm font-medium border-b border-brand-dark/20 pb-0.5 hover:text-brand-accent hover:border-brand-accent transition-colors flex items-center gap-1.5 pl-2">
              See Case Studies <ArrowDown className="w-4 h-4 opacity-70 group-hover:translate-y-1 transition-transform ease-out text-[#B8960C]" />
            </a>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="bg-white border border-brand-dark/5 rounded-2xl p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] lg:max-w-md mx-auto w-full relative group">
          <div className="absolute inset-0 border-2 border-brand-accent/0 group-hover:border-brand-accent/20 transition-colors duration-500 rounded-2xl z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="font-mono text-[10px] text-brand-accent font-semibold tracking-[1.5px] uppercase mb-6 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-brand-dark/5">
              Live Engagement · NY Firm
            </div>
            
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div className="bg-brand-primary rounded-xl p-5 text-white shadow-inner transform transition-transform hover:scale-[1.02]">
                <div className="font-display text-4xl font-bold leading-none mb-2 text-[#B8960C]">
                  <AnimatedNumber value={100} suffix="+" />
                </div>
                <div className="text-[11px] font-medium text-white/70 leading-tight">Deals managed / mo</div>
              </div>
              <div className="bg-brand-gray/50 rounded-xl p-5 border border-brand-dark/5 transform transition-transform hover:scale-[1.02]">
                <div className="font-display text-3xl font-bold text-[#B8960C] leading-none mb-2">
                  <AnimatedNumber value={10} suffix="yr" />
                </div>
                <div className="text-[11px] font-medium text-brand-dark/60 leading-tight">In MCA & alt-lending ops</div>
              </div>
              <div className="bg-brand-gray/50 rounded-xl p-5 border border-brand-dark/5 transform transition-transform hover:scale-[1.02]">
                <div className="font-display text-3xl font-bold text-[#B8960C] leading-none mb-2">
                  <AnimatedNumber value={500} suffix="+" />
                </div>
                <div className="text-[11px] font-medium text-brand-dark/60 leading-tight">Files underwritten</div>
              </div>
              <div className="bg-brand-gray/50 rounded-xl p-5 border border-brand-dark/5 transform transition-transform hover:scale-[1.02]">
                <div className="font-display text-3xl font-bold text-[#B8960C] leading-none mb-2">
                  <AnimatedNumber value={2} />
                </div>
                <div className="text-[11px] font-medium text-brand-dark/60 leading-tight">Dual market coverage</div>
              </div>
            </div>
            
            <div className="h-[1px] bg-brand-dark/5 my-6"></div>
            
            <div className="font-mono text-[10px] text-brand-dark/50 font-semibold tracking-[1.5px] uppercase mb-4">
              Active Platforms
            </div>
            <div className="flex flex-wrap gap-2">
              {['LendSaaS', 'Datamerch', 'Ocrolus', 'Encompass'].map(tool => (
                 <span key={tool} className="font-mono text-[10px] font-semibold text-brand-primary bg-brand-primary-light/40 px-3 py-1.5 rounded-sm tracking-wide border border-brand-primary/10">
                   {tool}
                 </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ProofStrip() {
  return (
    <div className="bg-brand-primary py-12 px-6 bg-grain bg-texture-green shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]" style={{ background: 'radial-gradient(ellipse at center, #1a3a2a 0%, #0f2318 100%)' }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10 relative z-10">
        {[
          { num: <AnimatedNumber value={100} suffix="+" />, label: 'Deals managed\nper month, live' },
          { num: <AnimatedNumber value={500} suffix="+" />, label: 'Commercial files\nprocessed & reviewed' },
          { num: <AnimatedNumber value={2} />, label: 'Markets — US & Canada,\nboth regulatory environments' },
          { num: <span className="flex items-center gap-1"><span className="text-2xl mt-1">&lt;</span><AnimatedNumber value={4} suffix="hr" /></span>, label: 'Response window\nduring EST business hours' }
        ].map((item, idx) => (
          <div key={idx} className="lg:px-10 py-2 first:pl-0 last:pr-0">
            <div className="font-display text-4xl font-bold text-brand-accent leading-none mb-3">{item.num}</div>
            <div className="text-xs text-brand-primary-light/70 font-medium leading-relaxed whitespace-pre-line">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseStudies() {
  const cases = [
    {
      domain: 'MCA · Full-Cycle Operations',
      title: 'Managing end-to-end deal flow for a NY-based MCA firm — pre-underwriting through post-funding across US and Canadian portfolios.',
      result: '100+ active deals per month, dual-market, zero pipeline confusion'
    },
    {
      domain: 'Underwriting · Ocrolus + LendSaaS',
      title: 'Processed 500+ commercial and real estate files inside Encompass and Ocrolus — verifying credit, tax returns, statements against requirements.',
      result: 'Consistent submission accuracy, reduced documentation gaps'
    },
    {
      domain: 'Syndication · File Coordination',
      title: 'Organized and coordinated syndication files across funded deals — structured for quick review, clean handoff, and zero confusion at closing.',
      result: 'Clean closings, no rework, participants always in sync'
    },
    {
      domain: 'Collections · Aging Analysis',
      title: 'Built aging reports and delinquency tracking systems that surface at-risk accounts before they become defaults — structured remote updates.',
      result: 'Early pattern detection, proactive collections'
    }
  ];

  return (
    <section id="results" className="py-24 lg:py-32 px-6 bg-brand-bg bg-grain border-b border-brand-dark/5 relative">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-accent/5 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50"></div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-[1100px] mx-auto relative z-10"
      >
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">
          Representative Experience
        </motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          What I've built <em className="text-brand-primary font-light italic">inside live operations.</em>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cases.map((col, i) => (
             <motion.div variants={fadeInUp} key={i} className={`bg-white border border-brand-dark/5 rounded-xl p-8 relative overflow-hidden group hover:border-brand-accent/40 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-[3px] ${i === 0 ? "border-l-[3px] border-l-[#B8960C]" : ""}`}>
               <div className="absolute top-0 left-0 w-[4px] h-0 bg-brand-accent group-hover:h-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"></div>
               <div className="font-mono text-[10px] text-brand-dark/40 font-semibold tracking-[1px] uppercase mb-4">
                 {col.domain}
               </div>
               <div className="text-[16px] font-semibold text-brand-dark leading-relaxed mb-6">
                 {col.title}
               </div>
               <div className="flex items-start gap-2.5 bg-brand-bg rounded-md px-4 py-3 text-[13px] font-medium text-brand-primary border border-brand-dark/5 group-hover:bg-brand-accent-light/30 transition-colors">
                 <span className="text-[14px] mt-px flex-shrink-0 text-[#B8960C] group-hover:-translate-y-0.5 transition-transform delay-100">&uarr;</span>
                 {col.result}
               </div>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Services() {
  const services = [
    { icon: <FileText className="w-6 h-6 text-brand-accent" />, name: 'MCA Underwriting Support', desc: 'Pre & post underwriting across Ocrolus, LendSaaS. Files verified without relaxing criteria.' },
    { icon: <TrendingUp className="w-6 h-6 text-brand-accent" />, name: 'Financial Reporting', desc: 'Cash flow reports & KPI dashboards giving management real-time visibility. Audit-ready.' },
    { icon: <Users className="w-6 h-6 text-brand-accent" />, name: 'Syndication File Coordination', desc: 'Multi-participant deals tracked cleanly. No dropped balls between funders.' },
    { icon: <ListCheck className="w-6 h-6 text-brand-accent" />, name: 'Collections & Aging', desc: 'Delinquency tracking & structured leadership updates. Surface problems before defaults.' },
    { icon: <Settings className="w-6 h-6 text-brand-accent" />, name: 'Workflow Automation', desc: 'Excel macros, reporting templates, and documented SOPs replacing manual human loops.' },
    { icon: <CheckCircle2 className="w-6 h-6 text-brand-accent" />, name: 'Back-Office Operations', desc: 'Full operational pipeline managed smoothly without adding internal headcount.' }
  ];

  return (
    <section id="services" className="py-24 lg:py-32 px-6 bg-brand-gray border-b border-brand-dark/5 bg-grain bg-grid rounded-tr-[40px] rounded-bl-[40px] shadow-sm relative z-20 -my-4">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto relative z-10">
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">What I Do</motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          Every service built for <em className="text-brand-primary font-light italic">one outcome: clean deals.</em>
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
             <motion.div variants={fadeInUp} key={i} className={`bg-white border border-brand-dark/5 rounded-2xl p-8 shadow-sm hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 group ${i === 0 ? "border-l-[3px] border-l-[#B8960C]" : ""}`}>
               <div className="w-14 h-14 bg-brand-bg border border-brand-dark/5 group-hover:bg-brand-accent-light/50 group-hover:border-brand-accent/30 transition-colors rounded-xl flex items-center justify-center mb-6 shadow-sm">{svc.icon}</div>
               <div className="text-[16px] font-semibold text-brand-primary mb-3">{svc.name}</div>
               <div className="text-[14px] text-brand-dark/60 leading-relaxed font-medium">{svc.desc}</div>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Process() {
  const steps = [
    { num: '01', title: 'Discovery call or an Email', desc: 'Identify bottlenecks and map to your exact current workflow tools.' },
    { num: '02', title: 'NDA + Agreement', desc: 'Secure mutual NDA. Data protected from day one.' },
    { num: '03', title: '3–5 Day Kickoff', desc: 'Initial work delivered. Transparent task updates and time logs.' },
    { num: '04', title: 'Continuous Scaling', desc: 'Mon–Fri availability in EST. Response within max 4 hours.' },
  ];

  return (
    <section id="process" className="py-24 lg:py-32 px-6 bg-white border-b border-brand-dark/5 bg-grid">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto relative z-10 pt-8">
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">How I Work</motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          From first call to <em className="text-brand-primary font-light italic">embedded operations.</em>
        </motion.h2>

        <motion.div variants={fadeInUp} className="relative mb-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-dark/10 hidden lg:block -translate-y-1/2 z-0"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, i) => (
               <div key={i} className={`bg-brand-bg border border-brand-dark/5 rounded-2xl p-8 relative shadow-sm group hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 ${i === 0 ? "border-l-[3px] border-l-[#B8960C]" : ""}`}>
                  <div className="font-display text-4xl font-bold text-[#B8960C]/20 group-hover:text-brand-accent transition-colors mb-4">{step.num}.</div>
                  <div className="text-[16px] font-bold text-brand-dark mb-2">{step.title}</div>
                  <div className="text-[13px] text-brand-dark/60 leading-relaxed font-medium">{step.desc}</div>
               </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What is an MCA operations specialist?",
      a: "I manage the full back-office workflow for merchant cash advance firms — from pre-underwriting and file review through syndication coordination, collections, and financial reporting. I essentially operate as a high-level, remote extension of your internal team."
    },
    {
      q: "What MCA platforms do you work with?",
      a: "I work with LendSaaS, Datamerch, Ocrolus, Encompass, and SAP — the core platforms used by serious MCA and commercial lending operations across the US and Canada."
    },
    {
      q: "Do you work with both US and Canadian MCA firms?",
      a: "Yes. I provide operations support across both markets, understanding the specific regulatory environments, deal structures, and underwriting differences for both US and Canadian portfolios."
    },
    {
      q: "How quickly can you start managing my operations?",
      a: "Initial work is delivered within 3-5 business days of kickoff. I don't require a 30-day ramp-up period because I arrive already trained on the industry's standard tech stack. I'm available Mon-Fri, 9AM-5PM EST."
    }
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 px-6 bg-brand-bg bg-grain border-b border-brand-dark/5">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-[1100px] mx-auto relative z-10"
      >
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">Questions & Answers</motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          Frequently Asked <em className="text-brand-primary font-light italic">Questions.</em>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {faqs.map((faq, i) => (
            <motion.div variants={fadeInUp} key={i} className="group">
              <div className="text-[17px] font-bold text-brand-primary mb-3 flex items-start gap-3">
                <span className="text-brand-accent font-mono text-sm mt-1">0{i+1}.</span>
                {faq.q}
              </div>
              <div className="text-[14px] text-brand-dark/65 leading-relaxed font-medium pl-8 border-l border-brand-dark/5 group-hover:border-brand-accent/30 transition-colors">
                {faq.a}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 lg:py-32 px-6 text-white bg-grain bg-texture-green overflow-hidden relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]" style={{ background: 'radial-gradient(ellipse at center, #1a3a2a 0%, #0f2318 100%)' }}>
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-accent/5 rounded-full blur-[100px] -z-10"></div>
      
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        <div>
          <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">Behind the Operations</motion.div>
          <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-white leading-[1.2] mb-8 tracking-tight">
            I don't run an agency. <br/><em className="text-brand-accent-light font-light italic">I run your back-office.</em>
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="space-y-6 text-[15px] text-white/70 leading-relaxed font-medium">
            <p>
              In the MCA and commercial lending space, the biggest risk isn't the deal itself—it's the operational drag that causes deals to fall through. 
            </p>
            <p>
              Over the last 10 years, I've seen firsthand how poor file management, slow underwriting, and disorganized syndication can cost firms millions. I built this independent practice to provide US and Canadian firms with a direct, high-level operational partner.
            </p>
            <p>
              When you hire me, you aren't getting passed down to a junior account manager. You get my direct expertise, my systems, and my full commitment to keeping your pipeline moving.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-3">
            {['10+ Years Experience', 'Direct Communication', 'No Junior Staff', 'Cross-Border Expert'].map(pill => (
              <span key={pill} className="bg-white/10 text-white font-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-full border border-white/10">{pill}</span>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-brand-primary-dark relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 mix-blend-luminosity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark via-transparent to-transparent opacity-80"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="font-display text-2xl font-bold text-white mb-1">Parth K. Pandya</div>
              <div className="text-brand-accent font-medium text-[13px]">Lead Operations Specialist</div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-accent rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-20"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="pt-24 pb-[60px] lg:pt-32 lg:pb-[60px] px-6 bg-brand-gray border-b border-brand-dark/5 bg-grain bg-grid relative z-20">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto relative z-10">
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">WHAT CLIENTS SAY</motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          Operators who've worked inside live pipelines with me.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div variants={fadeInUp} className="bg-[#FAFAF7] border border-brand-dark/5 rounded-xl p-8 relative shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-[3px] border-l-[3px] border-l-[#B8960C] flex flex-col justify-between">
            <div>
              <div className="text-[18px] font-medium text-brand-dark leading-relaxed mb-6">
                "Parth embedded within days. No handholding, no ramp-up. He ran the pipeline like he'd been there for years."
              </div>
            </div>
            <div>
              <div className="font-bold text-[15px] text-brand-dark">Head of Operations, NY-based MCA Firm</div>
              <div className="text-[12px] font-medium text-brand-dark/50 mt-1">(reference available upon request)</div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="border-2 border-dashed border-brand-accent/30 rounded-xl p-8 relative flex items-center justify-center min-h-[220px] bg-brand-bg/50">
            <div className="text-[15px] font-medium text-brand-accent">
              Second reference — coming soon
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function TechStack() {
  const categories = [
    { name: 'MCA & Underwriting', tools: ['LendSaaS', 'Datamerch', 'Ocrolus', 'Encompass'] },
    { name: 'Reporting & Analytics', tools: ['Advanced Excel', 'VBA & Macros', 'Pivot Tables', 'Google Workspace'] },
    { name: 'Project Management', tools: ['Asana', 'Trello', 'Monday.com', 'Notion'] },
  ];

  return (
    <section id="stack" className="py-24 lg:py-32 px-6 bg-brand-bg bg-grain border-b border-brand-dark/5">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto relative z-10">
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-12 tracking-tight">
          Platforms I work in <em className="text-brand-primary font-light italic">every day.</em>
        </motion.h2>

        <motion.div variants={fadeInUp} className="border border-brand-dark/10 rounded-2xl bg-white shadow-sm overflow-hidden w-full overflow-x-auto">
           <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
               <tr className="bg-brand-gray border-b border-brand-dark/10">
                 <th className="py-4 px-6 text-[11px] font-bold text-brand-dark/50 uppercase tracking-[1.5px] w-[240px]">Category</th>
                 <th className="py-4 px-6 text-[11px] font-bold text-brand-dark/50 uppercase tracking-[1.5px]">Tools</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-brand-dark/5">
               {categories.map((cat, i) => (
                 <tr className={`hover:bg-brand-gray/30 transition-colors ${i === 0 ? "border-l-[3px] border-l-[#B8960C]" : ""}`} key={i}>
                   <td className="py-5 px-6 text-[15px] font-semibold text-brand-primary">{cat.name}</td>
                   <td className="py-5 px-6">
                     <div className="flex flex-wrap gap-2.5">
                       {cat.tools.map(tool => (
                         <span key={tool} className={`font-mono text-[11px] font-semibold px-3 py-1.5 rounded-sm bg-brand-bg border border-brand-dark/5 text-brand-dark/70 hover:border-brand-accent/50 hover:text-brand-accent transition-colors cursor-default`}>
                           {tool}
                         </span>
                       ))}
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </motion.div>
      </motion.div>
    </section>
  );
}

function IndustryInsights() {
  const insights = [
    {
      title: "Ocrolus is catching what humans miss",
      desc: "After processing 500+ files through Ocrolus, I've seen it flag income inconsistencies that manual review skipped. Firms not using it are underwriting blind.",
      trend: "WHAT I'M SEEING"
    },
    {
      title: "Dual-market files break single-market ops",
      desc: "US and Canadian deals run on different compliance rails. Most back-office setups aren't built for both. Mine is.",
      trend: "PIPELINE REALITY"
    },
    {
      title: "Aging reports prevent defaults — if you run them weekly",
      desc: "I build structured aging reports that surface at-risk accounts before they miss. Most firms wait until it's too late.",
      trend: "COLLECTIONS TRUTH"
    },
    {
      title: "3–5 days is enough to be fully embedded",
      desc: "No 30-day ramp-up. By day three I know your tools, your pipeline, and your problem accounts. That's the standard I hold myself to.",
      trend: "ONBOARDING REALITY"
    }
  ];

  return (
    <section id="insights" className="py-24 lg:py-32 px-6 bg-white border-b border-brand-dark/5 bg-grid">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="max-w-[1100px] mx-auto relative z-10">
        <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent tracking-[2px] uppercase mb-4">
          Latest Trends
        </motion.div>
        <motion.h2 variants={fadeInUp} className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-brand-dark leading-[1.2] mb-16 tracking-tight max-w-3xl">
          Industry Insights: <em className="text-brand-primary font-light italic">MCA & Commercial Lending.</em>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {insights.map((insight, i) => (
             <motion.div variants={fadeInUp} key={i} className={`bg-brand-bg border border-brand-dark/5 rounded-xl p-8 relative overflow-hidden group hover:border-[#B8960C]/30 shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-[3px] ${i === 0 ? "border-l-[3px] border-l-[#B8960C]" : ""}`}>
               <div className="font-mono text-[10px] text-brand-dark/50 font-semibold tracking-[1px] uppercase mb-4 py-1 px-3 bg-brand-dark/5 inline-block rounded-sm">
                 {insight.trend}
               </div>
               <div className="text-[18px] font-bold text-brand-dark leading-relaxed mb-4">
                 {insight.title}
               </div>
               <div className="text-[14px] font-medium text-brand-dark/70 leading-relaxed">
                 {insight.desc}
               </div>
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'submitted'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameInput = (document.getElementById('name') as HTMLInputElement).value;
    const emailInput = (document.getElementById('email') as HTMLInputElement).value;
    const messageInput = (document.getElementById('message') as HTMLTextAreaElement).value;

    const subject = `Inquiry from ${nameInput}`;
    const body = `Name: ${nameInput}\nEmail: ${emailInput}\n\n${messageInput}`;
    
    // WhatsApp URL
    const waText = `Name: ${nameInput}%0AEmail: ${emailInput}%0A%0A${messageInput}`;
    const waUrl = `https://wa.me/919099690220?text=${waText}`;
    const mailUrl = `mailto:workwithpaarthpandya@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setFormState('submitting');
    
    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');
    // Open email client
    window.location.href = mailUrl;

    setTimeout(() => {
      setFormState('submitted');
      // Reset form after a bit
      setTimeout(() => setFormState('idle'), 5000);
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md text-left flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h3 className="text-xl font-display font-bold text-white mb-2">Send a Message</h3>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-white/70 text-xs font-semibold uppercase tracking-wide">Name</label>
        <input required type="text" id="name" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent transition-colors" placeholder="John Doe" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-white/70 text-xs font-semibold uppercase tracking-wide">Email</label>
        <input required type="email" id="email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent transition-colors" placeholder="john@example.com" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-white/70 text-xs font-semibold uppercase tracking-wide">Message</label>
        <textarea required id="message" rows={4} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-accent transition-colors resize-none" placeholder="Tell me about your operations..."></textarea>
      </div>

      <button
        type="submit"
        disabled={formState !== 'idle'}
        className="mt-2 bg-[#B8960C] hover:bg-[#9A7A0A] hover:shadow-[0_4px_12px_rgba(184,150,12,0.3)] transition-all duration-200 hover:-translate-y-[2px] disabled:bg-[#B8960C]/50 disabled:cursor-not-allowed text-white font-medium text-sm px-8 py-3.5 rounded shadow-lg outline-none flex items-center justify-center gap-2"
      >
        {formState === 'idle' && 'Send Message'}
        {formState === 'submitting' && (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        )}
        {formState === 'submitted' && <CheckCircle2 className="w-5 h-5 text-white" />}
      </button>

      {formState === 'submitted' && (
        <div className="text-brand-accent-light text-sm text-center mt-2 font-medium">Message sent! I'll get back to you soon.</div>
      )}
    </form>
  );
}

function CTA() {
  return (
    <section id="contact" className="py-24 lg:py-32 px-6 bg-texture-green relative overflow-hidden bg-grain shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]" style={{ background: 'radial-gradient(ellipse at center, #1a3a2a 0%, #0f2318 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-brand-accent opacity-[0.05] blur-[100px] point-events-none"></div>
      
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }} className="relative z-10 max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
         <div>
           <motion.div variants={fadeInUp} className="font-mono text-[11px] font-semibold text-brand-accent/80 tracking-[2px] uppercase mb-6">Ready to scale securely?</motion.div>
           <motion.h2 variants={fadeInUp} className="font-display text-[clamp(34px,5vw,52px)] font-bold text-white leading-[1.1] mb-6 tracking-tight">
             Let's put your back-office on <em className="text-brand-accent-light font-light italic">autopilot.</em>
           </motion.h2>
           <motion.p variants={fadeInUp} className="text-[17px] text-white/70 leading-relaxed mb-12 font-medium">
             If your team is closing deals but the operations are creating drag — that's the problem I solve. One call. Zero fluff.
           </motion.p>
           
           <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-10">
             <a href={CALENDLY_LINK} target="_blank" rel="noreferrer" className="group bg-[#B8960C] hover:bg-[#9A7A0A] hover:shadow-[0_4px_12px_rgba(184,150,12,0.3)] text-white font-medium text-sm px-8 py-4 rounded shadow-xl transition-all duration-200 outline-none flex items-center justify-center gap-2 hover:-translate-y-1">
               Book a Strategy Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-white" />
             </a>
             <a href="mailto:workwithpaarthpandya@gmail.com" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center font-medium text-sm px-8 py-4 rounded transition-all outline-none backdrop-blur-md">
               Email Directly
             </a>
           </motion.div>

           <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
             <a href="https://www.linkedin.com/in/parthpandya28/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
               </svg>
               LinkedIn
             </a>
             <a href="mailto:workwithpaarthpandya@gmail.com" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">
               <Mail className="w-5 h-5 flex-shrink-0" />
               workwithpaarthpandya@gmail.com
             </a>
             <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                 <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 0 0 1.333 4.993L2 22.011l5.233-1.37A9.983 9.983 0 0 0 12.012 22c5.506 0 9.989-4.478 9.989-9.984S17.518 2 12.012 2zm0 18.3A8.327 8.327 0 0 1 7.74 19.1l-.3-.18-3.08.8.82-3-.2-.31a8.318 8.318 0 0 1-1.3-4.41c0-4.58 3.74-8.31 8.33-8.31s8.33 3.73 8.33 8.31-3.74 8.31-8.33 8.31zm4.56-6.23c-.25-.13-1.48-.73-1.71-.82-.23-.08-.4-.13-.57.13-.17.25-.65.82-.79.98-.15.17-.3.19-.55.06a6.836 6.836 0 0 1-2.01-1.24 7.502 7.502 0 0 1-1.4-1.74c-.15-.25-.01-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.13-.57-1.38-.79-1.89-.2-.5-.42-.43-.57-.44-.15-.01-.32-.01-.49-.01a.94.94 0 0 0-.67.31c-.23.25-.87.85-.87 2.07s.9 2.4 1.02 2.56c.13.17 1.74 2.66 4.22 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.55.1.48-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.08-.12-.29-.19-.54-.31z" />
               </svg>
               WhatsApp
             </a>
             <span className="flex items-center gap-2 text-sm font-medium text-white/70">
               <Phone className="w-5 h-5 flex-shrink-0" />
               +91 - 909 - 969 0220
             </span>
           </motion.div>
         </div>

         <motion.div variants={fadeInUp}>
           <ContactForm />
         </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-dark py-12 px-6 border-t border-white/5">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="font-display text-xl font-bold text-white">
            Parth <span className="text-white/50 font-light italic">K. Pandya</span>
         </div>
         <div className="w-full pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs font-medium text-white/30 text-center md:text-left mt-2">
            <span>© 2025 Parth K. Pandya. All rights reserved.</span>
            <span>Financial Ops Specialist</span>
         </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen font-sans text-brand-dark bg-brand-bg selection:bg-brand-primary selection:text-white">
      <NavBar />
      <Hero />
      <ProofStrip />
      <Services />
      <Process />
      <CaseStudies />
      <Testimonials />
      <TechStack />
      <IndustryInsights />
      <FAQ />
      <About />
      <CTA />
      <Footer />
      <VoiceAgent />
    </div>
  );
}
