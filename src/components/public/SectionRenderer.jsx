import { useMemo, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import cvFile from '../../cv-younes-kamouly.pdf';
import { sendContactMessage } from '../../utils/contactApi';
import { trackAnalyticsEvent } from '../../utils/analytics';
import { uiText } from '../../utils/i18n';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.45 },
};

const skillAccentByName = {
  react: '#61dafb',
  javascript: '#f7df1e',
  java: '#f7df1e',
  'node.js': '#8cc84b',
  node: '#8cc84b',
  mongodb: '#4db33d',
  tailwind: '#38bdf8',
  'tailwind css': '#38bdf8',
  fastapi: '#22c55e',
  python: '#facc15',
  typescript: '#3b82f6',
  html: '#f97316',
  css: '#0ea5e9',
};

const skillIconByName = {
  react: 'https://cdn.simpleicons.org/react/61DAFB',
  javascript: 'https://cdn.simpleicons.org/javascript/F7DF1E',
  java: 'https://cdn.simpleicons.org/openjdk/F7DF1E',
  'node.js': 'https://cdn.simpleicons.org/nodedotjs/8CC84B',
  node: 'https://cdn.simpleicons.org/nodedotjs/8CC84B',
  mongodb: 'https://cdn.simpleicons.org/mongodb/4DB33D',
  tailwind: 'https://cdn.simpleicons.org/tailwindcss/38BDF8',
  'tailwind css': 'https://cdn.simpleicons.org/tailwindcss/38BDF8',
  fastapi: 'https://cdn.simpleicons.org/fastapi/22C55E',
  python: 'https://cdn.simpleicons.org/python/FACC15',
  typescript: 'https://cdn.simpleicons.org/typescript/3B82F6',
  html: 'https://cdn.simpleicons.org/html5/F97316',
  css: 'https://cdn.simpleicons.org/css/0EA5E9',
};

function Tilt3DCard({ children, className = '', innerClassName = '', maxTilt = 10 }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.7 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.7 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.22), transparent 38%)`;

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const onMove = (event) => {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * (maxTilt * 2));
    rotateX.set((0.5 - py) * (maxTilt * 2));
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={resetTilt} className={`scene-3d ${className}`}>
      <motion.div style={{ rotateX: springX, rotateY: springY }} className={`card-3d ${innerClassName}`}>
        {children}
        <motion.div aria-hidden className="card-glare" style={{ background: glare }} />
      </motion.div>
    </div>
  );
}

function Hero({ section, meta, t }) {
  const data = section.data;
  const heroName = (meta?.name || 'Developer').split(' ')[0].toUpperCase();
  const secondaryText = String(data.ctaSecondary || '').toLowerCase();
  const secondaryIsCv = secondaryText.includes('cv');
  const secondaryHref = secondaryIsCv ? cvFile : '#contact';
  return (
    <section id={section.id} className="arch-hero grid min-h-[88vh] items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr]">
      <motion.div {...reveal}>
        <p className="arch-kicker">{'>_ SYSTEM_INIT'}</p>
        <h1 className="arch-hero-title">
          {t.hiIm}
          <span className="arch-outline"> {heroName}</span>
        </h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-zinc-100 md:text-2xl">{data.title}</p>
        <p className="mt-5 max-w-2xl text-zinc-300">{data.subtitle}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href="#projects" className="arch-btn-primary px-7 py-3 text-sm font-bold uppercase tracking-[0.08em]">
            {data.ctaPrimary}
          </a>
          <a
            href={secondaryHref}
            download={secondaryIsCv ? 'younes-cv.pdf' : undefined}
            target={secondaryIsCv ? '_blank' : undefined}
            rel={secondaryIsCv ? 'noreferrer' : undefined}
            className="arch-btn-secondary px-7 py-3 text-sm font-bold uppercase tracking-[0.08em]"
          >
            {data.ctaSecondary}
          </a>
          <p className="max-w-md border-l border-zinc-700 pl-4 text-sm uppercase tracking-[0.06em] text-zinc-300">
            {t.heroCaption}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.stats?.map((stat, idx) => (
            <div key={stat.label} className="arch-stat p-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">{`0${idx + 1}_${stat.label.replaceAll(' ', '_').toUpperCase()}`}</p>
              <p className="mt-1 font-display text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...reveal}>
        <Tilt3DCard className="group" maxTilt={6} innerClassName="arch-frame p-4">
          <p className="arch-frame-label">USER_PROFILE</p>
          <img src={data.image} alt={t.profileVisual} className="arch-hero-image h-[420px] w-full border border-zinc-800 object-cover" style={{ transform: 'translateZ(34px)' }} />
          <div className="mt-3 flex flex-wrap gap-2">
            {data.badges?.map((badge) => (
              <span key={badge} className="arch-chip px-2 py-1 text-[11px] uppercase tracking-[0.08em]" style={{ transform: 'translateZ(24px)' }}>
                {badge}
              </span>
            ))}
          </div>
        </Tilt3DCard>
      </motion.div>
    </section>
  );
}

function About({ section, t }) {
  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <h2 className="font-display text-3xl font-bold">{t.about}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <p className="text-zinc-300">{section.data.body}</p>
        </article>
        <div className="space-y-3">
          {section.data.values?.map((value) => (
            <div key={value} className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-zinc-200">
              {value}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        {section.data.timeline?.map((item) => (
          <div key={item} className="relative mb-3 pl-5 last:mb-0">
            <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-brand-red" />
            <p className="text-zinc-300">{item}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function Projects({ section, t }) {
  const [activeTag, setActiveTag] = useState('ALL');
  const [openCase, setOpenCase] = useState(null);
  const allTags = useMemo(() => {
    const raw = (section.data.items || []).flatMap((project) => project.tags || []);
    return ['ALL', ...Array.from(new Set(raw))];
  }, [section.data.items]);

  const filteredItems = useMemo(() => {
    if (activeTag === 'ALL') return section.data.items || [];
    return (section.data.items || []).filter((project) => (project.tags || []).includes(activeTag));
  }, [activeTag, section.data.items]);

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <div className="mb-8 border-y border-zinc-800 py-8">
        <p className="arch-kicker">{'// ARCHIVE_V2.06 - SELECTED_DEPLOYMENTS'}</p>
        <h2 className="arch-section-title mt-3">
          {t.selectedPrefix}
          <span className="arch-outline"> {t.selectedWorks}</span>
        </h2>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.08em] ${
              activeTag === tag
                ? 'border-lime-400 bg-lime-400 text-black'
                : 'border-zinc-700 text-zinc-300 hover:border-lime-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredItems.map((project, idx) => (
          <article key={`${project.title || 'project'}-${idx}`} className="arch-project grid gap-0 border border-zinc-800 lg:grid-cols-[1.4fr_1fr]">
            <div className="border-b border-zinc-800 p-3 lg:border-b-0 lg:border-r">
              <img src={project.image} alt={project.title} className="h-full min-h-[280px] w-full object-cover" />
            </div>
            <div className="p-6">
              <p className="arch-kicker">{`SYS_ID: 0${idx + 1}`}</p>
              <h3 className="mt-4 font-display text-5xl font-bold uppercase text-white">{project.title}</h3>
              <p className="mt-4 border-l border-lime-400/70 pl-4 text-2xl italic leading-relaxed text-zinc-300">
                "{project.summary}"
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span key={tag} className="arch-chip px-3 py-1 text-xs uppercase tracking-[0.08em]">
                    {tag}
                  </span>
                ))}
              </div>
              {(project.problem || project.solution || project.impact) && (
                <div className="mt-6 space-y-2 text-sm text-zinc-300">
                  {project.problem && (
                    <p>
                      <span className="font-semibold text-zinc-100">{t.caseProblem}: </span>
                      {project.problem}
                    </p>
                  )}
                  {project.solution && (
                    <p>
                      <span className="font-semibold text-zinc-100">{t.caseSolution}: </span>
                      {project.solution}
                    </p>
                  )}
                  {project.impact && (
                    <p>
                      <span className="font-semibold text-zinc-100">{t.caseImpact}: </span>
                      {project.impact}
                    </p>
                  )}
                </div>
              )}
              {Array.isArray(project.results) && project.results.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs uppercase tracking-[0.09em] text-zinc-500">{t.caseResults}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.results.map((result) => (
                      <span key={result} className="rounded-full border border-lime-400/70 px-3 py-1 text-xs text-lime-300">
                        {result}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.caseStudy && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCase((current) =>
                        current === `${project.title}-${idx}` ? null : `${project.title}-${idx}`
                      )
                    }
                    className="rounded-full border border-zinc-600 px-4 py-2 text-xs uppercase tracking-[0.08em] text-zinc-200 hover:border-lime-400"
                  >
                    {openCase === `${project.title}-${idx}` ? t.hideCaseDetails : t.showCaseDetails}
                  </button>

                  {openCase === `${project.title}-${idx}` && (
                    <div className="mt-4 grid gap-3 rounded-xl border border-zinc-700 bg-zinc-950/60 p-4 text-sm text-zinc-300">
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{t.caseContext}</p>
                        <p className="mt-1">{project.caseStudy.context}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{t.caseRole}</p>
                          <p className="mt-1">{project.caseStudy.role}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{t.caseTimeline}</p>
                          <p className="mt-1">{project.caseStudy.timeline}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{t.caseActions}</p>
                        <ul className="mt-2 space-y-1">
                          {(project.caseStudy.actions || []).map((action) => (
                            <li key={action} className="border-l border-zinc-600 pl-3">
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">{t.caseArchitecture}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(project.caseStudy.architecture || []).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-zinc-600 px-2 py-1 text-xs text-zinc-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a href={project.github} onClick={() => trackAnalyticsEvent('project_click')} className="arch-btn-secondary px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.08em]">
                  {t.sourceCode}
                </a>
                <a href={project.live} onClick={() => trackAnalyticsEvent('project_click')} className="arch-btn-primary px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.08em]">
                  {t.livePreview}
                </a>
              </div>
            </div>
          </article>
        ))}
        {filteredItems.length === 0 && (
          <p className="rounded-lg border border-zinc-800 p-4 text-sm text-zinc-500">{t.noProject}</p>
        )}
      </div>
    </motion.section>
  );
}

function Skills({ section, t }) {
  const getSkillAccent = (name) => {
    const key = String(name || '').toLowerCase().trim();
    return skillAccentByName[key] || '#b8ff2b';
  };

  const getSkillIcon = (name) => {
    const key = String(name || '').toLowerCase().trim();
    return skillIconByName[key] || null;
  };

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <div className="mb-8 border-y border-zinc-800 py-8">
        <p className="arch-kicker">{'~ DIAGNOSTIC_SKILLS_REPORT_V2.0'}</p>
        <h2 className="arch-section-title mt-3">
          {t.techStackPrefix}
          <span className="arch-outline"> {t.techStack}</span>
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {section.data.items?.map((skill, idx) => (
          <div key={`${skill.name || 'skill'}-${idx}`} className="arch-skill-card arch-skill-card-interactive p-5" style={{ '--skill-accent': getSkillAccent(skill.name) }}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-600">{`0${idx + 1}_${skill.name.toUpperCase()}`}</p>
            <div className="arch-skill-icon-wrap mt-6">
              {getSkillIcon(skill.name) ? (
                <img
                  src={getSkillIcon(skill.name)}
                  alt={`${skill.name} icon`}
                  className="arch-skill-icon h-8 w-8"
                  loading="lazy"
                />
              ) : (
                <span className="arch-skill-icon-fallback">{skill.name?.charAt(0)?.toUpperCase() || 'S'}</span>
              )}
            </div>
            <h3 className="arch-skill-title mt-8 font-display text-3xl font-bold uppercase">{skill.name}</h3>
            <div className="mt-6 h-1.5 bg-zinc-900">
              <div className="arch-skill-bar h-full" style={{ width: `${skill.level}%` }} />
            </div>
            <p className="mt-3 text-xs text-zinc-500">{skill.level}% {t.proficiency}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function Experience({ section, t }) {
  const pickEmoji = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('cashier') || t.includes('customer') || t.includes('service')) return '🛒';
    if (t.includes('assistant') || t.includes('administratif') || t.includes('admin')) return '🗂️';
    if (t.includes('full-stack') || t.includes('develop')) return '💻';
    if (t.includes('manager') || t.includes('lead')) return '📈';
    return '✨';
  };

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <div className="mb-8 border-y border-zinc-800 py-8">
        <p className="arch-kicker">{'// CAREER_LOG.V3'}</p>
        <h2 className="arch-section-title mt-3">
          {t.workPrefix}
          <span className="arch-outline"> {t.workExperience}</span>
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {section.data.items?.map((item, idx) => (
          <article key={`${item.title || 'experience'}-${idx}`} className="arch-exp-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">{item.emoji || pickEmoji(item.title)}</span>
              <span className="rounded-full border border-zinc-700 px-2 py-1 text-[11px] uppercase tracking-[0.1em] text-zinc-400">{`0${idx + 1}`}</span>
            </div>
            <h3 className="font-display text-2xl font-bold uppercase leading-tight text-zinc-100">{item.title}</h3>
            <p className="mt-3 border-l border-lime-400/65 pl-3 text-zinc-300">{item.description}</p>
            <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              {t.activeSkillDomain}
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function Testimonials({ section, t }) {
  const trustStats = Array.isArray(section.data?.trustStats) ? section.data.trustStats : [];
  const trustLogos = Array.isArray(section.data?.trustLogos) ? section.data.trustLogos : [];

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <h2 className="font-display text-3xl font-bold">{t.testimonials}</h2>

      {(trustStats.length > 0 || trustLogos.length > 0 || section.data?.guarantee) && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{t.trustLabel}</p>

          {trustStats.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {trustStats.map((stat) => (
                <div key={`${stat.label}-${stat.value}`} className="rounded-xl border border-zinc-700 bg-black/30 p-4">
                  <p className="font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {trustLogos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {trustLogos.map((logo) => (
                <span key={logo} className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.08em] text-zinc-300">
                  {logo}
                </span>
              ))}
            </div>
          )}

          {section.data?.guarantee && <p className="mt-4 text-sm text-zinc-300">{section.data.guarantee}</p>}
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {section.data.items?.map((item, idx) => (
          <article key={`${item.author || 'testimonial'}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
            <p className="text-zinc-200">"{item.quote}"</p>
            <p className="mt-3 text-sm text-zinc-400">{item.author}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function Blog({ section, t }) {
  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <h2 className="font-display text-3xl font-bold">{t.blogInsights}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {section.data.items?.map((item, idx) => (
          <article key={`${item.title || 'blog'}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-5">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{item.excerpt}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function Contact({ section, meta, t }) {
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' });
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validate = () => {
    const nextErrors = { name: '', email: '', message: '' };

    if (!values.name || values.name.trim().length < 2) {
      nextErrors.name = t.nameRequired;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '');
    if (!emailOk) {
      nextErrors.email = t.validEmail;
    }

    if (!values.message || values.message.trim().length < 10) {
      nextErrors.message = t.minMessage;
    }

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.message;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitState({ loading: true, error: '', success: '' });
    const result = await sendContactMessage({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
      created_at: new Date().toISOString(),
    });

    if (!result.ok) {
      setSubmitState({ loading: false, error: result.error || t.failedSend, success: '' });
      return;
    }

    trackAnalyticsEvent('contact_submit');
    setValues({ name: '', email: '', message: '' });
    setErrors({ name: '', email: '', message: '' });
    setSubmitState({ loading: false, error: '', success: t.sentSuccess });
  };

  const onFieldChange = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <div className="mb-8 border-y border-zinc-800 py-8">
        <p className="arch-kicker">{'>_ ESTABLISH_CONNECTION'}</p>
        <h2 className="arch-section-title mt-3">
          {t.getInTouch}
        </h2>
      </div>
      <div className="grid gap-0 border border-zinc-800 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={onSubmit} className="border-b border-zinc-800 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <label className="arch-field-label">01_CLIENT_NAME</label>
          <input value={values.name} onChange={onFieldChange('name')} className="arch-input" />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}

          <label className="arch-field-label mt-8">02_EMAIL_ADDRESS</label>
          <input value={values.email} onChange={onFieldChange('email')} className="arch-input" />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}

          <label className="arch-field-label mt-8">03_MESSAGE_PACKET</label>
          <textarea value={values.message} onChange={onFieldChange('message')} rows={4} className="arch-input min-h-24" />
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}

          <button type="submit" disabled={submitState.loading} className="arch-btn-primary mt-8 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] disabled:opacity-60">
            {submitState.loading ? t.sending : t.transmit}
          </button>
          {submitState.error && <p className="mt-3 text-xs text-red-400">{submitState.error}</p>}
          {submitState.success && <p className="mt-3 text-xs text-lime-300">{submitState.success}</p>}
        </form>

        <div className="p-6 lg:p-8">
          <h3 className="arch-kicker">{t.contactMethods}</h3>
          <p className="mt-3 text-sm text-zinc-300">{t.contactPitch}</p>
          <div className="mt-5 space-y-4">
            <a href={`mailto:${meta.email}`} className="arch-contact-item"><Mail size={16} /> {meta.email}</a>
            <p className="arch-contact-item">{t.remote}</p>
            <a href={meta.linkedin} className="arch-contact-item"><Linkedin size={16} /> {t.linkedin}</a>
            <a href={meta.github} className="arch-contact-item"><Github size={16} /> {t.github}</a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">{t.contactQuickReply}</span>
            <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">{t.contactNoCommit}</span>
          </div>
          <a
            href={`mailto:${meta.email}?subject=${encodeURIComponent('Nouveau projet')}`}
            className="mt-6 inline-block border border-lime-400 bg-lime-400 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-black"
          >
            {t.contactCta}
          </a>
          <p className="mt-6 text-sm text-zinc-500">{section.data.note}</p>
        </div>
      </div>
    </motion.section>
  );
}

function Footer({ section, meta }) {
  return (
    <motion.footer id={section.id} {...reveal} className="mt-8 border-t border-zinc-800 py-8 text-sm text-zinc-400">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <p>{section.data.text}</p>
        <div className="inline-flex items-center gap-3">
          <a className="hover:text-brand-red" href={meta.linkedin}><ArrowUpRight size={14} /></a>
        </div>
      </div>
    </motion.footer>
  );
}

function CustomSection({ section }) {
  const { title, body, items = [] } = section.data || {};

  return (
    <motion.section id={section.id} {...reveal} className="py-16">
      <h2 className="font-display text-3xl font-bold">{title || section.name}</h2>
      {body && <p className="mt-4 max-w-3xl text-zinc-300">{body}</p>}

      {section.kind === 'text' && null}

      {section.kind === 'grid' && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item, idx) => (
            <div key={`${item.title || 'grid'}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
              <h3 className="font-semibold">{item.title || 'Card'}</h3>
              <p className="mt-2 text-sm text-zinc-300">{item.body || ''}</p>
            </div>
          ))}
        </div>
      )}

      {section.kind === 'gallery' && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item, idx) => (
            <figure key={`${item.title || 'gallery'}-${idx}`} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/45">
              <img src={item.image} alt={item.title || 'gallery item'} className="h-44 w-full object-cover" />
              <figcaption className="p-3 text-sm text-zinc-300">{item.title}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {section.kind === 'stats' && (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {items.map((item, idx) => (
            <div key={`${item.label || 'stat'}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4 text-center">
              <p className="font-display text-2xl font-bold">{item.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {section.kind === 'faq' && (
        <div className="mt-6 space-y-3">
          {items.map((item, idx) => (
            <details key={`${item.question || 'faq'}-${idx}`} className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
              <summary className="cursor-pointer font-medium">{item.question}</summary>
              <p className="mt-2 text-sm text-zinc-300">{item.answer}</p>
            </details>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export function SectionRenderer({ section, meta, language = 'fr' }) {
  if (!section.enabled) return null;
  const t = uiText[language] || uiText.fr;

  const mapping = {
    hero: <Hero section={section} meta={meta} t={t} />,
    about: <About section={section} t={t} />,
    projects: <Projects section={section} t={t} />,
    skills: <Skills section={section} t={t} />,
    experience: <Experience section={section} t={t} />,
    testimonials: <Testimonials section={section} t={t} />,
    blog: <Blog section={section} t={t} />,
    contact: <Contact section={section} meta={meta} t={t} />,
    footer: <Footer section={section} meta={meta} />,
  };

  return mapping[section.kind] || <CustomSection section={section} />;
}



