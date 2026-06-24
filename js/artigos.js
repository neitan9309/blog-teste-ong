/**
 * Gerenciador da listagem de artigos com filtros e paginação
 */
class ArtigosManager {
    constructor() {
        this.artigosPorPagina = 3;
        this.paginaAtual = 1;
        this.artigosFiltrados = [...artigosDB.getTodosArtigos()];
        this.init();
    }

    init() {
        this.configurarFiltros();
        this.renderizarArtigos();
    }

    // ==========================================
    // FILTROS DE BUSCA E QUANTIDADE POR PÁGINA
    // ==========================================

    configurarFiltros() {
        const buscaInput = document.getElementById('buscaArtigos');
        const selectPagina = document.getElementById('artigosPorPagina');

        // Filtro por palavra-chave ou título
        buscaInput.addEventListener('input', () => {
            const termo = buscaInput.value.toLowerCase();
            this.artigosFiltrados = artigosDB.getTodosArtigos().filter(artigo =>
                artigo.titulo.toLowerCase().includes(termo) ||
                artigo.palavrasChave.some(keyword => keyword.toLowerCase().includes(termo))
            );
            this.paginaAtual = 1;
            this.renderizarArtigos();
        });

        // Alterar quantidade de artigos por página
        selectPagina.addEventListener('change', () => {
            this.artigosPorPagina = parseInt(selectPagina.value);
            this.paginaAtual = 1;
            this.renderizarArtigos();
        });
    }

    // ==========================================
    // RENDERIZAÇÃO DOS CARDS DE ARTIGO
    // ==========================================

    renderizarArtigos() {
        const container = document.getElementById('todosArtigos');
        const inicio = (this.paginaAtual - 1) * this.artigosPorPagina;
        const fim = inicio + this.artigosPorPagina;
        const artigosPagina = this.artigosFiltrados.slice(inicio, fim);

        // Estado vazio
        if (artigosPagina.length === 0) {
            container.innerHTML = '<p class="sem-artigos" style="text-align:center;padding:2rem;">Nenhum artigo encontrado.</p>';
            document.getElementById('paginacao').innerHTML = '';
            return;
        }

        // Renderizar cards
        container.innerHTML = artigosPagina.map(artigo => BlogUtils.criarCardArtigo(artigo)).join('');
        this.renderizarPaginacao();
    }

    // ==========================================
    // PAGINAÇÃO
    // ==========================================

    renderizarPaginacao() {
        const container = document.getElementById('paginacao');
        const totalPaginas = Math.ceil(this.artigosFiltrados.length / this.artigosPorPagina);

        if (totalPaginas <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<div class="paginacao-botoes">';

        // Botão anterior
        html += `<button class="pagina-btn" onclick="artigosManager.irParaPagina(${this.paginaAtual - 1})"
                       ${this.paginaAtual === 1 ? 'disabled' : ''}>←</button>`;

        // Números das páginas
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="pagina-btn ${i === this.paginaAtual ? 'active' : ''}"
                           onclick="artigosManager.irParaPagina(${i})">${i}</button>`;
        }

        // Botão próximo
        html += `<button class="pagina-btn" onclick="artigosManager.irParaPagina(${this.paginaAtual + 1})"
                       ${this.paginaAtual === totalPaginas ? 'disabled' : ''}>→</button>`;

        html += '</div>';
        container.innerHTML = html;
    }

    irParaPagina(pagina) {
        const totalPaginas = Math.ceil(this.artigosFiltrados.length / this.artigosPorPagina);
        if (pagina < 1 || pagina > totalPaginas) return;

        this.paginaAtual = pagina;
        this.renderizarArtigos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Inicialização
let artigosManager;
document.addEventListener('DOMContentLoaded', () => {
    artigosManager = new ArtigosManager();
});