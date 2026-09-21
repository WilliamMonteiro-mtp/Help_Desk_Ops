# Taxonomia de UI e Layout

A aplicação possui um layout de janela não-convencional (Custom Chrome), abolindo a barra de título clássica do Windows para proporcionar uma integração imersiva.

## 1. Estrutura Global

- **Topbar Customizada (Barra de Título)**:
  - Ocupa a faixa superior e deve conter a class/propriedade nativa do Tauri (`data-tauri-drag-region`) para permitir arrastar a janela.
  - Lado Esquerdo: Ícone da aplicação e Título.
  - Centro (ou junto ao título): Badge de Estado do Sidecar (ex: bolinha verde, com tooltip indicando "Backend Conectado").
  - Lado Direito: Ações de janela (Minimizar, Maximizar/Restaurar, Fechar) programadas para invocar a API de janela do Tauri (`appWindow.close()`), além do botão de toggle de Tema (Dark/Light mode).

- **Sidebar (Menu Retrátil ou Fixo)**:
  - Painel de navegação esquerdo, albergando ícones (Lucide Icons) representativos de cada grande domínio da aplicação.
  - Destaque claro para a rota/estado ativo.

- **Área de Conteúdo Principal (Router View)**:
  - Preenche o espaço restante (Flex 1). 
  - Utiliza CSS Grid para organizar os painéis e cartões das subpáginas. Um layout padrão seria: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` com `gap-4` ou `gap-6`.
  - As transições de rota devem ser fluidas.

## 2. Distribuição de Páginas e Rotas

A interface divide o catálogo de 36+ comandos através de categorias semânticas claras, facilitando o acesso ao utilizador de Suporte de TI:

### 2.1. Dashboard / Checkup Rápido
- **Métricas Globais**: Cartões em tempo real exibindo a utilização de CPU, Memória RAM instalada vs em uso, e Estado do Disco Principal (espaço livre vs total).
- **Ações Rápidas**: Cartão em destaque com botão **"Manutenção em Lote"**, que desencadeia, sequencialmente, ferramentas de baixo risco de limpeza (limpeza de cache DNS, temporários, etc).

### 2.2. Disco e Armazenamento
- Dedicado a comandos I/O e gestão de drives.
- Cartões: CHKDSK, Otimização de Disco (TRIM/Defrag), Limpeza de Ficheiros Temporários, e ferramentas intrusivas como a Limpeza de Imagem do Sistema via DISM.

### 2.3. Rede e Conectividade
- Foco absoluto na camada de rede.
- Cartões: Ferramentas de Ping/DNS lookup, Limpar Cache DNS, Reset à Pilha de Rede (Winsock), Firewall do Windows, Renovar IP, Netstat e Testar portas (Traceroute/Telnet port testing).

### 2.4. Integridade do Sistema
- Foco no núcleo do Windows.
- Cartões: SFC (System File Checker), Diagnóstico de Memória, Histórico da Bateria (Relatório Powercfg), Gestor de Tarefas e Gestor de Backups de Drivers.

### 2.5. Políticas e Utilizadores
- Foco em políticas de grupo e GPOs/Updates.
- Cartões: Update Group Policy (`gpupdate /force`), Ativar/Desativar Administrador Local Oculto, Windows Update e Reset aos serviços do Windows Update.

### 2.6. Consola / Logs Globais
- Uma View inteiramente dedicada ao componente de **Terminal** definido no Design System. 
- Permite observar em ecrã inteiro o historial detalhado da sessão ativa, sendo a última paragem para despiste complexo. Contém funcionalidades ricas de exportação para ficheiro JSON ou Texto simples.
