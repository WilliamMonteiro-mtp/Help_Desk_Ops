# Design System e Tokens Visuais

## 1. Sistema de Cores e Temas
A aplicação baseia-se num visual moderno e técnico, oferecendo **Dark Mode** como pré-definido e altamente recomendado, com suporte a **Light Mode**. 

A paleta de cores deve ser definida através de variáveis CSS (CSS Variables) consumidas diretamente no `tailwind.config.ts`.

### Tokens Principais: Dark Mode (Default)
- **Fundo Principal (Background)**: Obsidian / Zinc 950 (`#09090b`) - O espaço negativo da janela.
- **Superfície de Cartões (Card/Surface)**: Zinc 900 (`#18181b`) - Painéis e contentores.
- **Bordas Sutis (Border)**: Zinc 800 (`#27272a`) - Divisórias discretas e contornos de cartões.

### Tokens Principais: Light Mode
- **Fundo Principal**: Slate 50 (`#f8fafc`).
- **Superfície de Cartões**: Branco puro (`#ffffff`).
- **Bordas Sutis**: Slate 200 (`#e2e8f0`).

### Acentos de Destaque (Comuns / Semantic Colors)
- **Primary / Informação**: Azul Ciano (`#06b6d4`) ou Azul Indigo (`#4f46e5`) dependendo do tom.
- **Sucesso / Status OK**: Emerald (`#10b981`) - Usado para health checks e conclusão de tarefas.
- **Aviso / Progresso**: Amber (`#f59e0b`) - Passos intermédios ou requerimentos antes de avançar.
- **Erro / Destrutivo**: Rose (`#f43f5e`) ou Red (`#ef4444`) - Comandos irreversíveis ou erros do sistema.

## 2. Taxonomia de Componentes Base

### Cartões de Funcionalidade (Cards)
Componente de base para a grelha do layout. Deve transmitir interatividade premium:
- **Background**: Efeito sutil de *glassmorphism* com `backdrop-blur` nas áreas translúcidas e uma base sólida na superfície do cartão.
- **Interação (Hover)**: Transformação de elevação e um gradiente suave acionado ao passar o rato (efeito border-glow).
- **Estrutura Interna**:
  - Topo esquerdo: **Ícone** (Lucide Icon) encapsulado num quadrado/círculo arredondado com fundo translúcido (ex: `bg-white/10`).
  - Meio: **Título** descritivo, tipografia semibold (peso 600) e **Descrição** curta e incisiva, numa cor mais apagada (ex: `text-zinc-400`).
  - Rodapé: Botão dedicado ("Executar" ou botão iconográfico de play) posicionado estrategicamente ao lado ou abaixo, para clara indicação de ação.

### Botões (Buttons)
Sistema de botões alinhado com o Shadcn UI:
- **Variantes**:
  - `primary`: Fundo sólido com a cor primária ou verde (sucesso) dependendo da intenção (texto invertido/escuro sobre a cor, se aplicável).
  - `secondary`: Fundo suave na cor da superfície + um offset (ex: `bg-zinc-800`).
  - `outline`: Borda aparente, fundo transparente.
  - `destructive`: Tons Rose/Red, normalmente requerem prompt de confirmação.
  - `ghost`: Transparente, revela a cor de fundo com `hover:bg-zinc-800`.
- **Estados Dinâmicos**: 
  - `disabled`: Opacidade a 50%, cursor não permitido.
  - `loading`: Incorpora um componente de `Spinner` SVG que substitui o ícone nativo e desativa interações adicionais no elemento pai.

### Terminal / Consola Integrada
Uma view especializada para ver output streaming bruto:
- **Base Visual**: Fundo escuro total ou cinzento escuro absoluto (ex: `#030712`).
- **Tipografia**: Font-family obrigatoriamente monoespaçada (`JetBrains Mono`, `Fira Code` ou `Consolas` como fallback).
- **Cores Sintáticas (ANSI Logs Parser)**:
  - Textos Base: Cinzento claro / branco opaco.
  - `Verde`: Logs de Sucesso ou outputs de sucesso de comando.
  - `Amarelo`: Info de progresso, alertas do sistema.
  - `Vermelho`: Linhas de `stderr`, erros críticos, e stacktraces.
  - `Ciano`: Tags de contexto, como `[INFO]` ou caminhos de ficheiros.
- **Ações UX Embutidas**: Botão flutuante para **"Copiar Logs"**, checkbox para habilitar/desabilitar o **"Auto-scroll Dinâmico"** (com fixação na bottom da div).
