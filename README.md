# HelpDesk Ops

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Plataforma](https://img.shields.io/badge/Plataforma-Windows-blue)

Um utilitário de suporte técnico avançado para Windows com interface nativa, desenvolvido para colmatar a fragmentação das ferramentas do sistema (como SFC, CHKDSK, Diagnósticos de Rede) através de um painel unificado, rápido e seguro.

## 🚀 Funcionalidades

- **Catálogo Unificado (30+ Ferramentas):** Acesso rápido a comandos de sistema, rede, disco e ferramentas avançadas.
- **Elevação UAC Nativa:** A interface é executada com privilégios de Administrador, garantindo que nenhum comando crítico falha por falta de permissões.
- **Segurança e Allowlist Estrita:** Todos os comandos estão mapeados num dicionário rigoroso no backend. O utilizador tem ainda de confirmar num *modal* a execução de ferramentas de alto risco.
- **Console Integrada em Tempo Real:** Comunicação via WebSockets permite acompanhar o "output" (stdout/stderr) dos comandos em tempo real, sem congelar a interface.
- **Design Premium (Dark Mode):** Construído com Tailwind CSS e React, oferecendo uma experiência moderna, pesquisa rápida e navegação por abas.

## 🛠️ Arquitetura e Stack

A aplicação adota uma arquitetura de processos separados (Sidecar Pattern):

- **Shell / Janela Nativa:** [Tauri v2 (Rust)](https://v2.tauri.app/) — Responsável pelo empacotamento, manifesto `requireAdministrator` e janela transparente.
- **Backend / Process Executor:** Python 3.11+ ([FastAPI](https://fastapi.tiangolo.com/)) — Funciona como "sidecar" para orquestração assíncrona dos comandos no Windows e streaming via WebSockets.
- **Frontend / Interface:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/) (empacotado via Vite).

## ⚙️ Como Executar em Desenvolvimento

Pré-requisitos:
- Node.js (v18+)
- Python (3.11+)
- Rust (Cargo)

1. **Iniciar o Backend (Sidecar):**
   Abra um terminal e execute o FastAPI na pasta `sidecar`.
   ```powershell
   cd sidecar
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```
   *(O servidor ficará a escutar no porto 8123).*

2. **Iniciar o Frontend / Tauri:**
   Num **novo terminal aberto como Administrador** (obrigatório para compilar e correr o manifesto sem o erro 740), instale as dependências e inicie:
   ```powershell
   npm install
   npm run tauri dev
   ```

A janela maximizada do HelpDesk Ops irá aparecer ligada ao backend.

## 📝 Licença
Projeto pessoal desenvolvido para otimização de fluxos de HelpDesk.
