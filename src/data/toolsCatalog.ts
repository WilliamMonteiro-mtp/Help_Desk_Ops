export type RiskLevel = 'low' | 'medium' | 'high';
export type ToolCategory = 'system' | 'network' | 'disk' | 'advanced';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  command: string;
  risk: RiskLevel;
  category: ToolCategory;
  requiresRestart?: boolean;
}

export const TOOLS_CATALOG: ToolDefinition[] = [
  // Sistema
  { id: 'sfc_scan', name: 'SFC (System File Checker)', description: 'Verifica e repara ficheiros de sistema corrompidos', command: 'sfc /scannow', risk: 'medium', category: 'system' },
  { id: 'dism_restore', name: 'DISM Restore Health', description: 'Repara a imagem do sistema operativo', command: 'DISM /Online /Cleanup-Image /RestoreHealth', risk: 'medium', category: 'system' },
  { id: 'clean_temp', name: 'Limpar Arquivos Temporários', description: 'Limpa ficheiros temporários do utilizador', command: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue', risk: 'low', category: 'system' },
  { id: 'task_mgr', name: 'Gerenciador de Tarefas', description: 'Abre o gestor de tarefas clássico', command: 'taskmgr.exe', risk: 'low', category: 'system' },
  { id: 'sys_info', name: 'Informações do Sistema', description: 'Abre o painel de diagnóstico do sistema (msinfo32)', command: 'msinfo32.exe', risk: 'low', category: 'system' },
  { id: 'windows_update_ui', name: 'Windows Update', description: 'Abre a página do Windows Update', command: 'control.exe /name Microsoft.WindowsUpdate', risk: 'low', category: 'system' },
  { id: 'reset_wu', name: 'Reset do Windows Update', description: 'Reinicia serviços e limpa cache de atualizações', command: 'net stop wuauserv; net stop bits; Remove-Item -Path "$env:windir\\SoftwareDistribution\\Download\\*" -Recurse -Force; net start wuauserv; net start bits', risk: 'high', category: 'system' },
  { id: 'restore_point', name: 'Criar Ponto de Restauração', description: 'Cria um novo ponto de restauro do sistema', command: 'Checkpoint-Computer -Description "HelpDesk-Ops-Checkpoint" -RestorePointType "MODIFY_SETTINGS"', risk: 'low', category: 'system' },
  { id: 'winget_upgrade', name: 'Atualizar Programas (Winget)', description: 'Atualiza todos os pacotes instalados via Winget', command: 'winget upgrade --all --accept-source-agreements --accept-package-agreements', risk: 'low', category: 'system' },
  { id: 'sync_time', name: 'Sincronizar Hora', description: 'Força a sincronização do relógio do sistema', command: 'w32tm /resync', risk: 'low', category: 'system' },
  { id: 'spooler_clean', name: 'Limpar Spooler de Impressão', description: 'Reinicia o serviço de impressão e limpa fila', command: 'net stop spooler; Remove-Item -Path "$env:SystemRoot\\System32\\spool\\PRINTERS\\*" -Force; net start spooler', risk: 'medium', category: 'system' },
  { id: 'mem_diag', name: 'Diagnóstico de Memória', description: 'Agenda verificação de RAM no próximo arranque', command: 'mdsched.exe', risk: 'high', category: 'system', requiresRestart: true },
  { id: 'event_viewer', name: 'Logs de Eventos', description: 'Abre o visualizador de eventos do Windows', command: 'eventvwr.msc', risk: 'low', category: 'system' },
  
  // Rede
  { id: 'ping_dns_test', name: 'Teste de Rede (Ping + DNS)', description: 'Verifica conetividade externa e resolução DNS', command: 'Test-NetConnection -ComputerName 8.8.8.8; Resolve-DnsName google.com', risk: 'low', category: 'network' },
  { id: 'flush_dns', name: 'Limpar Cache DNS', description: 'Limpa a cache do resolver DNS', command: 'ipconfig /flushdns', risk: 'low', category: 'network' },
  { id: 'reset_network_stack', name: 'Reset da Pilha de Rede', description: 'Repara TCP/IP e Winsock', command: 'netsh winsock reset; netsh int ip reset', risk: 'high', category: 'network', requiresRestart: true },
  { id: 'renew_ip', name: 'Renovar IP e Cache ARP', description: 'Pede novo endereço IP ao DHCP', command: 'ipconfig /release; ipconfig /renew; arp -d *', risk: 'medium', category: 'network' },
  { id: 'flush_register_dns', name: 'Flush + Re-register DNS', description: 'Limpa e regista novamente as definições DNS', command: 'ipconfig /flushdns; ipconfig /registerdns', risk: 'low', category: 'network' },
  { id: 'ipconfig_all', name: 'IPConfig Detalhado', description: 'Mostra configuração de todos os adaptadores', command: 'ipconfig /all', risk: 'low', category: 'network' },
  { id: 'active_connections', name: 'Conexões Ativas (Netstat)', description: 'Lista ligações de rede e portos abertos', command: 'netstat -ano', risk: 'low', category: 'network' },
  { id: 'firewall_gui', name: 'Firewall do Windows', description: 'Abre a consola avançada da Firewall', command: 'wf.msc', risk: 'low', category: 'network' },
  { id: 'test_common_ports', name: 'Testar Portas Comuns', description: 'Testa DNS (53) e HTTPS (443)', command: 'Test-NetConnection -ComputerName 1.1.1.1 -Port 53; Test-NetConnection -ComputerName 1.1.1.1 -Port 443', risk: 'low', category: 'network' },
  
  // Disco
  { id: 'chkdsk_scan', name: 'Verificar / Agendar CHKDSK', description: 'Procura e repara setores danificados', command: 'chkdsk C: /f /r', risk: 'high', category: 'disk', requiresRestart: true },
  { id: 'optimize_drive', name: 'Otimizar Disco (TRIM / Defrag)', description: 'Otimiza SSDs e desfragmenta HDDs', command: 'Optimize-Volume -DriveLetter C -Defrag -Verbose', risk: 'medium', category: 'disk' },
  { id: 'winsat_disk', name: 'Teste de Velocidade de Disco', description: 'Avalia a performance da drive de sistema', command: 'winsat disk -drive c', risk: 'low', category: 'disk' },
  
  // Avançado
  { id: 'gpupdate_force', name: 'Forçar Políticas de Grupo', description: 'Aplica imediatamente as GPOs', command: 'gpupdate /force', risk: 'medium', category: 'advanced' },
  { id: 'enable_admin', name: 'Ativar Administrador Local', description: 'Ativa a conta oculta de Administrador', command: 'net user Administrator /active:yes', risk: 'high', category: 'advanced' },
  { id: 'show_hidden_devices', name: 'Drivers Ocultos / Desconectados', description: 'Abre o gestor de dispositivos com fantasmas visíveis', command: 'cmd.exe /c "set DEVMGR_SHOW_NONPRESENT_DEVICES=1 && start devmgmt.msc"', risk: 'low', category: 'advanced' },
  { id: 'backup_drivers', name: 'Backup de Drivers (Export)', description: 'Exporta todos os drivers terceiros', command: 'New-Item -ItemType Directory -Force -Path C:\\DriversBackup; pnputil /export-driver * C:\\DriversBackup', risk: 'low', category: 'advanced' },
  { id: 'battery_report', name: 'Relatório de Bateria', description: 'Gera relatório de degradação da bateria no Desktop', command: 'powercfg /batteryreport /output "$env:USERPROFILE\\Desktop\\battery-report.html"', risk: 'low', category: 'advanced' },
  { id: 'hibernate_toggle', name: 'Desativar Hibernação', description: 'Desliga o hibernate e liberta espaço', command: 'powercfg -h off', risk: 'medium', category: 'advanced' }
];
