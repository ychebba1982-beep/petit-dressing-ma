// ================================================
// Petit Dressing MA — main.js
// ================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ===== MOBILE MENU =====
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navbar') && !e.target.closest('#mobileMenu')) {
      mobileMenu?.classList.remove('open');
    }
  });

  // Fermer menu sur clic lien
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));

  // ===== PRODUITS depuis localStorage =====
  chargerProduits();

});

// ===== CHARGER PRODUITS ADMIN =====
function chargerProduits() {
  const grid = document.getElementById('produitsGrid');
  if (!grid) return;

  const articles = JSON.parse(localStorage.getItem('petitdressing_articles') || '[]');
  if (articles.length === 0) return;

  // Vider les produits statiques si des produits admin existent
  // (garder les statiques pour l'instant)

  articles.slice(0, 4).forEach(article => {
    const card = creerCarteArticle(article);
    grid.appendChild(card);
  });
}

function creerCarteArticle(article) {
  const card = document.createElement('div');
  card.className = 'produit-card reveal';
  card.setAttribute('data-cat', article.cat);
  card.onclick = () => {
    window.location.href = `article.html?id=${article.id}`;
  };

  const waMsg = encodeURIComponent(`Bonjour, je suis intéressé(e) par "${article.nom}" (${article.taille}) à ${article.prix} DH`);

  card.innerHTML = `
    <div class="produit-img-wrap">
      ${article.image
        ? `<img src="${article.image}" alt="${article.nom}" loading="lazy">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:var(--cream-dark);">👕</div>`
      }
      <span class="produit-badge occasion">Occasion</span>
      <div class="produit-actions">
        <button class="produit-action-btn" title="Commander" onclick="event.stopPropagation(); window.open('https://wa.me/212600000000?text=${waMsg}','_blank')">📱</button>
      </div>
    </div>
    <div class="produit-info">
      <div class="produit-cat">${getCatLabel(article.cat)}</div>
      <div class="produit-name">${article.nom}</div>
      <div class="produit-taille">📏 ${article.taille}</div>
      <div class="produit-footer">
        <div class="produit-prix">${article.prix} <span>DH</span></div>
        <a href="https://wa.me/212600000000?text=${waMsg}" target="_blank" class="btn-commander" onclick="event.stopPropagation()">Commander</a>
      </div>
    </div>`;

  return card;
}

function getCatLabel(cat) {
  const labels = { fille: '👧 Fille', garcon: '👦 Garçon', bebe: '👶 Bébé', set: '👕 Set' };
  return labels[cat] || cat;
}
