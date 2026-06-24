/**
 * Painel Administrativo - BlogSocial
 */
var AdminManager = function() {
    this.imagemBase64 = null;
    this.abaAtiva = 'publicar';
    this.isMaster = false;
    this.usuarioLogado = null;
    this.autorDados = null;
    this.modalOverlay = null;
    this.autorEmEdicao = null;
    this.init();
};

AdminManager.prototype.init = function() {
    this.verificarAutenticacao();
    this.verificarPermissao();
    this.carregarDadosUsuario();
    this.criarModal();
    this.setupForms();
    this.setupPreviewImagem();
    this.setupAbas();
    this.setupUserMenu();
    this.preencherAutorLogado();
    this.renderizarListaArtigos();
    this.renderizarConteudoAutores();
    this.exibirInfoUsuario();
    this.atualizarTextoAbas();
    console.log('Admin Manager inicializado - Master:', this.isMaster);
};

AdminManager.prototype.verificarAutenticacao = function() {
    if (!sessionStorage.getItem('adminAutenticado')) {
        window.location.href = 'login.html';
    }
};

AdminManager.prototype.verificarPermissao = function() {
    this.isMaster = AuthManager.isMasterAdmin();
    this.usuarioLogado = AuthManager.getUsuarioLogado();
};

AdminManager.prototype.carregarDadosUsuario = function() {
    if (this.usuarioLogado && typeof autoresDB !== 'undefined') {
        autoresDB.carregarDados();
        this.autorDados = autoresDB.getAutorPorId(this.usuarioLogado.id);
    }
};

AdminManager.prototype.atualizarTextoAbas = function() {
    var aba = document.getElementById('abaAutoresBtn');
    if (aba) aba.textContent = this.isMaster ? '👥 Gerenciar Autores' : '👤 Minha Conta';
};

// ==========================================
// MODAL
// ==========================================

AdminManager.prototype.criarModal = function() {
    var existente = document.getElementById('modalAdmin');
    if (existente) existente.remove();

    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = 'modalAdmin';
    this.modalOverlay.className = 'modal-overlay-admin';
    this.modalOverlay.innerHTML = '<div class="modal-container-admin">' +
        '<div class="modal-header-admin"><h2 id="modalAdminTitulo">✅ Sucesso!</h2><button class="modal-close-btn-admin" id="modalAdminCloseBtn">✕</button></div>' +
        '<div class="modal-body-admin"><div class="modal-icon-admin" id="modalAdminIcon">🎉</div><h3 id="modalAdminSubtitulo">Operação realizada!</h3><p id="modalAdminMensagem"></p><div class="modal-info-admin" id="modalAdminInfo"></div><button class="modal-confirm-btn-admin" id="modalAdminConfirmBtn">Entendido</button></div>' +
    '</div>';
    document.body.appendChild(this.modalOverlay);

    var self = this;
    document.getElementById('modalAdminCloseBtn').addEventListener('click', function() { self.fecharModal(); });
    document.getElementById('modalAdminConfirmBtn').addEventListener('click', function() { self.fecharModal(); });
    this.modalOverlay.addEventListener('click', function(e) { if (e.target === self.modalOverlay) self.fecharModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && self.modalOverlay.classList.contains('visivel')) self.fecharModal(); });
};

AdminManager.prototype.mostrarModal = function(titulo, subtitulo, mensagem, icone, info) {
    document.getElementById('modalAdminTitulo').textContent = titulo;
    document.getElementById('modalAdminSubtitulo').textContent = subtitulo;
    document.getElementById('modalAdminMensagem').textContent = mensagem;
    document.getElementById('modalAdminIcon').textContent = icone || '🎉';
    document.getElementById('modalAdminInfo').innerHTML = info || '';
    this.modalOverlay.classList.add('visivel');
    document.body.style.overflow = 'hidden';
};

AdminManager.prototype.fecharModal = function() {
    this.modalOverlay.classList.remove('visivel');
    document.body.style.overflow = '';
};

// ==========================================
// MENU MOBILE
// ==========================================

AdminManager.prototype.setupUserMenu = function() {
    var menuBtn = document.getElementById('adminUserMenuBtn');
    var dropdown = document.getElementById('adminUserDropdown');
    var arrow = document.getElementById('adminUserMenuArrow');
    if (!menuBtn || !dropdown) return;

    if (this.autorDados) {
        document.getElementById('adminUserMenuAvatar').src = this.autorDados.foto;
        document.getElementById('adminUserMenuName').textContent = this.autorDados.nome.split(' ')[0];
        document.getElementById('adminDropdownAvatar').src = this.autorDados.foto;
        document.getElementById('adminDropdownName').textContent = this.autorDados.nome;
        document.getElementById('adminDropdownTag').textContent = this.isMaster ? '👑 Admin Master' : '✍️ Autor';
    }

    menuBtn.onclick = function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('visible');
        arrow.classList.toggle('open');
    };

    document.addEventListener('click', function(e) {
        if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('visible');
            arrow.classList.remove('open');
        }
    });
};

// ==========================================
// ABAS
// ==========================================

AdminManager.prototype.setupAbas = function() {
    var self = this;
    document.querySelectorAll('.admin-aba').forEach(function(aba) {
        aba.addEventListener('click', function() {
            self.trocarAba(this.getAttribute('data-aba'));
        });
    });
};

AdminManager.prototype.trocarAba = function(aba) {
    this.abaAtiva = aba;
    document.querySelectorAll('.admin-aba').forEach(function(a) {
        a.classList.toggle('ativa', a.getAttribute('data-aba') === aba);
    });

    document.getElementById('aba-publicar').style.display = 'none';
    document.getElementById('aba-autores-master').style.display = 'none';
    document.getElementById('aba-minha-conta').style.display = 'none';

    if (aba === 'publicar') {
        document.getElementById('aba-publicar').style.display = 'block';
    } else if (aba === 'autores') {
        if (this.isMaster) {
            document.getElementById('aba-autores-master').style.display = 'block';
            this.renderizarListaAutores();
        } else {
            document.getElementById('aba-minha-conta').style.display = 'block';
        }
    }
};

AdminManager.prototype.renderizarConteudoAutores = function() {
    document.getElementById('aba-autores-master').style.display = 'none';
    document.getElementById('aba-minha-conta').style.display = 'none';
};

// ==========================================
// FORMULÁRIOS
// ==========================================

AdminManager.prototype.setupForms = function() {
    var self = this;

    var formArtigo = document.getElementById('formArtigo');
    if (formArtigo) formArtigo.addEventListener('submit', function(e) { e.preventDefault(); self.publicarArtigo(); });

    var formAutor = document.getElementById('formAutor');
    if (formAutor) formAutor.addEventListener('submit', function(e) { e.preventDefault(); self.cadastrarAutor(); });

    var formMinhaConta = document.getElementById('formMinhaConta');
    if (formMinhaConta) {
        if (this.autorDados) {
            document.getElementById('minhaContaNome').value = this.autorDados.nome || '';
            document.getElementById('minhaContaEmail').value = this.autorDados.email || '';
            document.getElementById('minhaContaEspecialidade').value = this.autorDados.especialidade || '';
            document.getElementById('minhaContaBio').value = this.autorDados.bio || '';
        }
        formMinhaConta.addEventListener('submit', function(e) { e.preventDefault(); self.atualizarMinhaConta(); });
    }
};

AdminManager.prototype.setupPreviewImagem = function() {
    var self = this;
    var input = document.getElementById('imagemArquivo');
    if (input) input.addEventListener('change', function(e) { if (e.target.files && e.target.files[0]) self.processarImagem(e.target.files[0]); });
};

AdminManager.prototype.preencherAutorLogado = function() {
    var input = document.getElementById('autor');
    if (!input) return;
    var nome = AuthManager.getNomeAutorLogado();
    if (nome) {
        input.value = nome;
        input.readOnly = true;
        input.style.background = '#f0f0ff';
        input.style.cursor = 'default';
    }
};

AdminManager.prototype.exibirInfoUsuario = function() {
    var container = document.getElementById('usuarioInfo');
    if (!container || !this.autorDados) return;
    container.innerHTML = '<div class="usuario-logado-info">' +
        '<img src="' + this.autorDados.foto + '" alt="' + this.autorDados.nome + '" class="usuario-logado-foto" onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.autorDados.nome) + '&size=40&background=6C5CE7&color=fff\'">' +
        '<div><strong>' + this.autorDados.nome + '</strong><span class="usuario-logado-tag">' + (this.isMaster ? '👑 Admin' : '✍️ Autor') + '</span></div></div>';
};

AdminManager.prototype.processarImagem = function(arquivo) {
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(arquivo.type)) { alert('Formato não suportado.'); return; }
    if (arquivo.size > 5 * 1024 * 1024) { alert('Máximo 5MB.'); return; }
    var self = this;
    var reader = new FileReader();
    reader.onload = function(e) {
        self.imagemBase64 = e.target.result;
        var preview = document.getElementById('previewImagem');
        if (preview) { preview.innerHTML = '<img src="' + self.imagemBase64 + '" alt="Preview"><small style="display:block;text-align:center;padding:0.5rem;color:#666;">✅ Imagem carregada</small>'; preview.style.display = 'block'; }
    };
    reader.readAsDataURL(arquivo);
};

// ==========================================
// ARTIGOS (filtrado por autor para não-master)
// ==========================================

AdminManager.prototype.publicarArtigo = function() {
    var titulo = document.getElementById('titulo').value.trim();
    var autor = document.getElementById('autor').value.trim();
    var palavrasChave = document.getElementById('palavrasChave').value.split(',').map(function(k) { return k.trim(); }).filter(function(k) { return k; });
    var conteudo = document.getElementById('conteudo').value.trim();
    var tipoImagem = document.getElementById('tipoImagem').value;
    var imagemUrl = document.getElementById('imagemUrl');

    if (!titulo || !autor || !palavrasChave.length || !conteudo) { alert('Preencha todos os campos.'); return; }

    var imagem = '';
    if (tipoImagem === 'url') {
        imagem = imagemUrl ? imagemUrl.value.trim() : '';
        if (!imagem) imagem = 'https://via.placeholder.com/800x400?text=Sem+imagem';
    } else {
        if (!this.imagemBase64) { alert('Selecione uma imagem.'); return; }
        imagem = this.imagemBase64;
    }

    try {
        var publicado = artigosDB.adicionarArtigo({ titulo: titulo, autor: autor, palavrasChave: palavrasChave, conteudo: conteudo, imagem: imagem });
        this.mostrarModal('✅ Artigo Publicado!', 'Sucesso', 'Seu artigo já está disponível.', '📰',
            '<div class="modal-info-item-admin"><span>📌</span><span><strong>Título:</strong> ' + publicado.titulo + '</span></div>' +
            '<div class="modal-info-item-admin"><span>👤</span><span><strong>Autor:</strong> ' + publicado.autor + '</span></div>' +
            '<div class="modal-info-item-admin"><span>📅</span><span><strong>Data:</strong> ' + new Date(publicado.dataPublicacao + 'T12:00:00').toLocaleDateString('pt-BR') + '</span></div>');
        this.limparFormularioArtigo();
        this.renderizarListaArtigos();
    } catch (e) { alert('Erro: ' + e.message); }
};

AdminManager.prototype.excluirArtigo = function(id) {
    var artigo = artigosDB.getArtigoPorId(id);
    if (!artigo) return;
    var nomeAutorLogado = AuthManager.getNomeAutorLogado();
    if (!this.isMaster && artigo.autor !== nomeAutorLogado) { this.mostrarModal('🔒 Acesso Negado', '', 'Você só pode excluir seus próprios artigos.', '🔒'); return; }
    if (confirm('Excluir "' + artigo.titulo + '"?')) { artigosDB.removerArtigo(id); this.mostrarModal('🗑️ Artigo Excluído', '', 'Removido.', '🗑️'); this.renderizarListaArtigos(); }
};

AdminManager.prototype.limparFormularioArtigo = function() {
    var form = document.getElementById('formArtigo');
    if (form) { form.reset(); this.preencherAutorLogado(); }
    var preview = document.getElementById('previewImagem');
    if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
    this.imagemBase64 = null;
    document.getElementById('tipoImagem').value = 'url';
    document.getElementById('grupoImagemUrl').style.display = 'block';
    document.getElementById('grupoImagemArquivo').style.display = 'none';
};

AdminManager.prototype.renderizarListaArtigos = function() {
    var container = document.getElementById('artigosExistentes');
    if (!container) return;
    artigosDB.carregarDados();
    var todosArtigos = artigosDB.getTodosArtigos();
    var nomeAutorLogado = AuthManager.getNomeAutorLogado();
    var self = this;

    var artigos = this.isMaster ? todosArtigos : todosArtigos.filter(function(a) {
        return a.autor === nomeAutorLogado;
    });

    if (!artigos.length) {
        container.innerHTML = '<div class="sem-dados"><p>📭 Nenhum artigo encontrado.</p>' + (!this.isMaster ? '<p style="font-size:0.9rem;color:#999;">Você verá apenas seus próprios artigos.</p>' : '') + '</div>';
        return;
    }

    container.innerHTML = artigos.map(function(a) {
        var podeExcluir = self.isMaster || a.autor === nomeAutorLogado;
        return '<div class="admin-item">' +
            '<div class="admin-item-info">' +
                '<h3>' + a.titulo + '</h3>' +
                '<div class="admin-item-meta"><span>👤 ' + a.autor + '</span><span>📅 ' + new Date(a.dataPublicacao + 'T12:00:00').toLocaleDateString('pt-BR') + '</span><span>🆔 ' + a.id + '</span></div>' +
                '<div class="palavras-chave">' + a.palavrasChave.map(function(k) { return '<span class="keyword-tag">' + k + '</span>'; }).join('') + '</div>' +
            '</div>' +
            (podeExcluir ? '<button class="btn-excluir" onclick="adminManager.excluirArtigo(' + a.id + ')">🗑️</button>' : '') +
        '</div>';
    }).join('');
};

// ==========================================
// GERENCIAR AUTORES (MASTER) - COM EDIÇÃO
// ==========================================

AdminManager.prototype.cadastrarAutor = function() {
    if (this.autorEmEdicao) {
        this.salvarEdicaoAutor();
        return;
    }

    var nome = document.getElementById('autorNome').value.trim();
    var email = document.getElementById('autorEmail').value.trim();
    var senha = document.getElementById('autorSenha').value.trim();
    var especialidade = document.getElementById('autorEspecialidade').value.trim();
    var bio = document.getElementById('autorBio').value.trim();
    var fotoInput = document.getElementById('autorFoto');

    if (!nome || !email || !senha || senha.length < 4) { alert('Preencha todos os campos. Senha: mín 4 caracteres.'); return; }
    if (autoresDB.getAutorPorEmail(email)) { alert('E-mail já cadastrado.'); return; }

    var dados = { nome: nome, email: email, senha: senha, especialidade: especialidade, bio: bio };
    var self = this;

    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) { dados.foto = e.target.result; self.finalizarCadastroAutor(dados); };
        reader.readAsDataURL(fotoInput.files[0]);
    } else { this.finalizarCadastroAutor(dados); }
};

AdminManager.prototype.finalizarCadastroAutor = function(dados) {
    try {
        var novo = autoresDB.adicionarAutor(dados);
        this.mostrarModal('✅ Autor Cadastrado!', 'Sucesso', novo.nome + ' já pode fazer login.', '👤',
            '<div class="modal-info-item-admin"><span>📧</span><span><strong>E-mail:</strong> ' + novo.email + '</span></div>');
        document.getElementById('formAutor').reset();
        this.autorEmEdicao = null;
        this.resetFormAutor();
        this.renderizarListaAutores();
    } catch (e) { alert('Erro: ' + e.message); }
};

AdminManager.prototype.editarAutor = function(id) {
    var autor = autoresDB.getAutorPorId(id);
    if (!autor || autor.isMasterAdmin) return;

    this.autorEmEdicao = autor;

    document.getElementById('autorNome').value = autor.nome;
    document.getElementById('autorEmail').value = autor.email;
    document.getElementById('autorSenha').value = '';
    document.getElementById('autorSenha').placeholder = 'Deixe em branco para manter';
    document.getElementById('autorSenha').required = false;
    document.getElementById('autorEspecialidade').value = autor.especialidade || '';
    document.getElementById('autorBio').value = autor.bio || '';

    var btn = document.querySelector('#formAutor .btn-publicar');
    if (btn) btn.textContent = '💾 Salvar Alterações';

    var formAutor = document.getElementById('formAutor');
    var cancelBtn = document.getElementById('cancelarEdicaoBtn');
    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancelarEdicaoBtn';
        cancelBtn.type = 'button';
        cancelBtn.textContent = '❌ Cancelar';
        cancelBtn.style.cssText = 'background:#6c757d;color:white;border:none;padding:0.8rem 2rem;border-radius:50px;font-size:1rem;cursor:pointer;width:100%;margin-top:0.5rem;';
        cancelBtn.onclick = function() { adminManager.cancelarEdicao(); };
        formAutor.appendChild(cancelBtn);
    }

    formAutor.scrollIntoView({ behavior: 'smooth' });
    formAutor.style.border = '2px solid var(--primary-color)';
    formAutor.style.boxShadow = '0 0 20px rgba(108, 92, 231, 0.3)';
};

AdminManager.prototype.salvarEdicaoAutor = function() {
    if (!this.autorEmEdicao) return;

    var nome = document.getElementById('autorNome').value.trim();
    var email = document.getElementById('autorEmail').value.trim();
    var senha = document.getElementById('autorSenha').value.trim();
    var especialidade = document.getElementById('autorEspecialidade').value.trim();
    var bio = document.getElementById('autorBio').value.trim();
    var fotoInput = document.getElementById('autorFoto');

    if (!nome || !email) { alert('Nome e e-mail são obrigatórios.'); return; }

    var emailExistente = autoresDB.getAutorPorEmail(email);
    if (emailExistente && emailExistente.id !== this.autorEmEdicao.id) {
        alert('Este e-mail já está em uso.'); return;
    }

    var nomeAntigo = this.autorEmEdicao.nome;
    var self = this;

    var finalizar = function() {
        self.autorEmEdicao.nome = nome;
        self.autorEmEdicao.email = email;
        if (senha && senha.length >= 4) self.autorEmEdicao.senha = senha;
        self.autorEmEdicao.especialidade = especialidade;
        self.autorEmEdicao.bio = bio;

        var idx = autoresDB.autores.findIndex(function(a) { return a.id === self.autorEmEdicao.id; });
        if (idx !== -1) { autoresDB.autores[idx] = self.autorEmEdicao; autoresDB.salvarDados(); }

        if (nomeAntigo !== nome) {
            artigosDB.carregarDados();
            artigosDB.artigos.forEach(function(a) { if (a.autor === nomeAntigo) a.autor = nome; });
            artigosDB.salvarDados();
        }

        self.mostrarModal('✅ Autor Atualizado!', 'Sucesso', 'Dados de ' + nome + ' foram salvos.', '👤');
        self.cancelarEdicao();
        document.getElementById('formAutor').reset();
        self.renderizarListaAutores();
    };

    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) { self.autorEmEdicao.foto = e.target.result; finalizar(); };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        finalizar();
    }
};

AdminManager.prototype.cancelarEdicao = function() {
    this.autorEmEdicao = null;
    this.resetFormAutor();
};

AdminManager.prototype.resetFormAutor = function() {
    var form = document.getElementById('formAutor');
    if (form) {
        form.reset();
        form.style.border = '';
        form.style.boxShadow = '';
    }

    var senhaInput = document.getElementById('autorSenha');
    if (senhaInput) {
        senhaInput.placeholder = 'Senha';
        senhaInput.required = true;
    }

    var btn = document.querySelector('#formAutor .btn-publicar');
    if (btn) btn.textContent = '✅ Cadastrar Autor';

    var cancelBtn = document.getElementById('cancelarEdicaoBtn');
    if (cancelBtn) cancelBtn.remove();
};

AdminManager.prototype.excluirAutor = function(id) {
    if (!this.isMaster) { this.mostrarModal('🔒 Acesso Negado', '', 'Apenas Admin Master.', '🔒'); return; }
    var autor = autoresDB.getAutorPorId(id);
    if (!autor || autor.isMasterAdmin) return;
    if (confirm('Remover "' + autor.nome + '" permanentemente?')) {
        autoresDB.removerAutor(id);
        this.mostrarModal('🗑️ Autor Removido', '', 'Artigos preservados.', '🗑️');
        this.renderizarListaAutores();
    }
};

AdminManager.prototype.renderizarListaAutores = function() {
    var container = document.getElementById('autoresExistentes');
    if (!container || typeof autoresDB === 'undefined') return;
    autoresDB.carregarDados();
    var autores = autoresDB.getTodosAutores();
    var self = this;

    if (!autores.length) {
        container.innerHTML = '<div class="sem-dados"><p>📭 Nenhum autor cadastrado.</p></div>';
        return;
    }

    container.innerHTML = autores.map(function(a) {
        var botoesHtml = '';
        if (!a.isMasterAdmin) {
            botoesHtml = '<div class="admin-item-actions">' +
                '<button class="btn-editar" onclick="adminManager.editarAutor(' + a.id + ')">✏️ Editar</button>' +
                '<button class="btn-excluir" onclick="adminManager.excluirAutor(' + a.id + ')">🗑️</button>' +
                '</div>';
        } else {
            botoesHtml = '<span style="color:#6C5CE7;font-weight:600;white-space:nowrap;">👑 Master</span>';
        }

        return '<div class="admin-item">' +
            '<div class="admin-item-autor-info">' +
                '<img src="' + a.foto + '" alt="' + a.nome + '" class="admin-item-avatar" onerror="this.src=\'https://ui-avatars.com/api/?name=' + encodeURIComponent(a.nome) + '&size=45&background=6C5CE7&color=fff\'">' +
                '<div class="admin-item-info">' +
                    '<h3>' + a.nome + ' ' + (a.isMasterAdmin ? '👑' : '') + '</h3>' +
                    '<p style="font-size:0.85rem;color:#666;margin:0;">' + a.email + ' | ' + (a.especialidade || 'Sem especialidade') + '</p>' +
                '</div>' +
            '</div>' +
            botoesHtml +
        '</div>';
    }).join('');
};

// ==========================================
// MINHA CONTA (AUTOR)
// ==========================================

AdminManager.prototype.atualizarMinhaConta = function() {
    if (!this.autorDados) { alert('Dados não encontrados.'); return; }
    var nomeAntigo = this.autorDados.nome;
    var nome = document.getElementById('minhaContaNome').value.trim();
    var email = document.getElementById('minhaContaEmail').value.trim();
    var senha = document.getElementById('minhaContaSenha').value.trim();
    var especialidade = document.getElementById('minhaContaEspecialidade').value.trim();
    var bio = document.getElementById('minhaContaBio').value.trim();
    var fotoInput = document.getElementById('minhaContaFoto');

    if (!nome || !email) { alert('Nome e e-mail são obrigatórios.'); return; }

    var self = this;
    var salvar = function() {
        self.autorDados.nome = nome;
        self.autorDados.email = email;
        if (senha && senha.length >= 4) self.autorDados.senha = senha;
        self.autorDados.especialidade = especialidade;
        self.autorDados.bio = bio;

        var idx = autoresDB.autores.findIndex(function(a) { return a.id === self.autorDados.id; });
        if (idx !== -1) { autoresDB.autores[idx] = self.autorDados; autoresDB.salvarDados(); }

        if (nomeAntigo !== nome) {
            artigosDB.carregarDados();
            artigosDB.artigos.forEach(function(a) { if (a.autor === nomeAntigo) a.autor = nome; });
            artigosDB.salvarDados();
        }
        sessionStorage.setItem('usuarioLogado', JSON.stringify({ id: self.autorDados.id, nome: nome, email: email, isMasterAdmin: self.autorDados.isMasterAdmin || false }));
        self.carregarDadosUsuario();
        self.exibirInfoUsuario();
        self.setupUserMenu();
        self.preencherAutorLogado();
        self.renderizarListaArtigos();
        self.mostrarModal('✅ Conta Atualizada!', 'Sucesso', 'Dados salvos.', '👤');
    };

    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) { self.autorDados.foto = e.target.result; salvar(); };
        reader.readAsDataURL(fotoInput.files[0]);
    } else { salvar(); }
};

// ==========================================
// FUNÇÕES GLOBAIS
// ==========================================

function toggleTipoImagem() {
    var tipo = document.getElementById('tipoImagem').value;
    document.getElementById('grupoImagemUrl').style.display = tipo === 'url' ? 'block' : 'none';
    document.getElementById('grupoImagemArquivo').style.display = tipo === 'arquivo' ? 'block' : 'none';
    var preview = document.getElementById('previewImagem');
    if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
}

var adminManager;
document.addEventListener('DOMContentLoaded', function() {
    if (typeof artigosDB === 'undefined') { console.error('artigosDB não carregado'); return; }
    adminManager = new AdminManager();
});