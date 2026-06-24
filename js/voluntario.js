/**
 * Sistema de Voluntariado - BlogSocial
 * Gerencia formulário de cadastro com validação de telefone brasileiro
 */
class VoluntarioManager {
    constructor() {
        this.form = null;
        this.telefoneInput = null;
        this.feedbackTelefone = null;
        this.btnSubmit = null;
        this.telefoneValido = false;
        this.modalOverlay = null;
        this.init();
    }

    init() {
        this.carregarElementos();
        if (!this.form || !this.telefoneInput) return;

        this.criarModal();
        this.configurarEventos();
        this.logInstrucoes();
    }

    // ==========================================
    // ELEMENTOS DOM
    // ==========================================

    carregarElementos() {
        this.form = document.getElementById('formVoluntario');
        this.telefoneInput = document.getElementById('telefone');
        this.feedbackTelefone = document.getElementById('feedbackTelefone');
        this.btnSubmit = document.getElementById('btnSubmit');
    }

    // ==========================================
    // MODAL DE CONFIRMAÇÃO
    // ==========================================

    criarModal() {
        const existente = document.getElementById('modalSucesso');
        if (existente) existente.remove();

        this.modalOverlay = document.createElement('div');
        this.modalOverlay.id = 'modalSucesso';
        this.modalOverlay.className = 'modal-overlay';
        this.modalOverlay.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2>✅ Cadastro Realizado!</h2>
                    <button class="modal-close-btn" id="modalCloseBtn" title="Fechar">✕</button>
                </div>
                <div class="modal-body">
                    <div class="modal-icon">🎉</div>
                    <h3 id="modalTitulo">Obrigado por se cadastrar!</h3>
                    <p id="modalMensagem">Entraremos em contato em breve.</p>
                    <div class="modal-info" id="modalInfo"></div>
                    <button class="modal-confirm-btn" id="modalConfirmBtn">Entendido</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modalOverlay);
        this.configurarModalEvents();
    }

    configurarModalEvents() {
        document.getElementById('modalCloseBtn')?.addEventListener('click', () => this.fecharModal());
        document.getElementById('modalConfirmBtn')?.addEventListener('click', () => this.fecharModal());

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.fecharModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('visivel')) {
                this.fecharModal();
            }
        });
    }

    mostrarModal(voluntario) {
        document.getElementById('modalTitulo').textContent = `Obrigado, ${voluntario.nome.split(' ')[0]}!`;
        document.getElementById('modalMensagem').textContent = 'Seu cadastro foi realizado com sucesso. Entraremos em contato em breve!';
        document.getElementById('modalInfo').innerHTML = `
            <div class="modal-info-item">
                <span class="modal-info-icon">👤</span>
                <span><strong>Nome:</strong> ${voluntario.nome}</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-icon">📧</span>
                <span><strong>E-mail:</strong> ${voluntario.email}</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-icon">📱</span>
                <span><strong>Telefone:</strong> ${voluntario.telefoneFormatado}</span>
            </div>
        `;
        this.modalOverlay.classList.add('visivel');
        document.body.style.overflow = 'hidden';
    }

    fecharModal() {
        this.modalOverlay.classList.remove('visivel');
        document.body.style.overflow = '';
    }

    // ==========================================
    // EVENTOS DO FORMULÁRIO
    // ==========================================

    configurarEventos() {
        this.telefoneInput.addEventListener('input', (e) => this.handleTelefoneInput(e));
        this.telefoneInput.addEventListener('keypress', (e) => this.handleTelefoneKeypress(e));
        this.telefoneInput.addEventListener('paste', (e) => this.handleTelefonePaste(e));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // ==========================================
    // FORMATAÇÃO DE TELEFONE
    // ==========================================

    extrairNumeros(valor) {
        return valor.replace(/\D/g, '');
    }

    formatarTelefone(valor) {
        let numeros = this.extrairNumeros(valor);
        numeros = numeros.substring(0, 11);

        if (numeros.length === 0) return '';
        if (numeros.length <= 2) return `(${numeros}`;
        if (numeros.length <= 6) return `(${numeros.substring(0, 2)}) ${numeros.substring(2)}`;
        if (numeros.length <= 10) return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}`;
        return `(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7)}`;
    }

    calcularPosicaoCursor(valorAntigo, valorNovo, cursorPosAntigo) {
        const numerosAntigos = this.extrairNumeros(valorAntigo);
        if (numerosAntigos.length === 0) return valorNovo.length;

        let caracteresFormatacaoAntes = 0;
        for (let i = 0; i < cursorPosAntigo && i < valorAntigo.length; i++) {
            if (/\D/.test(valorAntigo[i])) caracteresFormatacaoAntes++;
        }

        const posicaoNumeros = cursorPosAntigo - caracteresFormatacaoAntes;
        let posicaoAtual = 0;
        let numerosContados = 0;

        for (let i = 0; i < valorNovo.length; i++) {
            if (/\d/.test(valorNovo[i])) {
                if (numerosContados >= posicaoNumeros) break;
                numerosContados++;
            }
            posicaoAtual = i + 1;
        }

        return numerosContados < posicaoNumeros ? valorNovo.length : posicaoAtual;
    }

    handleTelefoneInput(e) {
        const valorAntigo = e.target.value;
        const cursorPosAntigo = e.target.selectionStart;
        const numeros = this.extrairNumeros(valorAntigo);
        const valorFormatado = this.formatarTelefone(numeros);

        e.target.value = valorFormatado;
        const novaPosicao = this.calcularPosicaoCursor(valorAntigo, valorFormatado, cursorPosAntigo);
        e.target.setSelectionRange(novaPosicao, novaPosicao);
        this.atualizarFeedback(valorFormatado);
    }

    handleTelefoneKeypress(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
        if (teclasPermitidas.includes(e.key)) return;
        if (!/\d/.test(e.key)) e.preventDefault();
    }

    handleTelefonePaste(e) {
        e.preventDefault();
        const textoCopiado = (e.clipboardData || window.clipboardData).getData('text');
        const numerosColados = this.extrairNumeros(textoCopiado);
        if (numerosColados.length === 0) return;

        const cursorPos = this.telefoneInput.selectionStart;
        const valorAtual = this.telefoneInput.value;
        const numerosAntes = this.extrairNumeros(valorAtual.substring(0, cursorPos));
        const numerosDepois = this.extrairNumeros(valorAtual.substring(cursorPos));
        const novosNumeros = numerosAntes + numerosColados + numerosDepois;
        const valorFormatado = this.formatarTelefone(novosNumeros);

        this.telefoneInput.value = valorFormatado;
        const posicaoCursor = this.calcularPosicaoCursorAposColagem(valorFormatado, numerosAntes.length + numerosColados.length);
        this.telefoneInput.setSelectionRange(posicaoCursor, posicaoCursor);
        this.atualizarFeedback(valorFormatado);
    }

    calcularPosicaoCursorAposColagem(valorFormatado, posicaoNumeros) {
        let contadorNumeros = 0;
        for (let i = 0; i < valorFormatado.length; i++) {
            if (/\d/.test(valorFormatado[i])) {
                if (contadorNumeros >= posicaoNumeros) return i;
                contadorNumeros++;
            }
        }
        return valorFormatado.length;
    }

    // ==========================================
    // VALIDAÇÃO
    // ==========================================

    validarTelefone(numeroLimpo) {
        if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
            return { valido: false, mensagem: `Telefone deve ter 10 ou 11 dígitos. Faltam ${Math.max(0, 10 - numeroLimpo.length)} dígitos.`, tipo: 'erro' };
        }

        const ddd = parseInt(numeroLimpo.substring(0, 2));
        if (ddd < 11 || ddd > 99) {
            return { valido: false, mensagem: 'DDD inválido. Use um código de área entre 11 e 99.', tipo: 'erro' };
        }

        // Telefone fixo (10 dígitos)
        if (numeroLimpo.length === 10) {
            if (numeroLimpo[2] === '9') {
                return { valido: false, mensagem: 'Número fixo não deve começar com 9.', tipo: 'erro' };
            }
            return {
                valido: true, mensagem: '✅ Telefone fixo válido', tipo: 'sucesso',
                formatado: `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 6)}-${numeroLimpo.substring(6)}`,
                tipoTelefone: 'fixo'
            };
        }

        // Celular (11 dígitos)
        if (numeroLimpo[2] !== '9') {
            return { valido: false, mensagem: 'Celular deve começar com 9 após o DDD.', tipo: 'erro' };
        }
        return {
            valido: true, mensagem: '✅ Celular válido', tipo: 'sucesso',
            formatado: `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 3)} ${numeroLimpo.substring(3, 7)}-${numeroLimpo.substring(7)}`,
            tipoTelefone: 'celular'
        };
    }

    atualizarFeedback(valorFormatado) {
        const numerosLimpos = this.extrairNumeros(valorFormatado);
        this.telefoneInput.classList.remove('valido', 'invalido');
        this.feedbackTelefone.className = 'feedback-telefone';

        if (numerosLimpos.length === 0) {
            this.feedbackTelefone.textContent = '';
            this.telefoneValido = false;
        } else if (numerosLimpos.length < 10) {
            const faltam = 10 - numerosLimpos.length;
            this.feedbackTelefone.textContent = `⚠️ Digite mais ${faltam} dígito${faltam > 1 ? 's' : ''}`;
            this.feedbackTelefone.className = 'feedback-telefone erro';
            this.telefoneInput.classList.add('invalido');
            this.telefoneValido = false;
        } else {
            const validacao = this.validarTelefone(numerosLimpos);
            if (validacao.valido) {
                this.feedbackTelefone.textContent = `${validacao.mensagem} - ${validacao.tipoTelefone}`;
                this.feedbackTelefone.className = 'feedback-telefone sucesso';
                this.telefoneInput.classList.add('valido');
                this.telefoneValido = true;
            } else {
                this.feedbackTelefone.textContent = `❌ ${validacao.mensagem}`;
                this.feedbackTelefone.className = 'feedback-telefone erro';
                this.telefoneInput.classList.add('invalido');
                this.telefoneValido = false;
            }
        }
    }

    validarNome(nome) {
        if (!nome || nome.length < 3) { alert('Nome completo (mínimo 3 caracteres).'); return false; }
        if (nome.split(' ').length < 2) { alert('Insira nome e sobrenome.'); return false; }
        return true;
    }

    validarEmail(email) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('E-mail válido.'); return false; }
        return true;
    }

    // ==========================================
    // SUBMISSÃO
    // ==========================================

    handleSubmit(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefoneFormatado = this.telefoneInput.value;
        const telefoneNumeros = this.extrairNumeros(telefoneFormatado);

        if (!this.validarNome(nome)) return;
        if (!this.validarEmail(email)) return;

        const validacaoTel = this.validarTelefone(telefoneNumeros);
        if (!validacaoTel.valido) {
            alert('Telefone inválido.\n\n' + validacaoTel.mensagem);
            this.telefoneInput.focus();
            return;
        }

        const voluntario = {
            id: Date.now(),
            nome, email,
            telefone: telefoneNumeros,
            telefoneFormatado: validacaoTel.formatado,
            tipoTelefone: validacaoTel.tipoTelefone,
            dataRegistro: new Date().toISOString(),
            status: 'novo'
        };

        this.salvarVoluntario(voluntario);
        this.mostrarModal(voluntario);
        this.resetarFormulario();
    }

    salvarVoluntario(voluntario) {
        console.group('🌟 Novo Voluntário Registrado');
        console.log('📋 Dados:', voluntario);
        console.log('📱 Telefone:', voluntario.telefoneFormatado);

        const voluntarios = JSON.parse(localStorage.getItem('voluntarios') || '[]');
        voluntarios.push(voluntario);
        localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

        console.log(`📊 Total: ${voluntarios.length} voluntários`);
        console.log('💾 Salvo no localStorage');
        console.groupEnd();
    }

    resetarFormulario() {
        this.form.reset();
        this.telefoneInput.classList.remove('valido', 'invalido');
        this.feedbackTelefone.textContent = '';
        this.feedbackTelefone.className = 'feedback-telefone';
        this.telefoneValido = false;
    }

    logInstrucoes() {
        console.log('📱 Voluntariado - BlogSocial');
        console.log('📋 Formatos: Celular (11 dígitos) | Fixo (10 dígitos)');
        console.log('💡 Digite apenas números');
        console.log('✅ Pronto!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.voluntarioManager = new VoluntarioManager();
});