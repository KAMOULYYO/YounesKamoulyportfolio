import imgpor from '../imgpor.png';
const now = () => new Date().toISOString();

export const initialSiteConfig = {
  mode: 'preview',
  updatedAt: now(),
  publishedAt: null,
  meta: {
    name: 'Younes Kamouly',
    role: 'Developpeur Web | Full-Stack (FastAPI / Node, React, MongoDB) + IA',
    location: 'Montreal, QC',
    email: 'kamoulyyounes@gmail.com',
    linkedin: 'https://www.linkedin.com/in/younes-kamouly/',
    github: 'https://github.com/KAMOULYYO',
  },
  sections: [
    {
      id: 'hero',
      kind: 'hero',
      name: 'Hero',
      builtIn: true,
      enabled: true,
      order: 0,
      data: {
        kicker: 'Developpeur full-stack focalise business impact',
        title: 'J aide les produits SaaS a convertir plus vite avec un web app rapide, propre et scalable.',
        subtitle:
          'De la strategie produit a la mise en production, je livre des experiences web premium qui augmentent la conversion et reduisent la friction utilisateur.',
        ctaPrimary: 'Voir les etudes de cas',
        ctaSecondary: 'Demarrer un projet',
        stats: [
          { label: 'Projets en production', value: '18+' },
          { label: 'Amelioration conversion', value: '+32%' },
          { label: 'Temps de reponse API', value: '-45%' },
        ],
        badges: ['React', 'FastAPI', 'MongoDB', 'Node', 'Stripe', 'OpenAI'],
        image: imgpor,
      },
    },
    {
      id: 'about',
      kind: 'about',
      name: 'About',
      builtIn: true,
      enabled: true,
      order: 1,
      data: {
        body:
          'Je transforme des besoins metier complexes en produits robustes, designes pour durer et evoluer sans friction.',
        values: ['Rigueur', 'Autonomie', 'Service client'],
        timeline: ['DEC Informatique', 'AEC Developpement Web', 'Projets SaaS & freelancing'],
      },
    },
    {
      id: 'projects',
      kind: 'projects',
      name: 'Projects',
      builtIn: true,
      enabled: true,
      order: 2,
      data: {
        items: [
          {
            title: 'TravelMate',
            summary: 'Plateforme de voyage IA orientee conversion pour parcours de reservation premium.',
            problem: 'Tunnel de reservation long, taux de drop eleve sur mobile.',
            solution: 'Refonte UX + API FastAPI optimisee + checkout Stripe simplifie.',
            impact: 'Conversion reservation +34% en 8 semaines.',
            results: ['+34% conversion', '-41% abandon panier', 'LCP mobile 1.9s'],
            caseStudy: {
              context: "Une startup travel voulait accelerer la reservation mobile sans refaire tout le produit.",
              role: 'Lead full-stack (product + frontend + backend)',
              timeline: '8 semaines',
              actions: [
                'Refonte du tunnel de reservation en 3 etapes claires.',
                'Optimisation des endpoints FastAPI et reduction des appels inutiles.',
                'Instrumentation analytics pour mesurer chaque etape du funnel.',
              ],
              architecture: ['React + Tailwind', 'FastAPI + MongoDB', 'Stripe + event tracking'],
            },
            tags: ['React', 'FastAPI', 'MongoDB', 'Stripe', 'OpenAI'],
            live: '#',
            github: 'https://github.com/KAMOULYYO',
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
          },
          {
            title: 'LibraNet',
            summary: 'Bibliotheque intelligente avec recherche IA et backoffice admin orientes efficacite.',
            problem: 'Recherche lente et faible decouverte de contenu pertinent.',
            solution: 'Moteur de recherche semantique + filtrage multi-role + analytics temps reel.',
            impact: 'Temps moyen de recherche -52%.',
            results: ['-52% temps de recherche', '+27% engagement', '99.9% uptime'],
            caseStudy: {
              context: "La plateforme avait beaucoup de contenu, mais les utilisateurs ne trouvaient pas vite l'information.",
              role: 'Developpeur full-stack principal',
              timeline: '6 semaines',
              actions: [
                'Integration d une recherche semantique avec scoring de pertinence.',
                'Creation d un backoffice role-based pour moderation et qualite des donnees.',
                'Mise en place de dashboards de suivi usage et performance.',
              ],
              architecture: ['React + Node.js', 'MongoDB + indexes optimises', 'JWT RBAC + analytics temps reel'],
            },
            tags: ['React', 'Node', 'MongoDB', 'JWT', 'AI'],
            live: '#',
            github: 'https://github.com/KAMOULYYO',
            image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
          },
          {
            title: 'Workforce Manager',
            summary: 'Outil operations RH pour suivi des pauses et alertes en temps reel.',
            problem: 'Pilotage manuel des pauses, erreurs frequentes en heures de pointe.',
            solution: 'Dashboard temps reel + regles metier automatiques + journalisation robuste.',
            impact: 'Incidents operationnels critiques -38%.',
            results: ['-38% incidents', '+22% productivite equipe', 'Audit trail complet'],
            caseStudy: {
              context: "Les superviseurs perdaient du temps avec des validations manuelles et des erreurs de planning.",
              role: 'Concepteur et developpeur de la plateforme',
              timeline: '10 semaines',
              actions: [
                'Conception des regles metier pour pauses, exceptions et alertes.',
                'Construction d un tableau de bord live pour supervision immediate.',
                'Ajout d un audit trail complet pour la conformite operationnelle.',
              ],
              architecture: ['React dashboard', 'FastAPI + PostgreSQL', 'Alerting + logs structures'],
            },
            tags: ['React', 'FastAPI', 'PostgreSQL'],
            live: '#',
            github: 'https://github.com/KAMOULYYO',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
          },
        ],
      },
    },
    {
      id: 'skills',
      kind: 'skills',
      name: 'Skills',
      builtIn: true,
      enabled: true,
      order: 3,
      data: {
        items: [
          { name: 'React', level: 90 },
          { name: 'Tailwind CSS', level: 88 },
          { name: 'FastAPI', level: 84 },
          { name: 'Node.js', level: 78 },
          { name: 'MongoDB', level: 82 },
        ],
      },
    },
    {
      id: 'experience',
      kind: 'experience',
      name: 'Experience',
      builtIn: true,
      enabled: true,
      order: 4,
      data: {
        items: [
          { title: 'Metro - Caissier / Service client', description: 'Gestion du stress, precision operationnelle, excellence client.' },
          { title: 'Assistant administratif', description: 'Organisation, communication claire, execution rigoureuse.' },
          { title: 'Projets Full-Stack', description: 'Livraison de bout en bout, qualite de code et vision produit.' },
        ],
      },
    },
    {
      id: 'testimonials',
      kind: 'testimonials',
      name: 'Testimonials',
      builtIn: true,
      enabled: true,
      order: 5,
      data: {
        trustStats: [
          { label: 'Projets livres sans retard critique', value: '94%' },
          { label: 'Clients qui reviennent', value: '82%' },
          { label: 'Mise en prod moyenne', value: '< 14 jours' },
        ],
        trustLogos: ['SaaS', 'Retail', 'Education', 'Operations', 'AI Products'],
        guarantee:
          'Communication claire, demos hebdo, code maintenable et orientation resultats business.',
        items: [
          { author: 'Manager Retail Ops', quote: 'Rigueur, calme et execution propre sous pression.' },
          { author: 'Client SaaS', quote: 'Excellent sens produit et tres bon niveau frontend.' },
          { author: 'Product Owner', quote: 'Approche claire, orientee resultats et collaboration.' },
        ],
      },
    },
    {
      id: 'blog',
      kind: 'blog',
      name: 'Blog',
      builtIn: true,
      enabled: true,
      order: 6,
      data: {
        items: [
          { title: 'Structurer un monolithe en microservices', excerpt: 'Decoupage progressif sans casser la prod.' },
          { title: 'JWT + roles proprement', excerpt: 'Patterns robustes, simples et auditables.' },
          { title: 'UI pro avec Tailwind', excerpt: 'Methodes concretes pour un rendu premium.' },
        ],
      },
    },
    {
      id: 'contact',
      kind: 'contact',
      name: 'Contact',
      builtIn: true,
      enabled: true,
      order: 7,
      data: {
        title: 'Discutons de votre prochain produit.',
        note: 'Je reponds en moins de 24h.',
      },
    },
    {
      id: 'footer',
      kind: 'footer',
      name: 'Footer',
      builtIn: true,
      enabled: true,
      order: 8,
      data: {
        text: 'Cree avec precision par Younes Kamouly.',
      },
    },
  ],
};

export const createCustomSection = (kind = 'text') => ({
  id: `${kind}-${Date.now()}`,
  kind,
  name: `Custom ${kind}`,
  builtIn: false,
  enabled: true,
  order: Date.now(),
  data: {
    title: 'Nouvelle section personnalisee',
    body: 'Ecrivez votre contenu premium ici.',
    items: [],
  },
});

