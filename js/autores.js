/**
 * Banco de Dados de Autores - BlogSocial
 * Gerencia credenciais e informações dos autores do blog
 */
const autoresDB = {
    // Dados iniciais dos autores
    autores: [
        {
            id: 1,
            nome: "Maria Silva",
            email: "maria.silva@blogsocial.com",
            senha: "maria123",
            foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            bio: "Educadora e pesquisadora em tecnologias sustentáveis há mais de 15 anos. Mestre em Energias Renováveis pela USP, Maria dedica-se a popularizar a ciência e tornar acessível o conhecimento sobre sustentabilidade. Autora de 3 livros sobre o tema, já palestrou em mais de 20 países.",
            especialidade: "Tecnologia e Sustentabilidade",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-01-10"
        },
        {
            id: 2,
            nome: "João Santos",
            email: "joao.santos@blogsocial.com",
            senha: "joao123",
            foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            bio: "Cientista social e ativista comunitário com 12 anos de experiência em projetos de impacto social. Fundador do Instituto Comunitário Nova Era, João já impactou mais de 50 mil pessoas através de iniciativas de educação e desenvolvimento local. Prêmio Nacional de Direitos Humanos 2023.",
            especialidade: "Impacto Social e Comunidade",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-01-15"
        },
        {
            id: 3,
            nome: "Ana Costa",
            email: "ana.costa@blogsocial.com",
            senha: "ana123",
            foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            bio: "Especialista em Inteligência Artificial e Inovação Digital. Doutora em Ciência da Computação pela UNICAMP, Ana trabalha na interseção entre tecnologia e sociedade. Colunista em importantes revistas de tecnologia e consultora de grandes empresas para transformação digital.",
            especialidade: "Inovação e Tecnologia Digital",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-01-20"
        },
        {
            id: 4,
            nome: "Pedro Oliveira",
            email: "pedro.oliveira@blogsocial.com",
            senha: "pedro123",
            foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
            bio: "Pedagogo e designer educacional apaixonado por metodologias inovadoras de ensino. Com mestrado em Educação pela UFMG, Pedro desenvolve projetos que unem tecnologia e pedagogia. Já capacitou mais de 2.000 professores em novas metodologias de ensino.",
            especialidade: "Educação e Métodos de Aprendizado",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-02-01"
        },
        {
            id: 5,
            nome: "Lucia Ferreira",
            email: "lucia.ferreira@blogsocial.com",
            senha: "lucia123",
            foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
            bio: "Psicóloga clínica e pesquisadora em saúde mental. Doutora em Psicologia pela UFRJ, Lucia é referência nacional em bem-estar emocional e qualidade de vida. Mantém um canal no YouTube com mais de 500 mil seguidores onde aborda temas de saúde mental de forma acessível.",
            especialidade: "Saúde Mental e Bem-Estar",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-02-10"
        },
        {
            id: 6,
            nome: "Carlos Mendes",
            email: "carlos.mendes@blogsocial.com",
            senha: "carlos123",
            foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            bio: "Urbanista e ambientalista com foco em cidades inteligentes e sustentáveis. Formado em Arquitetura e Urbanismo pela UFSC, Carlos coordena projetos de revitalização urbana em 5 capitais brasileiras. Membro do Conselho Nacional de Desenvolvimento Urbano Sustentável.",
            especialidade: "Sustentabilidade Urbana",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-02-15"
        },
        {
            id: 99,
            nome: "Administrador Master",
            email: "admin@blogsocial.com",
            senha: "admin123",
            foto: "https://ui-avatars.com/api/?name=Admin+Master&size=150&background=6C5CE7&color=fff&bold=true",
            bio: "Administrador principal do BlogSocial. Responsável pela gestão de conteúdo, autores e configurações do sistema.",
            especialidade: "Administração do Sistema",
            redes: { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: "2024-01-01",
            isMasterAdmin: true
        }
    ],

    dadosPadrao: null,

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    init() {
        if (!this.dadosPadrao) {
            this.dadosPadrao = JSON.parse(JSON.stringify(this.autores));
        }
        this.carregarDados();
        console.log('👥 AutoresDB: ' + this.autores.length + ' autores carregados');
    },

    // ==========================================
    // CONSULTAS
    // ==========================================

    getTodosAutores() {
        this.carregarDados();
        return [...this.autores].sort((a, b) => a.nome.localeCompare(b.nome));
    },

    getAutoresAtivos() {
        return this.getTodosAutores().filter(a => a.ativo && !a.isMasterAdmin);
    },

    getAutorPorId(id) {
        this.carregarDados();
        return this.autores.find(a => a.id === parseInt(id));
    },

    getAutorPorEmail(email) {
        this.carregarDados();
        return this.autores.find(a => a.email.toLowerCase() === email.toLowerCase() && a.ativo);
    },

    getAutorPorNome(nome) {
        this.carregarDados();
        return this.autores.find(a => a.nome.toLowerCase() === nome.toLowerCase());
    },

    // ==========================================
    // AUTENTICAÇÃO
    // ==========================================

    autenticarAutor(email, senha) {
        const autor = this.getAutorPorEmail(email);
        if (autor && autor.senha === senha) {
            console.log('✅ Autenticado: ' + autor.nome);
            return autor;
        }
        console.log('❌ Falha na autenticação: ' + email);
        return null;
    },

    // ==========================================
    // CRUD
    // ==========================================

    adicionarAutor(dados) {
        this.carregarDados();

        if (this.getAutorPorEmail(dados.email)) {
            throw new Error('Este e-mail já está cadastrado.');
        }

        const novo = {
            id: this.autores.length > 0 ? Math.max(...this.autores.map(a => a.id)) + 1 : 1,
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            foto: dados.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(dados.nome) + '&size=150&background=6C5CE7&color=fff&bold=true',
            bio: dados.bio || dados.nome + ' é colaborador(a) do BlogSocial.',
            especialidade: dados.especialidade || 'Colaborador BlogSocial',
            redes: dados.redes || { twitter: "#", linkedin: "#", site: "#" },
            ativo: true,
            dataCadastro: new Date().toISOString().split('T')[0],
            isMasterAdmin: false
        };

        this.autores.push(novo);
        this.salvarDados();
        console.log('✅ Autor cadastrado: ' + novo.nome);
        return novo;
    },

    removerAutor(id) {
        this.carregarDados();
        const autor = this.getAutorPorId(id);
        if (!autor) return false;
        if (autor.isMasterAdmin) {
            console.warn('Não é permitido remover o Admin Master');
            return false;
        }

        this.autores = this.autores.filter(a => a.id !== id);
        this.salvarDados();
        console.log('Autor removido: ' + autor.nome);
        return true;
    },

    // ==========================================
    // PERSISTÊNCIA (localStorage)
    // ==========================================

    salvarDados() {
        try {
            localStorage.setItem('autoresDB', JSON.stringify(this.autores));
        } catch (e) {
            console.error('Erro ao salvar autores:', e);
        }
    },

    carregarDados() {
        try {
            const dados = localStorage.getItem('autoresDB');
            if (dados) {
                const parsed = JSON.parse(dados);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.autores = parsed;
                    return;
                }
            }
            // Fallback para dados padrão
            if (this.dadosPadrao) {
                this.autores = JSON.parse(JSON.stringify(this.dadosPadrao));
            }
        } catch (e) {
            console.error('Erro ao carregar autores:', e);
            if (this.dadosPadrao) {
                this.autores = JSON.parse(JSON.stringify(this.dadosPadrao));
            }
        }
    }
};

autoresDB.init();