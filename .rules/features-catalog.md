# Catálogo de Comandos Técnicos e Funcionalidades

Este documento mapeia todas as funcionalidades que o Sidecar FastAPI/Python deve exportar via API ou WebSockets. O frontend usará esta taxonomia para invocar cada ação com precisão. O atributo "Risco" exige modais de confirmação na interface para níveis "Alto".

## Comandos Suportados (36 Funcionalidades)

| ID | Nome da Funcionalidade (Card) | Comando Shell Exato (PowerShell ou CMD) | Nível de Risco | Reboot Req. | Ícone Recomendado (Lucide) |
|---|---|---|---|---|---|
| 1 | CHKDSK (Corrigir Erros) | `chkdsk C: /f /r` | Alto | Sim | `HardDrive` |
| 2 | SFC (System File Checker) | `sfc /scannow` | Médio | Não | `ShieldCheck` |
| 3 | Limpeza Temp | `Remove-Item -Path $env:TEMP\* -Recurse -Force` | Baixo | Não | `Trash2` |
| 4 | Diagnóstico Memória | `mdsched.exe` | Médio | Sim | `Cpu` |
| 5 | Ping + DNS | `ping 8.8.8.8; nslookup google.com` | Baixo | Não | `Activity` |
| 6 | Gestor Tarefas | `taskmgr.exe` | Baixo | Não | `Monitor` |
| 7 | Windows Update UI | `control update` | Baixo | Não | `RefreshCw` |
| 8 | Info Sistema | `systeminfo` | Baixo | Não | `Info` |
| 9 | Limpar Cache DNS | `ipconfig /flushdns` | Baixo | Não | `Globe` |
| 10 | Reset Pilha de Rede | `netsh winsock reset; netsh int ip reset` | Médio | Sim | `Network` |
| 11 | Otimizar Disco | `Optimize-Volume -DriveLetter C -ReTrim -Defrag` | Baixo | Não | `Database` |
| 12 | Firewall Windows | `wf.msc` | Baixo | Não | `Shield` |
| 13 | Logs de Eventos | `eventvwr.msc` | Baixo | Não | `FileText` |
| 14 | WinSAT | `winsat formal` | Baixo | Não | `Zap` |
| 15 | Ponto de Restauração | `Checkpoint-Computer -Description "HelpDeskOps" -RestorePointType "MODIFY_SETTINGS"` | Baixo | Não | `History` |
| 16 | Winget Upgrade | `winget upgrade --all --include-unknown` | Médio | Não | `Package` |
| 17 | gpupdate /force | `gpupdate /force` | Baixo | Não | `Users` |
| 18 | Ativar Admin Local | `net user Administrador /active:yes` | Alto | Não | `UserCheck` |
| 19 | Drivers Ocultos | `set devmgr_show_nonpresent_devices=1 & devmgmt.msc` | Baixo | Não | `Eye` |
| 20 | Testar Comunicação na Rede | `tracert 8.8.8.8` | Baixo | Não | `Route` |
| 21 | IPConfig Detalhado | `ipconfig /all` | Baixo | Não | `List` |
| 22 | Testar Portas Comuns | `Test-NetConnection -Port 443 -ComputerName google.com` | Baixo | Não | `Plug` |
| 23 | Renovar IP / Cache ARP | `ipconfig /release; ipconfig /renew; arp -d *` | Médio | Não | `RefreshCcw` |
| 24 | Reset Windows Update | *(Script de Múltiplas Linhas: Parar serviços wuauserv/bits, limpar dir, e recomeçar)* | Médio | Não | `Settings` |
| 25 | Spooler Impressão | `Restart-Service -Name Spooler -Force` | Baixo | Não | `Printer` |
| 26 | Flush + Re-register DNS | `ipconfig /flushdns; ipconfig /registerdns` | Baixo | Não | `Wifi` |
| 27 | Conexões Ativas (netstat) | `netstat -ano` | Baixo | Não | `Activity` |
| 28 | Backup de Drivers | `Export-WindowsDriver -Online -Destination C:\DriversBackup` | Baixo | Não | `Save` |
| 29 | Sincronizar Hora | `w32tm /resync /force` | Baixo | Não | `Clock` |
| 30 | Sair / Fechar | `taskkill /F /IM HelpDeskOps.exe` (Ou preferencialmente API nativa do Tauri via AppWindow.close) | Baixo | Não | `PowerOff` |
| 31 | Reparação Imagem (DISM) | `dism /online /cleanup-image /restorehealth` | Médio | Não | `Wrench` |
| 32 | Teste de Bateria e Energia | `powercfg /batteryreport /output "C:\battery_report.html"` | Baixo | Não | `Battery` |
| 33 | Reconstrução Índice Pesquisa | *(Remoção do registo e reinicialização do serviço WSearch - Requer script específico Python)* | Médio | Não | `Search` |
| 34 | Relatório de Diagnóstico | *(Função Python que reúne dados de rede, cpu, disco e formata num JSON ou Markdown)* | Baixo | Não | `FileCheck` |
| 35 | Desativar/Ativar Hibernação | `powercfg -h off` (ou alternar para `on`) | Baixo | Não | `Moon` |
| 36 | Listagem Programas Arranque | `Get-CimInstance Win32_StartupCommand` | Baixo | Não | `Play` |

## Notas de Implementação no Backend
- Comandos baseados em `powershell` devem ser invocados utilizando a flag `-Command` ou `-c`, por exemplo: `powershell -NoProfile -ExecutionPolicy Bypass -Command "SEU COMANDO"`.
- O Sidecar Python deve capturar não apenas o `stdout`, mas também o `stderr` em fluxos independentes, mapeando os retornos com o código de saída (`exit_code`) do processo original.
