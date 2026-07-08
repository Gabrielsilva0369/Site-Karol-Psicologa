# Blog front-end — Design

**Data:** 2026-07-09
**Contexto:** Site `index.html` único e autocontido (CSS inline) da Psicóloga Karol Moreno. Queremos adicionar um blog puramente front-end (HTML/CSS/JS estático, sem build nem servidor) usando a mesma identidade visual. O link para o blog fica, por enquanto, apenas no rodapé do site.

## Objetivo

Blog estático voltado a SEO/marketing de conteúdo — atrair tráfego orgânico para temas da Karol (borderline/TPB, DBT, regulação emocional). Cada post é uma página HTML própria com URL real e dados estruturados, para indexação individual no Google.

## Decisões (definidas com o usuário)

- **Autoria:** um arquivo HTML por post + uma página índice. Publicar = duplicar um template e adicionar um card no índice.
- **Conteúdo inicial:** montar a estrutura completa com 3 posts de exemplo (textos plausíveis) que a Karol edita/substitui depois.
- **Organização:** posts soltos dentro de `/blog/` (URLs rasas tipo `/blog/o-que-e-borderline.html`), não em subpasta.
- **Estilo:** `blog.css` compartilhado (não inline por página) para manter consistência e um único ponto de alteração.
- **Ponto de entrada:** somente um link "Blog" na coluna "Navegação" do rodapé do `index.html`.

## Identidade visual (tokens reutilizados do site)

- Cores: `--c-escuro #2B0E06`, `--c-marrom #3B1A0A`, `--c-vinho #5C1F1A`, `--c-terracota #B84500`, `--c-caramelo #B07848`, `--c-areia #DCC48A`, `--c-creme #F5EDE0`, `--c-linho #FAF4ED`.
- Fontes: Playfair Display (display/título, itálico nos destaques), Cantarell (corpo). Carregadas via Google Fonts, igual ao site.
- Texturas: ruído SVG (fractalNoise) em fundos escuros; cantos arredondados (`--r-sm 8`, `--r-md 16`, `--r-lg 24`, `--r-pill 100`).
- Interações: hover de elevação nos cards; reveal-on-scroll.

## Estrutura de arquivos

```
/blog/
  index.html                 → índice (lista de artigos)
  blog.css                   → tokens + reset + fonte + nav + footer + componentes do blog
  blog.js                    → reveal-on-scroll (IntersectionObserver, igual ao index.js)
  o-que-e-borderline.html
  dbt-regulacao-emocional.html
  voce-nao-e-demais.html
```

O `index.html` do site raiz muda **apenas** para incluir o link do blog no rodapé. `sitemap.xml` ganha as novas URLs.

## Componentes / páginas

### 1. Índice do blog — `/blog/index.html`
- **Nav** escura fixa: marca "Psicóloga Karol" (linka `../index.html`) + link "← Voltar ao site".
- **Hero** marrom com textura de ruído: kicker, título grande em Playfair itálico, descrição curta.
- **Grade de cards** responsiva (1 col mobile / 2–3 desktop). Card: tag de categoria, título (Playfair), data, resumo, "Ler artigo →". Fundo linho/creme, hover de elevação.
- **Rodapé** idêntico ao do site (mesma marcação/estilo, reaproveitado via `blog.css`).

### 2. Página de post — `/blog/*.html`
Cada post segue **obrigatoriamente** este esqueleto de conteúdo, mapeado para HTML:

| # | Seção | HTML |
|---|-------|------|
| 1 | Título (50–60 caracteres, palavra-chave principal) | `<h1>` + `<title>`/OG/canonical coerentes |
| 2 | Introdução (2–3 parágrafos que nomeiam o que o leitor sente) | parágrafos de abertura |
| 3 | Desenvolvimento (subtítulos H2/H3, parágrafos curtos) | corpo com `<h2>`/`<h3>` |
| 4 | Exemplos práticos (situações cotidianas de identificação) | bloco de exemplos com destaque visual |
| 5 | O que fazer (orientações concretas, sem prometer resultado) | seção de orientações |
| 6 | Disclaimer (informativo, não substitui acompanhamento) | caixa de aviso estilizada |
| 7 | CTA (agendar pelo WhatsApp) | bloco CTA terracota, botão `wa.me` igual ao rodapé |

Anatomia da página: nav + "← Voltar ao blog" → cabeçalho do artigo (tag, `<h1>`, data + tempo de leitura, "por Karol Moreno") → corpo em coluna de leitura (~680px, tipografia para h2/h3/p/blockquote/listas na paleta creme/marrom) → bloco de exemplos → o que fazer → disclaimer → CTA → rodapé.

Um dos posts (`voce-nao-e-demais.html`) servirá também como **template comentado** de referência para os próximos.

### 3. Link no rodapé do site
Adicionar em `index.html`, coluna "Navegação":
```html
<li><a href="./blog/index.html">Blog</a></li>
```

## SEO por post

`<title>` único, meta description, Open Graph (title/description/url/image), `<link rel="canonical">` e JSON-LD `BlogPosting` (headline, datePublished, author, publisher, mainEntityOfPage). URLs adicionadas ao `sitemap.xml`.

## Fluxo de dados

100% estático. Sem JS obrigatório para o conteúdo. `blog.js` só adiciona a animação reveal-on-scroll (progressive enhancement — funciona sem ele).

## Tratamento de erros / robustez

- Sem dependências de rede além das fontes (já usadas no site); páginas funcionam offline via `file://`.
- Imagens de capa opcionais: cards e posts têm fallback com fundo texturizado quando não há imagem, evitando quebra de layout.
- Links relativos (`../`) para assets do site raiz (favicon, logo Maranata, og-image).

## Verificação

Site estático → verificação manual no navegador: abrir `blog/index.html`, conferir layout responsivo (mobile/desktop), navegação (footer → blog, card → post, voltar), render do corpo do artigo e do CTA, e validade do JSON-LD. Sem suíte de testes automatizada (não há runtime de app).

## Fora de escopo (YAGNI)

Categorias/tags com filtro, busca, paginação, comentários, CMS, RSS, build step. Podem vir depois se necessário.
