/**
 * Sistema de Autenticação - BlogSocial
 * Gerencia login, sessão e permissões de usuários
 */
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.configurarFormularioLogin();
        this.protegerPaginaAdmin();
        this.exibirInfoUsuario();
    }

    // ==========================================
    // FORMULÁRIO DE LOGIN
    // ==========================================

    configurarFormularioLogin() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.realizarLogin();
        });
    }

    realizarLogin() {
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const mensagemErro = document.getElementById('mensagemErro');

        // Validação básica
        if (!email || !senha) {
            this.mostrarErro(mensagemErro, 'Preencha todos os campos.');
            return;
        }

        // Verificar se o banco de autores está disponível
        if (typeof autoresDB === 'undefined') {
            this.mostrarErro(mensagemErro, 'Erro no sistema. Recarregue a página.');
            console.error('autoresDB não está definido');
            return;
        }

        // Autenticar
        const autor = autoresDB.autenticarAutor(email, senha);

        if (autor) {
            this.criarSessao(autor);
            console.log('Login bem-sucedido: ' + autor.nome);
            window.location.href = 'admin.html';
        } else {
            this.mostrarErro(mensagemErro, 'E-mail ou senha incorretos.');
        }
    }

    mostrarErro(elemento, mensagem) {
        if (!elemento) return;
        elemento.textContent = mensagem;
        elemento.style.display = 'block';
        setTimeout(() => { elemento.style.display = 'none'; }, 5000);
    }

    criarSessao(autor) {
        sessionStorage.setItem('adminAutenticado', 'true');
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            id: autor.id,
            nome: autor.nome,
            email: autor.email,
            isMasterAdmin: autor.isMasterAdmin || false
        }));
    }

    // ==========================================
    // PROTEÇÃO DE PÁGINAS
    // ==========================================

    protegerPaginaAdmin() {
        if (this.isPaginaProtegida() && !sessionStorage.getItem('adminAutenticado')) {
            window.location.href = 'login.html';
        }
    }

    isPaginaProtegida() {
        return window.location.pathname.includes('admin.html');
    }

    // ==========================================
    // EXIBIÇÃO DO USUÁRIO LOGADO
    // ==========================================

    exibirInfoUsuario() {
        const container = document.getElementById('usuarioInfo');
        if (!container) return;

        const dados = sessionStorage.getItem('usuarioLogado');
        if (!dados) return;

        try {
            const usuario = JSON.parse(dados);
            if (typeof autoresDB !== 'undefined') {
                const autor = autoresDB.getAutorPorId(usuario.id);
                if (autor) {
                    container.innerHTML = `
                        <div class="usuario-logado-info">
                            <img src="${autor.foto}" alt="${autor.nome}" class="usuario-logado-foto"
                                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(autor.nome)}&size=40&background=6C5CE7&color=fff'">
                            <div>
                                <strong>${autor.nome}</strong>
                                <span class="usuario-logado-tag">${autor.isMasterAdmin ? '👑 Admin' : '✍️ Autor'}</span>
                            </div>
                        </div>
                    `;
                }
            }
        } catch (e) {
            console.error('Erro ao exibir informações do usuário:', e);
        }
    }

    // ==========================================
    // MÉTODOS ESTÁTICOS (ACESSO GLOBAL)
    // ==========================================

    static getUsuarioLogado() {
        const dados = sessionStorage.getItem('usuarioLogado');
        return dados ? JSON.parse(dados) : null;
    }

    static getNomeAutorLogado() {
        const usuario = this.getUsuarioLogado();
        if (usuario && typeof autoresDB !== 'undefined') {
            const autor = autoresDB.getAutorPorId(usuario.id);
            return autor ? autor.nome : null;
        }
        return null;
    }

    static isMasterAdmin() {
        const usuario = this.getUsuarioLogado();
        return usuario && usuario.isMasterAdmin === true;
    }

    static logout() {
        sessionStorage.removeItem('adminAutenticado');
        sessionStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});