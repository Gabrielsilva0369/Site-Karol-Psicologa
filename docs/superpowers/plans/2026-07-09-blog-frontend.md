# Blog Front-end Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um blog puramente front-end (HTML/CSS/JS estático) ao site da Psicóloga Karol, reusando a identidade visual, com 3 posts de exemplo e link apenas no rodapé.

**Architecture:** Nova pasta `/blog/` com uma página índice, um `blog.css` compartilhado, um `blog.js` de animação, e um arquivo HTML por post. Sem build, sem servidor, sem framework — tudo abre via `file://`. O `index.html` raiz muda apenas para ganhar o link no rodapé; `sitemap.xml` ganha as URLs novas.

**Tech Stack:** HTML5 estático, CSS puro (custom properties), JavaScript vanilla (IntersectionObserver). Fontes via Google Fonts (Playfair Display + Cantarell), já usadas no site.

## Global Constraints

- **Paleta (custom properties, valores exatos):** `--c-escuro:#2B0E06`, `--c-marrom:#3B1A0A`, `--c-vinho:#5C1F1A`, `--c-terracota:#B84500`, `--c-caramelo:#B07848`, `--c-areia:#DCC48A`, `--c-creme:#F5EDE0`, `--c-linho:#FAF4ED`.
- **Raios:** `--r-sm:8px`, `--r-md:16px`, `--r-lg:24px`, `--r-pill:100px`.
- **Fontes:** `--f-display`/`--f-titulo`: `'Playfair Display', Georgia, serif`; `--f-corpo`: `'Cantarell', Helvetica, sans-serif`.
- **Google Fonts (mesma URL do site):** `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cantarell:ital,wght@0,400;0,700;1,400&display=swap`.
- **WhatsApp do CTA:** `https://wa.me/+558488883636` (idêntico ao rodapé atual).
- **Idioma:** `<html lang="pt-BR">`. Domínio canônico: `https://www.karolpsicologa.com.br`.
- **Estrutura obrigatória de cada post (7 seções):** 1) Título 50–60 car. com palavra-chave; 2) Introdução 2–3 § que nomeiam o que o leitor sente; 3) Desenvolvimento com H2/H3 e § curtos; 4) Exemplos práticos do cotidiano; 5) O que fazer (concreto, sem prometer resultado); 6) Disclaimer (informativo, não substitui acompanhamento); 7) CTA WhatsApp.
- **Assets do site raiz** referenciados de dentro de `/blog/` com `../` (ex.: `../favicon-32.png`, `../maranata.webp`).
- **Verificação:** site estático → abrir no navegador e conferir. Não há runner de testes; não inventar `pytest`/`npm test`.

---

## File Structure

- Create: `blog/blog.css` — tokens + reset + nav + footer + componentes (hero, card, artigo, exemplos, disclaimer, CTA).
- Create: `blog/blog.js` — reveal-on-scroll (IntersectionObserver).
- Create: `blog/index.html` — índice com hero + grade de cards + footer.
- Create: `blog/voce-nao-e-demais.html` — post de referência (template comentado).
- Create: `blog/o-que-e-borderline.html` — post 2.
- Create: `blog/dbt-regulacao-emocional.html` — post 3.
- Modify: `index.html` — adicionar `<li>` "Blog" na coluna Navegação do rodapé (perto da linha 3065).
- Modify: `sitemap.xml` — adicionar 4 URLs.

---

## Task 1: Fundação — CSS compartilhado, JS de reveal e página índice

**Files:**
- Create: `blog/blog.css`
- Create: `blog/blog.js`
- Create: `blog/index.html`

**Interfaces:**
- Produces (classes CSS reusadas pelos posts): `.blog-nav`, `.blog-nav__brand`, `.blog-nav__back`, `.site-footer` (+ subclasses `.footer-*` idênticas ao site), `.tag`, `.tag--caramelo`, `.reveal`/`.reveal.visible`.
- Produces (JS): `blog.js` adiciona a classe `.visible` a todo `.reveal` que entra na viewport (IntersectionObserver, threshold 0.1).

- [ ] **Step 1: Criar `blog/blog.css` com os estilos de base + índice**

```css
/* ============================================================
   BLOG — estilos compartilhados (índice + posts)
   Reusa a identidade visual do site (index.html)
============================================================ */
:root {
  --c-escuro: #2B0E06;
  --c-marrom: #3B1A0A;
  --c-vinho: #5C1F1A;
  --c-terracota: #B84500;
  --c-caramelo: #B07848;
  --c-areia: #DCC48A;
  --c-creme: #F5EDE0;
  --c-linho: #FAF4ED;
  --f-display: 'Playfair Display', Georgia, serif;
  --f-titulo: 'Playfair Display', Georgia, serif;
  --f-corpo: 'Cantarell', Helvetica, sans-serif;
  --r-sm: 8px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-pill: 100px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  font-family: var(--f-corpo);
  background: var(--c-linho);
  color: var(--c-marrom);
  overflow-x: hidden;
}

img { max-width: 100%; display: block; }

/* ─── NAV ─────────────────────────────────────────── */
.blog-nav {
  position: sticky;
  top: 0;
  z-index: 999;
  background: var(--c-escuro);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 8%;
  height: 52px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.blog-nav__brand {
  font-family: var(--f-display);
  font-style: italic;
  font-size: 15px;
  color: var(--c-areia);
  margin-right: auto;
  text-decoration: none;
  letter-spacing: 0.02em;
}
.blog-nav__back {
  font-family: var(--f-corpo);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: color 0.2s;
}
.blog-nav__back:hover { color: var(--c-areia); }

/* ─── TAG ─────────────────────────────────────────── */
.tag {
  display: inline-block;
  border-radius: var(--r-pill);
  padding: 4px 14px;
  font-family: var(--f-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.tag--caramelo {
  background: rgba(176,120,72,0.15);
  color: var(--c-caramelo);
  border: 1px solid rgba(176,120,72,0.3);
}

/* ─── HERO (índice) ───────────────────────────────── */
.blog-hero {
  background: var(--c-escuro);
  position: relative;
  overflow: hidden;
  padding: 96px 8% 88px;
}
.blog-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
}
.blog-hero__inner { position: relative; max-width: 1200px; margin: 0 auto; }
.blog-hero__kicker {
  font-family: var(--f-corpo);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-caramelo);
  margin-bottom: 18px;
}
.blog-hero__title {
  font-family: var(--f-display);
  font-style: italic;
  font-weight: 900;
  font-size: clamp(48px, 8vw, 88px);
  color: var(--c-creme);
  line-height: 0.95;
  margin-bottom: 24px;
}
.blog-hero__desc {
  font-family: var(--f-corpo);
  font-size: 16px;
  line-height: 1.7;
  color: rgba(245,237,224,0.55);
  max-width: 520px;
}

/* ─── GRADE DE CARDS ──────────────────────────────── */
.blog-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 8% 96px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}
@media (min-width: 640px) { .blog-list { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1000px) { .blog-list { grid-template-columns: repeat(3, 1fr); } }

.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid rgba(176,120,72,0.18);
  border-radius: var(--r-md);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
}
.post-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(43,14,6,0.12);
}
.post-card__cover {
  height: 160px;
  background: radial-gradient(ellipse at 30% 30%, #4a2412 0%, var(--c-escuro) 100%);
  position: relative;
  overflow: hidden;
}
.post-card__cover::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
}
.post-card__body { padding: 24px 24px 28px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
.post-card__title {
  font-family: var(--f-display);
  font-weight: 700;
  font-size: 21px;
  line-height: 1.25;
  color: var(--c-marrom);
}
.post-card__excerpt {
  font-family: var(--f-corpo);
  font-size: 14px;
  line-height: 1.65;
  color: rgba(59,26,10,0.7);
  flex: 1;
}
.post-card__meta {
  font-family: var(--f-corpo);
  font-size: 12px;
  color: rgba(59,26,10,0.45);
}
.post-card__more {
  font-family: var(--f-corpo);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-terracota);
  margin-top: 4px;
}

/* ─── REVEAL ──────────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(24px); transition: 0.7s cubic-bezier(0.16,1,0.3,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.08s; }
.reveal-delay-2 { transition-delay: 0.16s; }
.reveal-delay-3 { transition-delay: 0.24s; }

/* ─── FOOTER (idêntico ao site) ───────────────────── */
.site-footer { background: var(--c-marrom); position: relative; overflow: hidden; border-top: 1px solid rgba(255,255,255,0.06); }
.site-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}
.footer-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 80px 8% 0; }
.footer-top { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 64px; padding-bottom: 64px; border-bottom: 1px solid rgba(255,255,255,0.07); }
@media (max-width: 900px) { .footer-top { grid-template-columns: 1fr; gap: 48px; } }
.footer-brand-name { font-family: var(--f-display); font-size: 28px; font-weight: 900; color: var(--c-creme); line-height: 1.1; margin-bottom: 12px; }
.footer-brand-desc { font-family: var(--f-corpo); font-size: 14px; color: rgba(245,237,224,0.45); line-height: 1.7; max-width: 240px; margin-bottom: 28px; }
.footer-cta-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--c-terracota); color: var(--c-creme); font-family: var(--f-corpo); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 12px 24px; border-radius: var(--r-pill); transition: transform 0.2s, box-shadow 0.2s; }
.footer-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(184,69,0,0.4); }
.footer-col-label { font-family: var(--f-corpo); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-caramelo); margin-bottom: 20px; }
.footer-nav-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-nav-list a { font-family: var(--f-corpo); font-size: 14px; color: rgba(245,237,224,0.5); text-decoration: none; transition: color 0.2s; }
.footer-nav-list a:hover { color: var(--c-areia); }
.footer-social-grid { display: flex; flex-direction: column; gap: 12px; }
.footer-social-link { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; text-decoration: none; transition: background 0.2s, border-color 0.2s, transform 0.2s; }
.footer-social-link:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.14); transform: translateX(4px); }
.footer-social-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.footer-social-icon svg { width: 18px; height: 18px; }
.footer-social-info-name { font-family: var(--f-titulo); font-size: 14px; font-weight: 700; color: var(--c-creme); }
.footer-social-info-handle { font-family: var(--f-corpo); font-size: 12px; color: rgba(245,237,224,0.4); }
.footer-bottom { display: flex; align-items: center; justify-content: space-between; padding: 24px 8%; gap: 24px; flex-wrap: wrap; }
.footer-copy { font-family: var(--f-corpo); font-size: 12px; color: rgba(245,237,224,0.3); letter-spacing: 0.04em; }
.footer-maranata { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.footer-maranata-logo { height: 28px; width: auto; opacity: 0.55; filter: brightness(2); transition: opacity 0.2s; }
.footer-maranata:hover .footer-maranata-logo { opacity: 0.9; }
.footer-maranata-text { font-family: var(--f-corpo); font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(245,237,224,0.3); transition: color 0.2s; }
.footer-maranata:hover .footer-maranata-text { color: rgba(245,237,224,0.6); }
@media (max-width: 600px) { .footer-bottom { flex-direction: column; align-items: flex-start; padding: 24px 6%; } }

/* ============================================================
   ARTIGO (páginas de post) — usado nas Tasks 2 e 3
============================================================ */
.post { background: var(--c-linho); }
.post-header { max-width: 720px; margin: 0 auto; padding: 64px 24px 40px; }
.post-back { display: inline-block; font-family: var(--f-corpo); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--c-terracota); text-decoration: none; margin-bottom: 28px; }
.post-back:hover { text-decoration: underline; }
.post-title { font-family: var(--f-display); font-weight: 900; font-size: clamp(32px, 5vw, 52px); line-height: 1.08; color: var(--c-marrom); margin: 20px 0 18px; }
.post-meta { font-family: var(--f-corpo); font-size: 13px; color: rgba(59,26,10,0.5); }
.post-body { max-width: 680px; margin: 0 auto; padding: 8px 24px 24px; }
.post-body p { font-family: var(--f-corpo); font-size: 17px; line-height: 1.8; color: rgba(43,14,6,0.86); margin-bottom: 22px; }
.post-body h2 { font-family: var(--f-display); font-weight: 700; font-size: 28px; line-height: 1.2; color: var(--c-marrom); margin: 48px 0 18px; }
.post-body h3 { font-family: var(--f-titulo); font-weight: 700; font-size: 20px; color: var(--c-vinho); margin: 32px 0 12px; }
.post-body ul, .post-body ol { margin: 0 0 22px 22px; }
.post-body li { font-family: var(--f-corpo); font-size: 17px; line-height: 1.75; color: rgba(43,14,6,0.86); margin-bottom: 10px; }
.post-body blockquote { border-left: 3px solid var(--c-terracota); padding: 4px 0 4px 22px; margin: 0 0 22px; font-family: var(--f-display); font-style: italic; font-size: 20px; color: var(--c-vinho); }

/* Bloco de exemplos práticos */
.post-examples { background: var(--c-creme); border: 1px solid rgba(176,120,72,0.2); border-radius: var(--r-md); padding: 28px 30px; margin: 8px 0 32px; }
.post-examples__label { font-family: var(--f-corpo); font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-caramelo); margin-bottom: 16px; }
.post-examples ul { margin: 0 0 0 18px; }
.post-examples li { margin-bottom: 12px; }

/* Disclaimer */
.post-disclaimer { display: flex; gap: 14px; background: rgba(92,31,26,0.06); border: 1px solid rgba(92,31,26,0.18); border-radius: var(--r-sm); padding: 20px 22px; margin: 32px 0; }
.post-disclaimer__icon { flex-shrink: 0; font-size: 20px; line-height: 1.4; }
.post-disclaimer p { font-family: var(--f-corpo); font-size: 14px; line-height: 1.65; color: rgba(92,31,26,0.85); margin: 0; }

/* CTA final */
.post-cta { max-width: 680px; margin: 8px auto 80px; padding: 0 24px; }
.post-cta__box { position: relative; overflow: hidden; background: var(--c-escuro); border-radius: var(--r-lg); padding: 48px 40px; text-align: center; }
.post-cta__box::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
}
.post-cta__kicker { position: relative; font-family: var(--f-corpo); font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-caramelo); margin-bottom: 14px; }
.post-cta__title { position: relative; font-family: var(--f-display); font-style: italic; font-weight: 700; font-size: 26px; color: var(--c-creme); line-height: 1.35; margin-bottom: 28px; }
.post-cta__btn { position: relative; display: inline-flex; align-items: center; gap: 10px; background: var(--c-terracota); color: var(--c-creme); font-family: var(--f-corpo); font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; padding: 16px 34px; border-radius: var(--r-pill); transition: transform 0.2s, box-shadow 0.2s; }
.post-cta__btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(184,69,0,0.45); }
```

- [ ] **Step 2: Criar `blog/blog.js` (reveal-on-scroll)**

```javascript
// Reveal-on-scroll — mesma técnica do index.js do site.
// Progressive enhancement: sem JS, os elementos .reveal recebem .visible abaixo.
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('visible'));
}
```

> Nota de robustez: para navegadores com JS desativado, cada página inclui um `<noscript>` que torna `.reveal` visível (ver Step 3). Assim o conteúdo nunca fica invisível.

- [ ] **Step 3: Criar `blog/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — Psicóloga Karol Moreno | Borderline, DBT e Emoções</title>
  <meta name="description" content="Artigos sobre Transtorno de Personalidade Borderline (TPB), DBT e regulação emocional, escritos pela psicóloga Karol Moreno.">
  <meta name="author" content="Karol Moreno">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.karolpsicologa.com.br/blog/index.html">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Karol Moreno Psicóloga">
  <meta property="og:title" content="Blog — Psicóloga Karol Moreno">
  <meta property="og:description" content="Artigos sobre borderline, DBT e regulação emocional.">
  <meta property="og:url" content="https://www.karolpsicologa.com.br/blog/index.html">
  <meta property="og:image" content="https://www.karolpsicologa.com.br/og-image.jpg">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
  <meta name="theme-color" content="#2B0E06">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cantarell:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./blog.css">
  <noscript><style>.reveal{opacity:1;transform:none;}</style></noscript>
</head>
<body>
  <nav class="blog-nav">
    <a class="blog-nav__brand" href="../index.html">Psicóloga Karol</a>
    <a class="blog-nav__back" href="../index.html">← Voltar ao site</a>
  </nav>

  <header class="blog-hero">
    <div class="blog-hero__inner">
      <p class="blog-hero__kicker reveal">Blog</p>
      <h1 class="blog-hero__title reveal reveal-delay-1">Sobre emoções<br>intensas</h1>
      <p class="blog-hero__desc reveal reveal-delay-2">Textos sobre Transtorno de Personalidade Borderline, DBT e regulação emocional — escritos para quem sente muito e quer entender o que se passa por dentro.</p>
    </div>
  </header>

  <main class="blog-list">
    <!-- Card 1 -->
    <a class="post-card reveal" href="./o-que-e-borderline.html">
      <div class="post-card__cover"></div>
      <div class="post-card__body">
        <span class="tag tag--caramelo">Borderline</span>
        <h2 class="post-card__title">O que é o Transtorno de Personalidade Borderline?</h2>
        <p class="post-card__excerpt">Sinais, causas e o que a intensidade emocional realmente significa — sem jargão e sem julgamento.</p>
        <span class="post-card__meta">9 jul 2026 · 7 min de leitura</span>
        <span class="post-card__more">Ler artigo →</span>
      </div>
    </a>
    <!-- Card 2 -->
    <a class="post-card reveal reveal-delay-1" href="./dbt-regulacao-emocional.html">
      <div class="post-card__cover"></div>
      <div class="post-card__body">
        <span class="tag tag--caramelo">DBT</span>
        <h2 class="post-card__title">DBT: como a Terapia Comportamental Dialética ajuda</h2>
        <p class="post-card__excerpt">As quatro habilidades da DBT e como elas ajudam a regular emoções que parecem incontroláveis.</p>
        <span class="post-card__meta">9 jul 2026 · 8 min de leitura</span>
        <span class="post-card__more">Ler artigo →</span>
      </div>
    </a>
    <!-- Card 3 -->
    <a class="post-card reveal reveal-delay-2" href="./voce-nao-e-demais.html">
      <div class="post-card__cover"></div>
      <div class="post-card__body">
        <span class="tag tag--caramelo">Emoções</span>
        <h2 class="post-card__title">Você não é "demais": sobre a intensidade emocional</h2>
        <p class="post-card__excerpt">Por que sentir com intensidade não é um defeito — e o que fazer quando ouvir que você "exagera".</p>
        <span class="post-card__meta">9 jul 2026 · 6 min de leitura</span>
        <span class="post-card__more">Ler artigo →</span>
      </div>
    </a>
  </main>

  <!-- FOOTER (copiado do site, com Blog na navegação) -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <p class="footer-brand-name">Psicóloga<br>Karol</p>
          <p class="footer-brand-desc">Terapia especializada em Transtorno de Personalidade Borderline. Atendimento online, humanizado e sem julgamentos.</p>
          <a href="https://wa.me/+558488883636" target="_blank" rel="noopener noreferrer" class="footer-cta-btn">Agendar sessão</a>
        </div>
        <div>
          <p class="footer-col-label">Navegação</p>
          <ul class="footer-nav-list">
            <li><a href="../index.html#hero">Início</a></li>
            <li><a href="../index.html#sobre">Sobre a Karol</a></li>
            <li><a href="../index.html#como-funciona">Como Funciona</a></li>
            <li><a href="../index.html#faq">Perguntas Frequentes</a></li>
            <li><a href="./index.html">Blog</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-col-label">Redes Sociais</p>
          <div class="footer-social-grid">
            <a href="https://www.instagram.com/stories/especialistatpb_karolpsi/" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <div class="footer-social-icon" style="background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#fff" stroke="none"/></svg></div>
              <div><p class="footer-social-info-name">Instagram</p><p class="footer-social-info-handle">@especialistatpb_karolpsi</p></div>
            </a>
            <a href="https://wa.me/+558488883636" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <div class="footer-social-icon" style="background:#25D366;"><svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></div>
              <div><p class="footer-social-info-name">WhatsApp</p><p class="footer-social-info-handle">Agendar conversa</p></div>
            </a>
            <a href="https://www.tiktok.com/@terapeuta.karoldbt" target="_blank" rel="noopener noreferrer" class="footer-social-link">
              <div class="footer-social-icon" style="background:#000;"><svg viewBox="0 0 24 24" fill="#fff"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg></div>
              <div><p class="footer-social-info-name">TikTok</p><p class="footer-social-info-handle">@terapeuta.karoldbt</p></div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2026 Psicóloga Karol · Todos os direitos reservados · CRP em conformidade com o CFP</p>
      <a href="https://www.maranatamarketing.com" target="_blank" rel="noopener noreferrer" class="footer-maranata">
        <img src="../maranata.webp" alt="Logo Maranata" width="252" height="236" loading="lazy" class="footer-maranata-logo">
        <span class="footer-maranata-text">Desenvolvido por Maranata</span>
      </a>
    </div>
  </footer>

  <script src="./blog.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verificar no navegador**

Abrir `blog/index.html` no navegador. Conferir:
- Nav escura no topo com "Psicóloga Karol" + "← Voltar ao site".
- Hero marrom texturizado com título em Playfair itálico.
- 3 cards em grade (redimensionar janela: 1 col estreito → 2 → 3 largo).
- Hover nos cards eleva com sombra.
- Cards e hero aparecem com fade-up ao carregar/rolar.
- Rodapé idêntico ao do site.
- Links dos cards apontam para os 3 posts (ainda 404 até Tasks 2–3 — ok).

- [ ] **Step 5: Commit**

```bash
git add blog/blog.css blog/blog.js blog/index.html
git commit -m "feat(blog): add index page, shared styles and reveal script"
```

---

## Task 2: Post de referência (template) — `voce-nao-e-demais.html`

**Files:**
- Create: `blog/voce-nao-e-demais.html`

**Interfaces:**
- Consumes: classes de `blog.css` (`.blog-nav`, `.post`, `.post-header`, `.post-body`, `.post-examples`, `.post-disclaimer`, `.post-cta`, `.site-footer`, `.tag--caramelo`) e `blog.js`.
- Produces: o **template comentado** que as Tasks 3 copiam. Marcadores de comentário `<!-- 1. TÍTULO -->` … `<!-- 7. CTA -->` sinalizam as 7 seções.

- [ ] **Step 1: Criar `blog/voce-nao-e-demais.html`**

Estrutura completa abaixo. Os comentários `<!-- N. … -->` mapeiam as 7 seções obrigatórias e servem de guia para os próximos posts.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- 1. TÍTULO (50–60 caracteres, palavra-chave: intensidade emocional) -->
  <title>Você não é "demais": sobre a intensidade emocional</title>
  <meta name="description" content="Sentir com intensidade não é defeito. Entenda a intensidade emocional, veja exemplos do dia a dia e o que fazer quando dizem que você exagera.">
  <meta name="author" content="Karol Moreno">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://www.karolpsicologa.com.br/blog/voce-nao-e-demais.html">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Karol Moreno Psicóloga">
  <meta property="og:title" content="Você não é &quot;demais&quot;: sobre a intensidade emocional">
  <meta property="og:description" content="Sentir com intensidade não é defeito. Entenda a intensidade emocional e o que fazer quando dizem que você exagera.">
  <meta property="og:url" content="https://www.karolpsicologa.com.br/blog/voce-nao-e-demais.html">
  <meta property="og:image" content="https://www.karolpsicologa.com.br/og-image.jpg">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png">
  <meta name="theme-color" content="#2B0E06">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cantarell:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./blog.css">
  <noscript><style>.reveal{opacity:1;transform:none;}</style></noscript>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Você não é \"demais\": sobre a intensidade emocional",
    "description": "Sentir com intensidade não é defeito. Entenda a intensidade emocional e o que fazer quando dizem que você exagera.",
    "datePublished": "2026-07-09",
    "dateModified": "2026-07-09",
    "inLanguage": "pt-BR",
    "author": { "@type": "Person", "name": "Karol Moreno", "jobTitle": "Psicóloga" },
    "publisher": { "@type": "Organization", "name": "Karol Moreno Psicóloga", "logo": { "@type": "ImageObject", "url": "https://www.karolpsicologa.com.br/apple-touch-icon.png" } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.karolpsicologa.com.br/blog/voce-nao-e-demais.html" }
  }
  </script>
</head>
<body>
  <nav class="blog-nav">
    <a class="blog-nav__brand" href="../index.html">Psicóloga Karol</a>
    <a class="blog-nav__back" href="./index.html">← Voltar ao blog</a>
  </nav>

  <article class="post">
    <header class="post-header">
      <a class="post-back" href="./index.html">← Voltar ao blog</a>
      <span class="tag tag--caramelo">Emoções</span>
      <!-- 1. TÍTULO (H1) -->
      <h1 class="post-title">Você não é "demais": sobre a intensidade emocional</h1>
      <p class="post-meta">por Karol Moreno · 9 de julho de 2026 · 6 min de leitura</p>
    </header>

    <div class="post-body">
      <!-- 2. INTRODUÇÃO — nomeia o que o leitor sente -->
      <p>Talvez você já tenha ouvido que é "muito sensível", que "leva tudo para o lado pessoal" ou que "faz drama". Talvez tenha passado a vida tentando diminuir o volume do que sente para caber no que os outros esperam.</p>
      <p>Se sentir com intensidade te fez, em algum momento, acreditar que existe algo errado com você, este texto é para você. A intensidade emocional não é um defeito de fábrica — é uma forma de funcionar que pode, sim, ser compreendida e cuidada.</p>

      <!-- 3. DESENVOLVIMENTO — H2/H3, parágrafos curtos -->
      <h2>O que é intensidade emocional</h2>
      <p>Intensidade emocional é sentir as emoções com mais força e por mais tempo do que a média das pessoas. A alegria é enorme; a dor, também. As emoções chegam rápido, ocupam muito espaço e demoram mais para baixar.</p>
      <p>Isso não é o mesmo que "ser fraco" ou "não ter controle". É uma característica do temperamento que, em alguns casos, aparece junto de quadros como o Transtorno de Personalidade Borderline — mas que também existe em muita gente sem qualquer diagnóstico.</p>

      <h3>Por que dói tanto ouvir "você é demais"</h3>
      <p>Quando alguém diz que você "exagera", a mensagem que chega por dentro costuma ser outra: "o que eu sinto não é válido". Repetida ao longo dos anos, essa mensagem ensina a desconfiar das próprias emoções — e a se calar.</p>

      <!-- 4. EXEMPLOS PRÁTICOS — situações do cotidiano -->
      <div class="post-examples">
        <p class="post-examples__label">No dia a dia, isso pode parecer com</p>
        <ul>
          <li>Uma crítica pequena no trabalho que ocupa a sua cabeça pelo resto do dia.</li>
          <li>Uma demora para responder mensagem que vira uma certeza de que a pessoa se afastou.</li>
          <li>Uma alegria tão grande por um plano que a frustração, se ele muda, parece desproporcional.</li>
          <li>Chorar e, logo depois, se sentir envergonhada por ter chorado.</li>
        </ul>
      </div>

      <!-- 5. O QUE FAZER — concreto, sem prometer resultado -->
      <h2>O que fazer quando a emoção parece grande demais</h2>
      <p>Não existe um botão de desligar — e tudo bem. O objetivo não é sentir menos, e sim se relacionar de outro jeito com o que sente. Alguns caminhos que costumam ajudar:</p>
      <ul>
        <li><strong>Nomear o que está sentindo.</strong> Dar nome à emoção ("estou com medo de ser rejeitada") já reduz um pouco da força dela.</li>
        <li><strong>Ganhar tempo antes de reagir.</strong> Respirar, beber água, sair do ambiente por alguns minutos. A emoção intensa costuma baixar sozinha se não for alimentada de imediato.</li>
        <li><strong>Checar os fatos.</strong> Perguntar-se "o que eu sei de verdade aqui?" ajuda a separar o que aconteceu do que a emoção está interpretando.</li>
        <li><strong>Procurar apoio profissional.</strong> Uma psicoterapia com foco em regulação emocional oferece um espaço para entender esses padrões com mais cuidado.</li>
      </ul>

      <!-- 6. DISCLAIMER -->
      <aside class="post-disclaimer">
        <span class="post-disclaimer__icon" aria-hidden="true">ⓘ</span>
        <p>Este conteúdo tem caráter informativo e não substitui o acompanhamento de um profissional de saúde. Cada história é única — se você está sofrendo, buscar ajuda especializada faz diferença.</p>
      </aside>
    </div>

    <!-- 7. CTA -->
    <section class="post-cta">
      <div class="post-cta__box">
        <p class="post-cta__kicker">Você não precisa dar conta sozinha</p>
        <p class="post-cta__title">Que tal conversar sobre o que você sente, sem julgamento?</p>
        <a class="post-cta__btn" href="https://wa.me/+558488883636" target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp</a>
      </div>
    </section>
  </article>

  <!-- FOOTER: copiar bloco <footer class="site-footer">…</footer> igual ao de blog/index.html -->
  <footer class="site-footer">
    <!-- MESMO conteúdo do footer de blog/index.html (Task 1, Step 3) -->
  </footer>

  <script src="./blog.js"></script>
</body>
</html>
```

> No Step 1, o bloco `<footer class="site-footer">…</footer>` deve ser **copiado integralmente** do `blog/index.html` criado na Task 1 (mesma marcação, incluindo os 3 links sociais e a barra inferior Maranata).

- [ ] **Step 2: Verificar no navegador**

Abrir `blog/voce-nao-e-demais.html`. Conferir:
- Nav com "← Voltar ao blog" leva para `blog/index.html`.
- Cabeçalho: tag, H1 grande em Playfair, linha de meta.
- Corpo: parágrafos legíveis (~680px), H2/H3 estilizados, bloco de exemplos em creme, disclaimer em tom vinho.
- CTA escuro com botão terracota → abre WhatsApp `wa.me/+558488883636` em nova aba.
- Rodapé presente e igual ao do site.
- A partir de `blog/index.html`, o card "Você não é demais" abre este post.

- [ ] **Step 3: Commit**

```bash
git add blog/voce-nao-e-demais.html
git commit -m "feat(blog): add reference post (voce-nao-e-demais) as template"
```

---

## Task 3: Posts 2 e 3 — borderline e DBT

**Files:**
- Create: `blog/o-que-e-borderline.html`
- Create: `blog/dbt-regulacao-emocional.html`

**Interfaces:**
- Consumes: o template completo de `blog/voce-nao-e-demais.html` (Task 2). Cada arquivo é uma cópia com head/JSON-LD/`<h1>`/conteúdo trocados; nav, footer, CTA e estrutura das 7 seções permanecem.

- [ ] **Step 1: Criar `blog/o-que-e-borderline.html`**

Copiar o arquivo `blog/voce-nao-e-demais.html` inteiro e trocar:

- `<title>` → `O que é o Transtorno de Personalidade Borderline (TPB)?`
- `meta name="description"` / `og:description` / JSON-LD `description` → `Entenda o que é o Transtorno de Personalidade Borderline (TPB): sinais, causas e como a intensidade emocional se manifesta — sem jargão e sem julgamento.`
- `og:title` / JSON-LD `headline` → `O que é o Transtorno de Personalidade Borderline (TPB)?`
- `canonical`, `og:url`, JSON-LD `mainEntityOfPage.@id` → `https://www.karolpsicologa.com.br/blog/o-que-e-borderline.html`
- tag → `Borderline`
- `<h1>` → `O que é o Transtorno de Personalidade Borderline (TPB)?`
- meta → `por Karol Moreno · 9 de julho de 2026 · 7 min de leitura`

Conteúdo das 7 seções (substituir os blocos correspondentes):

- **2. Introdução:**
  - § "Você sente as coisas em uma intensidade que os outros parecem não entender. Os relacionamentos oscilam entre o 'oito ou oitenta', o medo de ser abandonada aperta o peito, e a sua própria imagem parece mudar dependendo do dia."
  - § "Se você já se perguntou se isso tem nome, o Transtorno de Personalidade Borderline (TPB) pode fazer parte da resposta. Entender o que ele é — e o que não é — costuma ser o primeiro alívio."
- **3. Desenvolvimento:**
  - `<h2>O que é o Transtorno de Personalidade Borderline</h2>` + 2 § (definição: padrão de instabilidade em emoções, relacionamentos, autoimagem e impulsividade; é um diagnóstico clínico feito por profissional, não um rótulo de personalidade "difícil").
  - `<h3>Principais sinais</h3>` + § curto introduzindo a lista.
  - `<h2>Por que acontece</h2>` + § (combinação de fatores biológicos/temperamento + experiências de vida; não é culpa de quem tem).
- **4. Exemplos práticos** (`.post-examples`, label "Na prática, pode aparecer como"): lista com — medo intenso de abandono que leva a testar quem se ama; relações que passam de idealização a decepção rápido; sensação de vazio; decisões impulsivas em momentos de dor; mudanças bruscas de humor no mesmo dia.
- **5. O que fazer** (`<h2>O que fazer se você se identificou</h2>` + `<ul>`): buscar avaliação com psicólogo/psiquiatra (só um profissional diagnostica); saber que TPB tem tratamento com boa resposta, especialmente DBT; evitar autodiagnóstico definitivo pela internet; cuidar do básico (sono, rede de apoio) enquanto busca ajuda. Cada item com `<strong>` no começo.
- **6. Disclaimer:** mesmo texto do template.
- **7. CTA:** kicker "Entender o que se passa é o primeiro passo"; título "Quer conversar com uma especialista em borderline?"; botão igual.

- [ ] **Step 2: Criar `blog/dbt-regulacao-emocional.html`**

Copiar o template e trocar:

- `<title>` → `DBT: a terapia que ajuda a regular emoções intensas`
- description (todas) → `Conheça a Terapia Comportamental Dialética (DBT): as quatro habilidades que ajudam a regular emoções intensas e a lidar melhor com relacionamentos e impulsos.`
- `og:title` / `headline` → `DBT: a terapia que ajuda a regular emoções intensas`
- `canonical`/`og:url`/`@id` → `https://www.karolpsicologa.com.br/blog/dbt-regulacao-emocional.html`
- tag → `DBT`
- `<h1>` → `DBT: a terapia que ajuda a regular emoções intensas`
- meta → `por Karol Moreno · 9 de julho de 2026 · 8 min de leitura`

Conteúdo das 7 seções:

- **2. Introdução:** § "Quando as emoções chegam com muita força, ouvir 'tenta se acalmar' não ajuda — porque o problema nunca foi falta de vontade." + § "A Terapia Comportamental Dialética (DBT) nasceu justamente para isso: ensinar, na prática, habilidades para atravessar emoções intensas sem se machucar no caminho."
- **3. Desenvolvimento:**
  - `<h2>O que é a DBT</h2>` + § (abordagem baseada em evidências, criada por Marsha Linehan, uma das mais estudadas para borderline e desregulação emocional; une aceitação e mudança).
  - `<h2>As quatro habilidades da DBT</h2>` + `<h3>Mindfulness</h3>` § · `<h3>Tolerância ao mal-estar</h3>` § · `<h3>Regulação emocional</h3>` § · `<h3>Efetividade interpessoal</h3>` § (um parágrafo curto explicando cada uma em linguagem simples).
- **4. Exemplos práticos** (label "Como isso aparece na vida real"): usar respiração/gelo para atravessar uma crise sem agir por impulso; nomear a emoção antes de responder a uma mensagem; pedir o que precisa sem brigar nem se calar; observar um pensamento difícil sem se fundir a ele.
- **5. O que fazer** (`<h2>Como começar</h2>`): procurar um profissional que trabalhe com DBT; entender que habilidades se aprendem com prática, não de um dia para o outro; combinar terapia individual com treino de habilidades quando indicado; ter paciência e autocompaixão no processo. Sem prometer cura.
- **6. Disclaimer:** mesmo texto.
- **7. CTA:** kicker "Dá para aprender a lidar com o que você sente"; título "Quer conhecer a DBT na prática, com acompanhamento?"; botão igual.

- [ ] **Step 3: Verificar no navegador**

Abrir os dois posts. Conferir em cada um:
- `<title>`/H1 corretos e coerentes com o card do índice.
- 7 seções presentes na ordem (intro → desenvolvimento H2/H3 → exemplos → o que fazer → disclaimer → CTA).
- Nav "voltar ao blog", footer e CTA WhatsApp funcionando.
- No `blog/index.html`, os cards "Borderline" e "DBT" abrem os posts certos.
- Validar o JSON-LD de cada post colando o trecho em https://validator.schema.org/ (ou conferir que é JSON válido).

- [ ] **Step 4: Commit**

```bash
git add blog/o-que-e-borderline.html blog/dbt-regulacao-emocional.html
git commit -m "feat(blog): add borderline and DBT example posts"
```

---

## Task 4: Ponto de entrada no rodapé do site + sitemap

**Files:**
- Modify: `index.html` (rodapé, coluna "Navegação", ~linha 3065)
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: `blog/index.html` e os 3 posts (Tasks 1–3) já existentes.

- [ ] **Step 1: Adicionar link "Blog" no rodapé de `index.html`**

Localizar no `index.html` a lista da coluna Navegação do rodapé:

```html
            <li><a href="#faq">Perguntas Frequentes</a></li>
          </ul>
```

Inserir o item Blog imediatamente antes do fechamento `</ul>`:

```html
            <li><a href="#faq">Perguntas Frequentes</a></li>
            <li><a href="./blog/index.html">Blog</a></li>
          </ul>
```

- [ ] **Step 2: Adicionar as URLs do blog ao `sitemap.xml`**

Abrir `sitemap.xml` e adicionar, antes de `</urlset>`, quatro entradas (ajustar o domínio se o do arquivo diferir; usar o mesmo host das URLs já existentes):

```xml
  <url><loc>https://www.karolpsicologa.com.br/blog/index.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.karolpsicologa.com.br/blog/o-que-e-borderline.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.karolpsicologa.com.br/blog/dbt-regulacao-emocional.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://www.karolpsicologa.com.br/blog/voce-nao-e-demais.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
```

- [ ] **Step 3: Verificar no navegador**

- Abrir `index.html` (site raiz), rolar até o rodapé, clicar em "Blog" na coluna Navegação → deve navegar para `blog/index.html`.
- A partir do blog, "← Voltar ao site" e o link de rodapé retornam ao `index.html`.
- Abrir `sitemap.xml` no navegador → XML bem-formado, sem erro de parse, com as 4 URLs novas.

- [ ] **Step 4: Commit**

```bash
git add index.html sitemap.xml
git commit -m "feat(blog): link blog from site footer and add to sitemap"
```

---

## Self-Review (autor do plano)

**Cobertura do spec:**
- Estrutura de arquivos `/blog/` → Tasks 1–3. ✓
- `blog.css` compartilhado → Task 1. ✓
- Índice com hero + cards + footer → Task 1. ✓
- Páginas de post com 7 seções → Tasks 2–3 (comentários `<!-- N -->`). ✓
- SEO por post (title/desc/OG/canonical/JSON-LD BlogPosting) → Tasks 2–3. ✓
- CTA WhatsApp `wa.me/+558488883636` → Tasks 2–3. ✓
- Reveal-on-scroll (`blog.js`, progressive enhancement + `<noscript>`) → Task 1. ✓
- Fallback texturizado nas capas (sem imagem) → `.post-card__cover` na Task 1. ✓
- Link só no rodapé → Task 4. ✓
- URLs no sitemap → Task 4. ✓
- 3 posts de exemplo nos temas da Karol → Tasks 2–3. ✓

**Placeholders:** conteúdo real em todos os steps; o único "copiar de" é a reutilização deliberada do footer/template (DRY), com a fonte exata indicada.

**Consistência de tipos/nomes:** classes CSS definidas na Task 1 e consumidas nas Tasks 2–3 batem (`.post-body`, `.post-examples`, `.post-examples__label`, `.post-disclaimer`, `.post-disclaimer__icon`, `.post-cta`, `.post-cta__box/__kicker/__title/__btn`, `.blog-nav__brand/__back`, `.post-card__cover/__body/__title/__excerpt/__meta/__more`). Slugs de arquivo idênticos entre cards (Task 1), posts (Tasks 2–3) e sitemap (Task 4).
