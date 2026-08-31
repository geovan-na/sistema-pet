import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Inline SVG icons — no emoji, no icon library */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const PawIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><circle cx="8" cy="14" r="2"/><circle cx="14" cy="14" r="2"/><path d="M9 18c0 2 2 3 3 3s3-1 3-3c0-1-1.5-2-3-2s-3 1-3 2z"/></svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
);
const LogoPaw = () => (
  <svg className="logo-icon" viewBox="0 0 32 32" fill="currentColor">
    <circle cx="10" cy="6" r="3"/><circle cx="22" cy="6" r="3"/><circle cx="5" cy="14" r="3"/><circle cx="27" cy="14" r="3"/>
    <path d="M16 28c-4 0-7-3-7-6 0-2 2-5 7-5s7 3 7 5c0 3-3 6-7 6z"/>
  </svg>
);

const featureIcons = [UserIcon, PawIcon, LinkIcon, SearchIcon, EditIcon, ShieldIcon];

function LandingPage() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => els.forEach((el) => obs.unobserve(el));
  }, []);

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const features = [
    { title: 'Cadastro de Tutores', desc: 'Nome, telefone, e-mail e endereço organizados em um só lugar.' },
    { title: 'Gestão de Pets', desc: 'Espécie, raça, peso, data de nascimento e observações completas.' },
    { title: 'Vínculo Tutor–Pet', desc: 'Cada pet automaticamente associado ao seu tutor responsável.' },
    { title: 'Busca Rápida', desc: 'Pesquise e filtre pets e tutores em segundos.' },
    { title: 'Edição Ágil', desc: 'Atualize qualquer informação com poucos cliques.' },
    { title: 'Exclusão Segura', desc: 'Confirmação obrigatória antes de remover um registro.' },
  ];

  const steps = [
    { n: '1', title: 'Cadastre o tutor', desc: 'Registre nome, contato e endereço do responsável pelo pet.' },
    { n: '2', title: 'Adicione o pet', desc: 'Informe espécie, raça, peso e vincule ao tutor cadastrado.' },
    { n: '3', title: 'Gerencie tudo', desc: 'Consulte, edite e acompanhe todos os registros em tempo real.' },
  ];

  const stats = [
    { value: '100%', label: 'Gratuito' },
    { value: '2', label: 'Entidades CRUD' },
    { value: '5', label: 'Endpoints REST' },
    { value: '\u221E', label: 'Sem limites' },
  ];

  const testimonials = [
    {
      text: 'Simplificou completamente a forma como gerenciamos os cadastros. Antes usávamos planilhas — agora é tudo rápido e organizado.',
      name: 'Dra. Ana Silva',
      role: 'Veterinária',
      img: '/images/vet-professional.jpg',
    },
    {
      text: 'Interface intuitiva e fácil de usar. Consegui cadastrar todos os pets e tutores em poucos minutos.',
      name: 'Carlos Mendes',
      role: 'Dono de Pet Shop',
      initials: 'CM',
    },
    {
      text: 'O vínculo automático entre tutor e pet é excelente. Nunca mais perdi informações de contato.',
      name: 'Maria Oliveira',
      role: 'Tosadora Profissional',
      initials: 'MO',
    },
  ];

  const filiais = [
    { nome: 'Unidade Centro', endereco: 'Av. Principal, 1020 - Centro', telefone: '(11) 3222-1010' },
    { nome: 'Unidade Zona Sul', endereco: 'Rua das Palmeiras, 450 - Moema', telefone: '(11) 5055-2020' },
    { nome: 'Unidade Zona Norte', endereco: 'Rua Voluntários da Pátria, 1800 - Santana', telefone: '(11) 2977-3030' }
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <LogoPaw /> PetGestão
          </a>
          <div className="nav-links">
            <a href="#funcionalidades" onClick={(e) => { e.preventDefault(); scroll('funcionalidades'); }}>Funcionalidades</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scroll('como-funciona'); }}>Como funciona</a>
            <a href="#filiais" onClick={(e) => { e.preventDefault(); scroll('filiais'); }}>Filiais</a>
            <a href="#depoimentos" onClick={(e) => { e.preventDefault(); scroll('depoimentos'); }}>Depoimentos</a>
            <Link to="/login" className="btn btn-primary">Acessar sistema</Link>
          </div>
          <button className="mobile-menu-btn" aria-label="Abrir menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Sistema de Gestão para Clínicas e Pet Shops
            </div>
            <h1>
              Gestão <span className="highlight">completa</span> para quem cuida de pets
            </h1>
            <p>
              Cadastre tutores, gerencie pets e organize atendimentos.
              Tudo em um só lugar, simples e organizado.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary">Começar agora</Link>
              <a href="#funcionalidades" className="btn btn-outline" onClick={(e) => { e.preventDefault(); scroll('funcionalidades'); }}>
                Ver funcionalidades
              </a>
            </div>
            <div className="trust-row">
              <span className="trust-item"><CheckIcon /> Gratuito</span>
              <span className="trust-item"><CheckIcon /> Fácil de usar</span>
              <span className="trust-item"><CheckIcon /> Dados seguros</span>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-pets.jpg" alt="Cachorro e gato juntos" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="funcionalidades">
        <div className="container">
          <div className="section-header centered reveal">
            <h2>Tudo que você precisa em um só sistema</h2>
            <p>Funcionalidades pensadas para facilitar o dia a dia da sua clínica</p>
          </div>
          <div className="features-grid reveal stagger">
            {features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <div className="feature-card" key={i}>
                  <div className="feature-icon"><Icon /></div>
                  <div className="feature-text">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="showcase">
        <div className="container">
          <div className="section-header centered reveal">
            <h2>Feito para o dia a dia real</h2>
            <p>Da recepção ao consultório, o PetGestão acompanha cada etapa</p>
          </div>
          <div className="showcase-grid reveal stagger">
            <div className="showcase-card">
              <img src="/images/feature-register.jpg" alt="Cadastro de paciente" />
              <div className="showcase-card-body">
                <h3>Cadastro rápido</h3>
                <p>Registre tutores e pets direto no atendimento, sem burocracia.</p>
              </div>
            </div>
            <div className="showcase-card">
              <img src="/images/feature-petcare.jpg" alt="Exame veterinário" />
              <div className="showcase-card-body">
                <h3>Acompanhamento completo</h3>
                <p>Todas as informações do pet organizadas e acessíveis.</p>
              </div>
            </div>
            <div className="showcase-card">
              <img src="/images/feature-family.jpg" alt="Tutora com seu pet" />
              <div className="showcase-card-body">
                <h3>Vínculo tutor–pet</h3>
                <p>Cada animal conectado ao responsável automaticamente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works" id="como-funciona">
        <div className="container">
          <div className="section-header centered reveal">
            <h2>Como funciona</h2>
            <p>Três passos simples para organizar sua clínica</p>
          </div>
          <div className="steps-list reveal stagger">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.n}</div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filiais Section */}
      <section className="features" id="filiais" style={{ backgroundColor: 'var(--color-bg-warm)' }}>
        <div className="container">
          <div className="section-header centered reveal">
            <h2>Nossas Filiais</h2>
            <p>Encontre a clínica mais próxima de você para atendimento presencial</p>
          </div>
          <div className="features-grid reveal stagger" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {filiais.map((filial, i) => (
              <div className="feature-card" key={i} style={{ display: 'block', textAlign: 'center' }}>
                <div className="feature-icon" style={{ margin: '0 auto 16px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                </div>
                <h3 style={{ marginBottom: 8 }}>{filial.nome}</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>{filial.endereco}</p>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{filial.telefone}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid reveal stagger">
            {stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="depoimentos">
        <div className="container">
          <div className="section-header centered reveal">
            <h2>Quem usa, recomenda</h2>
            <p>Feedback de profissionais que já utilizam o sistema</p>
          </div>
          <div className="testimonials-list reveal stagger">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  {t.img ? (
                    <img src={t.img} alt={t.name} className="testimonial-avatar" />
                  ) : (
                    <div className="testimonial-avatar-placeholder">{t.initials}</div>
                  )}
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-shape cta-shape-1" />
        <div className="cta-shape cta-shape-2" />
        <div className="container">
          <h2>Pronto para organizar sua clínica?</h2>
          <p>Comece agora mesmo — é grátis.</p>
          <Link to="/login" className="btn btn-white">Acessar o sistema</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo"><LogoPaw /> PetGestão</div>
              <p>Sistema de gestão para clínicas veterinárias, pet shops e profissionais autônomos. Projeto acadêmico.</p>
            </div>
            <div className="footer-columns">
              <div className="footer-col">
                <h4>Sistema</h4>
                <ul>
                  <li><Link to="/login">Dashboard</Link></li>
                  <li><Link to="/login">Pets</Link></li>
                  <li><Link to="/login">Tutores</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Tecnologias</h4>
                <ul>
                  <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a></li>
                  <li><a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a></li>
                  <li><a href="https://expressjs.com" target="_blank" rel="noopener noreferrer">Express</a></li>
                  <li><a href="https://mysql.com" target="_blank" rel="noopener noreferrer">MySQL</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 PetGest&atilde;o. Projeto acad&ecirc;mico.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
