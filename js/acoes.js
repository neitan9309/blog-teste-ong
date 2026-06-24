/**
 * Carrossel de Ações - BlogSocial
 * Gerencia o carrossel de ações sociais na página inicial
 */
class AcoesCarrossel {
    constructor() {
        this.slideAtual = 0;
        this.totalSlides = 0;
        this.slidesContainer = null;
        this.indicadoresContainer = null;
        this.contadorElement = null;
        this.btnAnterior = null;
        this.btnProximo = null;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;

        this.init();
    }

    init() {
        this.carregarElementos();
        if (!this.slidesContainer) return;

        this.totalSlides = this.slidesContainer.querySelectorAll('.acao-slide').length;
        if (this.totalSlides === 0) return;

        console.log('🎠 Carrossel de ações inicializado com', this.totalSlides, 'slides');

        this.criarIndicadores();
        this.configurarEventos();
        this.atualizarCarrossel();
        this.iniciarAutoplay();
    }

    carregarElementos() {
        this.slidesContainer = document.getElementById('acoesSlides');
        this.indicadoresContainer = document.getElementById('acoesIndicadores');
        this.contadorElement = document.getElementById('acoesContador');
        this.btnAnterior = document.getElementById('acoesAnterior');
        this.btnProximo = document.getElementById('acoesProximo');
    }

    criarIndicadores() {
        if (!this.indicadoresContainer) return;
        this.indicadoresContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const indicador = document.createElement('button');
            indicador.className = 'acoes-indicador';
            indicador.setAttribute('aria-label', `Ir para slide ${i + 1}`);
            indicador.addEventListener('click', () => this.irParaSlide(i));
            this.indicadoresContainer.appendChild(indicador);
        }
    }

    configurarEventos() {
        // Botões de navegação
        if (this.btnAnterior) this.btnAnterior.addEventListener('click', () => this.slideAnterior());
        if (this.btnProximo) this.btnProximo.addEventListener('click', () => this.proximoSlide());

        // Navegação por teclado (apenas quando o carrossel está visível)
        document.addEventListener('keydown', (e) => {
            const carrossel = document.querySelector('.acoes-carrossel');
            if (!carrossel) return;

            const rect = carrossel.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (!isVisible) return;

            if (e.key === 'ArrowLeft') this.slideAnterior();
            if (e.key === 'ArrowRight') this.proximoSlide();
        });

        // Pausar autoplay ao passar o mouse
        const carrossel = document.querySelector('.acoes-carrossel');
        if (carrossel) {
            carrossel.addEventListener('mouseenter', () => this.pararAutoplay());
            carrossel.addEventListener('mouseleave', () => this.iniciarAutoplay());
        }

        this.configurarTouch();
    }

    configurarTouch() {
        const carrossel = document.querySelector('.acoes-carrossel');
        if (!carrossel) return;

        let touchStartX = 0;
        let touchEndX = 0;

        carrossel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carrossel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.processarSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    processarSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? this.proximoSlide() : this.slideAnterior();
        }
    }

    irParaSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;

        // Animação de saída do slide atual
        const slides = this.slidesContainer.querySelectorAll('.acao-slide');
        if (slides[this.slideAtual]) {
            slides[this.slideAtual].style.opacity = '0.5';
            slides[this.slideAtual].style.transition = 'opacity 0.3s';
        }

        this.slideAtual = index;
        this.atualizarCarrossel();
        this.reiniciarAutoplay();
    }

    slideAnterior() {
        const novoIndex = this.slideAtual === 0 ? this.totalSlides - 1 : this.slideAtual - 1;
        this.irParaSlide(novoIndex);
    }

    proximoSlide() {
        const novoIndex = this.slideAtual === this.totalSlides - 1 ? 0 : this.slideAtual + 1;
        this.irParaSlide(novoIndex);
    }

    atualizarCarrossel() {
        // Mover o track de slides
        if (this.slidesContainer) {
            this.slidesContainer.style.transform = `translateX(-${this.slideAtual * 100}%)`;
        }

        // Restaurar opacidade e animar conteúdo do slide ativo
        const slides = this.slidesContainer.querySelectorAll('.acao-slide');
        slides.forEach((slide, index) => {
            slide.style.opacity = index === this.slideAtual ? '1' : '1';

            if (index === this.slideAtual) {
                const conteudo = slide.querySelector('.acao-conteudo');
                if (conteudo) {
                    conteudo.style.animation = 'none';
                    void conteudo.offsetHeight; // Força reflow
                    conteudo.style.animation = 'fadeInRight 0.6s ease-out';
                }
            }
        });

        // Atualizar indicadores
        if (this.indicadoresContainer) {
            const indicadores = this.indicadoresContainer.querySelectorAll('.acoes-indicador');
            indicadores.forEach((ind, i) => ind.classList.toggle('ativo', i === this.slideAtual));
        }

        // Atualizar contador
        if (this.contadorElement) {
            this.contadorElement.textContent = `${this.slideAtual + 1} / ${this.totalSlides}`;
        }

        // Garantir que os botões estejam habilitados
        if (this.btnAnterior) this.btnAnterior.disabled = false;
        if (this.btnProximo) this.btnProximo.disabled = false;
    }

    iniciarAutoplay() {
        if (this.totalSlides <= 1) return;
        this.pararAutoplay();
        this.autoplayInterval = setInterval(() => this.proximoSlide(), this.autoplayDelay);
    }

    pararAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    reiniciarAutoplay() {
        this.pararAutoplay();
        this.iniciarAutoplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.acoesCarrossel = new AcoesCarrossel();
});