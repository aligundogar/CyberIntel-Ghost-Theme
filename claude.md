# Ghost Blog Theme — Siber İstihbarat & Jeopolitik

## Proje Kimliği

Bu proje, **siber istihbarat**, **siber güvenlik** ve **jeopolitik** alanlarına odaklanmış bir Ghost blog temasıdır. TryGhost/Starter şablonundan türetilmiştir.

- **Tema adı**: `ghost-starter-theme` (package.json `name` alanı — özelleştirilecek)
- **Ghost uyumluluk**: `>=5.0.0`
- **Lisans**: MIT
- **Build sistemi**: Rollup + PostCSS + Babel
- **Şablon motoru**: Handlebars (`.hbs`)

---

## Dosya Yapısı

```
Starter/
├── default.hbs          # Ana layout (head, header, nav, main, footer)
├── index.hbs            # Ana sayfa — post listesi (infinite scroll + pagination fallback)
├── post.hbs             # Tekil post sayfası (responsive images: avif/webp/fallback)
├── page.hbs             # Statik sayfa şablonu
├── tag.hbs              # Etiket arşiv sayfası
├── author.hbs           # Yazar arşiv sayfası
├── error.hbs            # Hata sayfası (404/500, tema hata detayları)
├── package.json         # Tema manifest + config (posts_per_page, image_sizes, card_assets)
├── rollup.config.js     # Build pipeline: JS bundle + PostCSS → assets/built/
│
├── assets/
│   ├── css/
│   │   ├── vars.css                 # CSS değişkenleri (renkler, fontlar, breakpoints)
│   │   ├── index.css                # Ana CSS — tüm component importları + layout
│   │   ├── components/              # global.css, forms.css, buttons.css
│   │   └── ghost/                   # header.css, content.css, readmore.css, members.css,
│   │                                  errors.css, footer.css, badge.css, pagination.css, comments.css
│   ├── js/
│   │   ├── index.js                 # JS entry point
│   │   ├── infiniteScroll.js        # Sonsuz kaydırma
│   │   └── menuOpen.js              # Mobil menü toggle
│   └── built/                       # Build çıktısı (index.css, index.js)
│
├── partials/
│   ├── card.hbs                     # Post kartı partial (responsive images)
│   └── icons/                       # SVG ikonlar: arrow-left/right, avatar, facebook, 
│                                      loader, rss, twitter
│
└── members/
    ├── account.hbs                  # Üye hesap sayfası
    ├── signin.hbs                   # Giriş formu
    └── signup.hbs                   # Kayıt formu
```

---

## Ghost Tema Geliştirme Kuralları

### Şablon Hiyerarşisi
- `default.hbs` → Tüm sayfaların base layout'u (HTML head, ghost_head, ghost_foot)
- `{{!< default}}` → Bir şablonun default.hbs'i extend ettiğini belirtir
- `{{{body}}}` → default.hbs içinde alt şablonun render edildiği yer
- `index.hbs` → Ana sayfa + tüm collection sayfaları için fallback
- `home.hbs` → Sadece ana sayfa için özel şablon (oluşturulabilir)
- `post-:slug.hbs` → Belirli bir post için özel şablon
- `page-:slug.hbs` → Belirli bir sayfa için özel şablon
- `custom-*.hbs` → Ghost Admin'den seçilebilen özel şablonlar

### Handlebars Helper'ları (Sık Kullanılanlar)
```handlebars
{{!-- Site verileri --}}
{{@site.title}}          {{@site.logo}}           {{@site.url}}
{{@site.description}}    {{@site.locale}}         {{@site.signup_url}}
{{@site.members_enabled}}

{{!-- Post verileri --}}
{{title}}    {{content}}    {{excerpt}}    {{url}}
{{date format="D MMM YYYY"}}              {{reading_time}}
{{feature_image}}                         {{feature_image_alt}}
{{custom_excerpt}}                        {{feature_image_caption}}

{{!-- Döngüler --}}
{{#foreach posts}} ... {{/foreach}}
{{#foreach authors}} ... {{/foreach}}

{{!-- Navigasyon --}}
{{navigation}}                            {{navigation type="secondary"}}

{{!-- Koşullar --}}
{{#if feature_image}} ... {{/if}}
{{#if @member}} ... {{else}} ... {{/if}}
{{#match @custom.setting "value"}} ... {{/match}}

{{!-- Resim optimizasyonu --}}
{{img_url feature_image size="l" format="avif"}}

{{!-- Arama --}}
{{search}}

{{!-- Sayfalama --}}
{{pagination}}
{{#next_post}} ... {{/next_post}}
{{#prev_post}} ... {{/prev_post}}

{{!-- Yorumlar --}}
{{comments}}

{{!-- Asset yükleme --}}
{{asset "built/index.css"}}
{{asset "built/index.js"}}

{{!-- Meta --}}
{{ghost_head}}    {{ghost_foot}}
{{meta_title}}    {{body_class}}    {{post_class}}
```

### Custom Settings (package.json config.custom)
Ghost Admin > Design panelinde görünecek özel ayarlar:
```json
{
  "config": {
    "custom": {
      "setting_name": {
        "type": "select|boolean|color|image|text",
        "options": ["..."],
        "default": "...",
        "group": "homepage|post",
        "description": "..."
      }
    }
  }
}
```
Şablonlarda `{{@custom.setting_name}}` ile erişilir.

### Geliştirme Komutları
```bash
npm run dev       # Rollup watch mode + livereload (HBS/CSS/JS değişikliklerini izler)
npm run build     # Production build (minified)
npm run zip       # Tema zip paketi oluştur (Ghost Admin'e yüklemek için)
npm run test      # GScan ile tema doğrulaması (gscan .)
```

### GScan Doğrulaması
- Tema Ghost Admin'e yüklendiğinde otomatik GScan kontrolü yapılır
- Fatal hatalar temanın kullanılmasını engeller
- Geliştirme sırasında `npx gscan .` ile test edilmeli
- Online: https://gscan.ghost.org/

---

## CSS Mimarisi

### Değişkenler (vars.css)
```css
:root {
    --color-primary: var(--ghost-accent-color, #3eb0ef);
    --color-base: #131313;
    --color-border: #ddd;
    --color-bg: #f5f5f5;
    --color-success: #80b912;
    --color-error: #f05230;
    
    --font-sans-serif: -apple-system, BlinkMacSystemFont, ...;
    --font-serif: Georgia, Times, serif;
    --font-mono: Menlo, Courier, monospace;
    
    /* Breakpoints */
    --xlarge: 1680px;  --large: 1280px;
    --medium: 980px;   --small: 740px;  --xsmall: 480px;
}
```

### BEM-benzeri Class İsimlendirme
- `gh-` prefix'i tüm Ghost tema class'larında kullanılır
- Layout: `gh-viewport`, `gh-main`, `gh-container`, `gh-page`
- Header: `gh-head`, `gh-head-inner`, `gh-head-brand`, `gh-head-menu`, `gh-head-actions`
- Footer: `gh-foot`, `gh-foot-menu`, `gh-foot-meta`
- Post: `gh-article`, `gh-header`, `gh-title`, `gh-content`, `gh-excerpt`
- Kart: `gh-card`, `gh-card-link`, `gh-card-image`, `gh-card-content`, `gh-card-meta`
- Sayfalama: `gh-postfeed`, `gh-pagination`, `gh-readmore`

### Responsive Images
Post ve kartlarda multi-format responsive image desteği var:
- Format: `avif` → `webp` → fallback (`jpg/png`)
- Sizes: `xxs(30w)`, `xs(100w)`, `s(300w)`, `m(600w)`, `l(1200w)`, `xl(2000w)`
- `<picture>` + `<source>` + `<img srcset>` pattern'i kullanılıyor

---

## İçerik Alanı: Siber İstihbarat & Jeopolitik

### Tema Geliştirme Yol Haritası

Bu tema aşağıdaki konulara özelleştirilecek:

#### Hedef İçerik Kategorileri
- **Siber İstihbarat (Cyber Intelligence)**: Tehdit istihbaratı, APT grupları, CTI raporları, OSINT
- **Siber Güvenlik (Cybersecurity)**: Zafiyet analizleri, pentest sonuçları, güvenlik tavsiyeleri
- **Jeopolitik (Geopolitics)**: Siber savaş, devlet destekli tehdit aktörleri, kritik altyapı güvenliği
- **Tehdit Analizi**: IOC'ler, MITRE ATT&CK haritalama, TTP analizleri
- **OSINT & Araştırma**: Açık kaynak istihbarat araçları, metodolojiler

#### Planlanan Tema Özellikleri
- [ ] Dark mode varsayılan tema (siber güvenlik estetiği)
- [ ] Tehdit seviyesi göstergeleri / etiket renklendirmesi (Critical/High/Medium/Low)
- [ ] Kod bloğu ve terminal çıktısı vurgulama (teknik içerik için)
- [ ] IOC (Indicators of Compromise) gösterim kartları
- [ ] MITRE ATT&CK matris entegrasyonu / referans bağlantıları
- [ ] Coğrafi tehdit haritası widget'ı
- [ ] Zaman çizelgesi görünümü (saldırı kronolojileri için)
- [ ] Özel tag ikonları (siber güvenlik kategorileri için)
- [ ] Newsletter/üyelik CTA'ları (tehdit bülteni aboneliği)
- [ ] Responsive ve mobile-first tasarım
- [ ] SEO optimizasyonu (siber güvenlik anahtar kelimeleri)
- [ ] Sosyal medya paylaşım kartları (OG/Twitter Cards)
- [ ] RSS feed optimizasyonu (CTI araçları ile entegrasyon için)

#### Tasarım Dili
- **Renk paleti**: Koyu arka plan, neon yeşil/mavi/kırmızı vurgular (hacker/terminal estetiği)
- **Tipografi**: Mono font başlıklar ve kod blokları; clean sans-serif gövde metni
- **İkonografi**: Shield, lock, radar, globe, terminal tarzı ikonlar
- **UI elementleri**: Glitch efektleri, matrix-style animasyonlar, glassmorphism kartlar

---

## Geliştirme Notları

### Önemli Ghost API Sınırlamaları
- Handlebars şablonları sunucu tarafında render edilir (SSR)
- Client-side JS sadece `assets/js/` üzerinden eklenir
- Ghost Content API ayrıca kullanılabilir (headless/JAMstack senaryoları için)
- `{{ghost_head}}` ve `{{ghost_foot}}` mutlaka dahil edilmeli
- `card_assets: true` → Ghost editör kartlarının CSS/JS'i otomatik yüklenir

### Build Pipeline
- **Entry**: `assets/js/index.js` → `assets/built/index.js` (IIFE, minified)
- **CSS**: `assets/css/index.css` → `assets/built/index.css` (PostCSS: @import, preset-env, minified)
- **Dev mode**: Livereload (HBS + CSS + JS dosyalarını izler)
- **Source maps**: Hem JS hem CSS için aktif

### Production Deployment
```bash
npm run zip    # ghost-starter-theme.zip oluşturur
# Ghost Admin > Settings > Design > Upload theme
```

### Özel Şablon Oluşturma
Belirli sayfalar/postlar için özel şablonlar:
```
custom-threat-report.hbs    # "Threat Report" şablonu
custom-ioc-list.hbs         # "IOC List" şablonu  
custom-timeline.hbs         # "Timeline" şablonu
page-about.hbs              # /about sayfası için özel şablon
```

---

## Kod Stili & Konvansiyonlar

- CSS class'ları `gh-` prefix ile başlar
- PostCSS kullanılır (native CSS nesting desteklenir - postcss-preset-env)
- JavaScript ES module format (package.json `"type": "module"`)
- Handlebars partial'ları `partials/` dizininde, `{{> "partial-name"}}` ile çağrılır
- SVG ikonlar `partials/icons/` içinde `.hbs` dosyaları olarak tutulur
- Responsive tasarım mobile-first yaklaşımla yapılmalı
- Image'larda lazy loading kullanılmalı (`loading="lazy"`)
- Accessibility: `aria-label`, `alt` attribute'ları her zaman sağlanmalı
