# Arquitetura do Sistema: HelpDesk Ops

## 1. Stack Tecnológica
- **Shell Desktop**: Tauri v2 (Rust) para gestão nativa da janela, empacotamento otimizado e elevação de privilégios (`requireAdministrator`).
- **Core de Execução (Sidecar Backend)**: Python 3.11+ utilizando FastAPI e Uvicorn.
- **Interface do Utilizador**: React 18/19, TypeScript (Strict Mode), Tailwind CSS, Lucide Icons e Radix UI / Shadcn UI patterns.
- **Comunicação**: O Tauri gere o ciclo de vida do processo sidecar Python. O frontend comunica via API REST (para ações síncronas/desencadear tarefas) e escuta eventos em tempo real via WebSockets/SSE (para logs de output contínuos).

## 2. Ciclo de Vida da Aplicação
1. **Início do Tauri**: O executável compilado em Rust é iniciado com permissões de Administrador.
2. **Arranque do Sidecar**: O processo Tauri faz spawn do processo filho Python (FastAPI/Uvicorn) numa porta definida (ex: localhost:8000).
3. **Healthcheck**: O Tauri e o frontend (ainda não revelado ou em ecrã de loading) aguardam que o endpoint `/health` da API Python retorne HTTP 200 OK.
4. **Abertura de Janelas**: Após a confirmação de que o sidecar está pronto, a Webview principal do Tauri é revelada e o render da interface React é iniciado.
5. **Encerramento Seguro**: Quando a janela principal é fechada, o processo Tauri interceta o evento e envia um sinal de terminação ao processo Python sidecar, garantindo que não ficam processos órfãos em background (Graceful Shutdown).

## 3. Comunicação Assíncrona com Subprocessos
- O backend Python é o motor de execução. Para executar comandos CMD ou PowerShell, deve recorrer a `asyncio.create_subprocess_shell` e não a chamadas de bloqueio como `subprocess.run` ou `os.system`.
- O event loop do FastAPI (via Uvicorn) **não deve ser bloqueado** por execuções que possam demorar (ex: SFC, CHKDSK).
- O stdout e stderr das tarefas devem ser lidos de forma assíncrona (`stdout.readline()`) e encaminhados de imediato, linha a linha, para o frontend através de WebSockets.
- O sidecar deve manter um registry/dicionário com as tarefas em curso, suportando funcionalidades de cancelamento (`Task.cancel()` e envio de sinal `SIGTERM`/`CTRL_C_EVENT` ao subprocesso do Windows).

## 4. Gestão de Privilégios Elevados (UAC) e Manifesto
- Toda a aplicação pressupõe direitos de Administrador Local, dado o perfil das ações suportadas (DISM, SFC, paragem de serviços, limpeza ao nível da system root).
- O executável do Tauri deve ser compilado com as tags necessárias no manifesto da aplicação Windows (através de crates específicos no `src-tauri` ou do ficheiro `app.manifest`):
  `<requestedExecutionLevel level="requireAdministrator" uiAccess="false" />`
- Não é necessária autenticação na API do sidecar FastAPI dado correr estritamente em `localhost` e ser instanciada dinamicamente pelo processo-pai confiável (Tauri).
