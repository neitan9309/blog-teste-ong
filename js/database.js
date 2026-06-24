/**
 * Banco de Dados de Artigos - BlogSocial
 * Gerencia o armazenamento e recuperação de artigos
 */
const artigosDB = {
    // Dados iniciais dos artigos
    artigos: [
        {
            id: 1,
            titulo: "Tecnologia Sustentável: O Futuro da Energia Limpa",
            palavrasChave: ["tecnologia", "sustentabilidade", "energia", "renovável", "futuro"],
            imagem: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
            conteudo: `
                <h2>O Futuro da Energia Limpa</h2>
                <p>A tecnologia sustentável está revolucionando a forma como produzimos e consumimos energia. 
                Com o avanço das energias renováveis, estamos cada vez mais próximos de um futuro livre de combustíveis fósseis.</p>
                <p>Painéis solares mais eficientes, turbinas eólicas inovadoras e sistemas de armazenamento de energia 
                estão transformando o setor energético global.</p>
                <h3>Principais Avanços:</h3>
                <ul>
                    <li>Baterias de estado sólido com maior capacidade</li>
                    <li>Células solares de perovskite</li>
                    <li>Hidrogênio verde como combustível</li>
                </ul>
            `,
            dataPublicacao: "2024-01-15",
            autor: "Maria Silva"
        },
        {
            id: 2,
            titulo: "Impacto Social: Como Pequenas Ações Transformam Comunidades",
            palavrasChave: ["social", "comunidade", "voluntariado", "impacto", "transformação"],
            imagem: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
            conteudo: `
                <h2>Transformando Comunidades Através de Pequenas Ações</h2>
                <p>O impacto social começa com pequenas iniciativas que, quando somadas, geram grandes transformações. 
                Cada ação voluntária contribui para um mundo mais justo e solidário.</p>
                <p>Projetos comunitários de educação, saúde e sustentabilidade têm mostrado resultados impressionantes 
                em diversas regiões do país.</p>
                <h3>Como Participar:</h3>
                <ul>
                    <li>Identifique necessidades locais</li>
                    <li>Forme grupos de ação</li>
                    <li>Estabeleça parcerias</li>
                </ul>
            `,
            dataPublicacao: "2024-01-20",
            autor: "João Santos"
        },
        {
            id: 3,
            titulo: "Inovação Digital: Inteligência Artificial no Cotidiano",
            palavrasChave: ["tecnologia", "IA", "inovação", "digital", "futuro"],
            imagem: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
            conteudo: `
                <h2>IA no Nosso Dia a Dia</h2>
                <p>A inteligência artificial já faz parte de nossas vidas de maneiras que muitas vezes nem percebemos. 
                Desde assistentes virtuais até sistemas de recomendação, a IA está transformando nossa rotina.</p>
                <p>Com o avanço do machine learning e processamento de linguagem natural, as possibilidades 
                são cada vez mais amplas e acessíveis.</p>
            `,
            dataPublicacao: "2024-02-01",
            autor: "Ana Costa"
        },
        {
            id: 4,
            titulo: "Educação Transformadora: Novos Métodos de Aprendizado",
            palavrasChave: ["educação", "aprendizado", "métodos", "inovação", "ensino"],
            imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
            conteudo: `
                <h2>Revolucionando a Educação</h2>
                <p>Novos métodos de ensino estão surgindo para atender às demandas do século XXI. 
                Aprendizagem baseada em projetos, ensino híbrido e gamificação são algumas das abordagens 
                que estão transformando a educação.</p>
            `,
            dataPublicacao: "2024-02-10",
            autor: "Pedro Oliveira"
        },
        {
            id: 5,
            titulo: "Saúde Mental: A Importância do Bem-Estar Emocional",
            palavrasChave: ["saúde", "mental", "bem-estar", "emocional", "psicologia"],
            imagem: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
            conteudo: `
                <h2>Cuidando da Mente</h2>
                <p>A saúde mental é tão importante quanto a saúde física. Em um mundo cada vez mais acelerado, 
                dedicar tempo ao autocuidado emocional se torna essencial para uma vida equilibrada.</p>
            `,
            dataPublicacao: "2024-02-15",
            autor: "Lucia Ferreira"
        },
        {
            id: 6,
            titulo: "Sustentabilidade Urbana: Cidades do Futuro",
            palavrasChave: ["sustentabilidade", "urbano", "cidades", "futuro", "meio ambiente"],
            imagem: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            conteudo: `
                <h2>Construindo Cidades Inteligentes</h2>
                <p>As cidades do futuro precisam ser sustentáveis, inteligentes e inclusivas. 
                Tecnologias verdes, mobilidade urbana eficiente e planejamento participativo são fundamentais 
                para criar espaços urbanos melhores.</p>
            `,
            dataPublicacao: "2024-03-01",
            autor: "Carlos Mendes"
        }
    ],

    dadosPadrao: null,

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    init() {
        if (!this.dadosPadrao) {
            this.dadosPadrao = JSON.parse(JSON.stringify(this.artigos));
        }
        this.carregarDados();
        console.log('🗄️ Database inicializado com', this.artigos.length, 'artigos');
        console.log('📅 Data atual (local):', this.obterDataAtual());
    },

    // ==========================================
    // UTILITÁRIOS DE DATA (FUSO LOCAL)
    // ==========================================

    obterDataAtual() {
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    },

    obterDataHoraAtual() {
        const agora = new Date();
        const offset = agora.getTimezoneOffset();
        const dataLocal = new Date(agora.getTime() - (offset * 60 * 1000));
        return dataLocal.toISOString().replace('Z', this.obterOffsetFormatado(offset));
    },

    obterOffsetFormatado(offset) {
        const horas = Math.abs(Math.floor(offset / 60));
        const minutos = Math.abs(offset % 60);
        const sinal = offset <= 0 ? '+' : '-';
        return `${sinal}${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    },

    // ==========================================
    // CONSULTAS
    // ==========================================

    getArtigosRecentes(quantidade = 3) {
        this.carregarDados();
        return [...this.artigos]
            .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
            .slice(0, quantidade);
    },

    getTodosArtigos() {
        this.carregarDados();
        return [...this.artigos]
            .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
    },

    getArtigoPorId(id) {
        this.carregarDados();
        return this.artigos.find(artigo => artigo.id === parseInt(id));
    },

    // ==========================================
    // CRUD
    // ==========================================

    adicionarArtigo(artigo) {
        this.carregarDados();

        artigo.id = this.artigos.length > 0
            ? Math.max(...this.artigos.map(a => a.id)) + 1
            : 1;
        artigo.dataPublicacao = this.obterDataAtual();
        artigo.dataHoraPublicacao = this.obterDataHoraAtual();

        this.artigos.push(artigo);
        this.salvarDados();

        console.log('✅ Artigo adicionado:');
        console.log('   📌 Título:', artigo.titulo);
        console.log('   📅 Data de publicação:', artigo.dataPublicacao);
        console.log('   🕐 Data/hora completa:', artigo.dataHoraPublicacao);
        console.log('   📊 Total de artigos:', this.artigos.length);

        return artigo;
    },

    removerArtigo(id) {
        this.carregarDados();
        const index = this.artigos.findIndex(artigo => artigo.id === id);
        if (index !== -1) {
            const removido = this.artigos[index];
            this.artigos.splice(index, 1);
            this.salvarDados();
            console.log('🗑️ Artigo removido:', removido.titulo);
            console.log('📊 Total restante:', this.artigos.length);
            return true;
        }
        return false;
    },

    // ==========================================
    // PERSISTÊNCIA (localStorage)
    // ==========================================

    salvarDados() {
        try {
            const dados = JSON.stringify(this.artigos);
            localStorage.setItem('artigosDB', dados);
            console.log('💾 Dados salvos no localStorage:', this.artigos.length, 'artigos');

            const verificado = localStorage.getItem('artigosDB');
            if (!verificado) {
                console.error('❌ Falha ao verificar dados salvos!');
            } else {
                const tamanho = new Blob([verificado]).size;
                console.log('   📦 Tamanho:', (tamanho / 1024).toFixed(2), 'KB');
            }
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
            if (error.name === 'QuotaExceededError') {
                console.error('   ⚠️ Armazenamento local cheio!');
            }
        }
    },

    carregarDados() {
        try {
            const dados = localStorage.getItem('artigosDB');
            if (dados) {
                const parsed = JSON.parse(dados);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    this.artigos = parsed;
                    console.log('📂 Dados carregados do localStorage:', this.artigos.length, 'artigos');
                    return;
                }
            }
            console.warn('⚠️ Dados do localStorage vazios ou inválidos, usando dados padrão');
            this.restaurarDadosPadrao();
        } catch (error) {
            console.error('❌ Erro ao carregar do localStorage:', error);
            this.restaurarDadosPadrao();
        }
    },

    restaurarDadosPadrao() {
        if (this.dadosPadrao) {
            this.artigos = JSON.parse(JSON.stringify(this.dadosPadrao));
            console.log('🔄 Dados padrão restaurados');
        }
    },

    // ==========================================
    // DEBUG
    // ==========================================

    mostrarEstado() {
        console.group('📊 Estado do Database');
        console.log('📚 Artigos em memória:', this.artigos.length);
        console.log('💾 Artigos no localStorage:', JSON.parse(localStorage.getItem('artigosDB') || '[]').length);
        console.log('📅 Data atual local:', this.obterDataAtual());
        console.log('📋 Lista de artigos:');
        console.table(this.artigos.map(a => ({
            ID: a.id,
            Título: a.titulo.substring(0, 40),
            Data: a.dataPublicacao,
            Autor: a.autor
        })));
        console.groupEnd();
    }
};

// Inicialização
artigosDB.init();

// Informações de debug no console
console.log('🕐 Fuso horário local:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('📅 Data local:', artigosDB.obterDataAtual());
console.log('🕐 Data/hora local:', new Date().toLocaleString('pt-BR'));