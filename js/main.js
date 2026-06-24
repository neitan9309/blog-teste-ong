/**
 * Utilitários compartilhados entre todas as páginas do BlogSocial
 */
class BlogUtils {

    /**
     * Gera o HTML de um card de artigo para listagem
     * @param {Object} artigo - Dados do artigo
     * @returns {string} HTML do card
     */
    static criarCardArtigo(artigo) {
        return `
            <article class="artigo-card" onclick="window.location.href='artigo.html?id=${artigo.id}'">
                <div class="artigo-imagem">
                    <img src="${artigo.imagem}" alt="${artigo.titulo}" loading="lazy">
                </div>
                <div class="artigo-info">
                    <h3>${artigo.titulo}</h3>
                    <div class="palavras-chave">
                        ${artigo.palavrasChave.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                    </div>
                    <div class="artigo-meta">
                        <span>${new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                        <span>${artigo.autor}</span>
                    </div>
                </div>
            </article>
        `;
    }

    /**
     * Configura o menu mobile (hambúrguer)
     */
    static setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }

    /**
     * Configura os formulários de newsletter no footer
     */
    static setupNewsletter() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                console.log('Newsletter inscrição:', email);
                alert('Obrigado por se inscrever! Você receberá nossas atualizações.');
                form.reset();
            });
        });
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    BlogUtils.setupMobileMenu();
    BlogUtils.setupNewsletter();
});