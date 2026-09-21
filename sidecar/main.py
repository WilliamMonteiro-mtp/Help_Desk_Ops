import asyncio
import ctypes
import json
import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
import uvicorn
from pydantic import BaseModel
from typing import Dict, List, Optional

app = FastAPI(title="HelpDesk Ops - Sidecar")

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sidecar")

# Validação de UAC
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except:
        return False

# Allowlist (Catálogo de Funcionalidades)
ALLOWLIST = {
    "sfc_scan": {"name": "SFC (System File Checker)", "command": "sfc /scannow", "risk": "medium"},
    "dism_restore": {"name": "DISM Restore Health", "command": "DISM /Online /Cleanup-Image /RestoreHealth", "risk": "medium"},
    "clean_temp": {"name": "Limpar Arquivos Temporários", "command": 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue', "risk": "low"},
    "task_mgr": {"name": "Gerenciador de Tarefas", "command": "taskmgr.exe", "risk": "low"},
    "sys_info": {"name": "Informações do Sistema", "command": "msinfo32.exe", "risk": "low"},
    "windows_update_ui": {"name": "Windows Update", "command": "control.exe /name Microsoft.WindowsUpdate", "risk": "low"},
    "reset_wu": {"name": "Reset do Windows Update", "command": 'net stop wuauserv; net stop bits; Remove-Item -Path "$env:windir\\SoftwareDistribution\\Download\\*" -Recurse -Force; net start wuauserv; net start bits', "risk": "high"},
    "restore_point": {"name": "Criar Ponto de Restauração", "command": 'Checkpoint-Computer -Description "HelpDesk-Ops-Checkpoint" -RestorePointType "MODIFY_SETTINGS"', "risk": "low"},
    "winget_upgrade": {"name": "Atualizar Programas (Winget)", "command": "winget upgrade --all --accept-source-agreements --accept-package-agreements", "risk": "low"},
    "sync_time": {"name": "Sincronizar Hora", "command": "w32tm /resync", "risk": "low"},
    "spooler_clean": {"name": "Limpar Spooler de Impressão", "command": 'net stop spooler; Remove-Item -Path "$env:SystemRoot\\System32\\spool\\PRINTERS\\*" -Force; net start spooler', "risk": "medium"},
    "mem_diag": {"name": "Diagnóstico de Memória", "command": "mdsched.exe", "risk": "high"},
    "event_viewer": {"name": "Logs de Eventos", "command": "eventvwr.msc", "risk": "low"},
    "ping_dns_test": {"name": "Teste de Rede (Ping + DNS)", "command": "Test-NetConnection -ComputerName 8.8.8.8; Resolve-DnsName google.com", "risk": "low"},
    "flush_dns": {"name": "Limpar Cache DNS", "command": "ipconfig /flushdns", "risk": "low"},
    "reset_network_stack": {"name": "Reset da Pilha de Rede", "command": "netsh winsock reset; netsh int ip reset", "risk": "high"},
    "renew_ip": {"name": "Renovar IP e Cache ARP", "command": "ipconfig /release; ipconfig /renew; arp -d *", "risk": "medium"},
    "flush_register_dns": {"name": "Flush + Re-register DNS", "command": "ipconfig /flushdns; ipconfig /registerdns", "risk": "low"},
    "ipconfig_all": {"name": "IPConfig Detalhado", "command": "ipconfig /all", "risk": "low"},
    "active_connections": {"name": "Conexões Ativas (Netstat)", "command": "netstat -ano", "risk": "low"},
    "firewall_gui": {"name": "Firewall do Windows", "command": "wf.msc", "risk": "low"},
    "test_common_ports": {"name": "Testar Portas Comuns", "command": "Test-NetConnection -ComputerName 1.1.1.1 -Port 53; Test-NetConnection -ComputerName 1.1.1.1 -Port 443", "risk": "low"},
    "chkdsk_scan": {"name": "Verificar / Agendar CHKDSK", "command": "chkdsk C: /f /r", "risk": "high"},
    "optimize_drive": {"name": "Otimizar Disco (TRIM / Defrag)", "command": "Optimize-Volume -DriveLetter C -Defrag -Verbose", "risk": "medium"},
    "winsat_disk": {"name": "Teste de Velocidade de Disco", "command": "winsat disk -drive c", "risk": "low"},
    "gpupdate_force": {"name": "Forçar Políticas de Grupo", "command": "gpupdate /force", "risk": "medium"},
    "enable_admin": {"name": "Ativar Administrador Local", "command": "net user Administrator /active:yes", "risk": "high"},
    "show_hidden_devices": {"name": "Drivers Ocultos / Desconectados", "command": 'cmd.exe /c "set DEVMGR_SHOW_NONPRESENT_DEVICES=1 && start devmgmt.msc"', "risk": "low"},
    "backup_drivers": {"name": "Backup de Drivers (Export)", "command": "New-Item -ItemType Directory -Force -Path C:\\DriversBackup; pnputil /export-driver * C:\\DriversBackup", "risk": "low"},
    "battery_report": {"name": "Relatório de Bateria", "command": 'powercfg /batteryreport /output "$env:USERPROFILE\\Desktop\\battery-report.html"', "risk": "low"},
    "hibernate_toggle": {"name": "Desativar Hibernação", "command": "powercfg -h off", "risk": "medium"}
}

active_tasks: Dict[str, asyncio.subprocess.Process] = {}

@app.on_event("startup")
async def startup_event():
    if not is_admin():
        logger.error("WARNING: Sidecar started without Administrator privileges!")
    else:
        logger.info("Sidecar running with Administrator privileges.")

@app.get("/health")
def health_check():
    return {"status": "ok", "is_admin": is_admin()}

@app.get("/api/features")
def get_features():
    return {"features": [{"id": k, **v} for k, v in ALLOWLIST.items()]}

async def stream_output(stream, ws: WebSocket, stream_type: str):
    try:
        while True:
            line = await stream.readline()
            if not line:
                break
            # Decode ignoring errors to avoid crash on invalid characters
            text = line.decode('utf-8', errors='replace').rstrip()
            await ws.send_json({"type": stream_type, "data": text})
    except Exception as e:
        logger.error(f"Error streaming {stream_type}: {e}")

@app.websocket("/ws/terminal")
async def websocket_terminal(websocket: WebSocket):
    await websocket.accept()
    current_process = None
    task_id = None
    
    try:
        # Aguarda a mensagem inicial de pedido de execução
        data = await websocket.receive_text()
        request = json.loads(data)
        
        feature_id = request.get("feature_id")
        
        if not feature_id or feature_id not in ALLOWLIST:
            logger.warning(f"Feature ID não autorizado ou inválido: {feature_id}")
            await websocket.send_json({"type": "stderr", "data": "Comando não autorizado pela Allowlist de Segurança.\n"})
            await websocket.close(code=1003)
            return

        feature = ALLOWLIST[feature_id]
        command = feature["command"]
        
        # Envia confirmação de início
        await websocket.send_json({"type": "info", "data": f"[INFO] Iniciando execução segura: {feature['name']}"})
        await websocket.send_json({"type": "info", "data": f"[CMD] {command}"})
        
        # Cria o processo
        process = await asyncio.create_subprocess_shell(
            f"powershell.exe -NoProfile -ExecutionPolicy Bypass -Command \"{command}\"",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        current_process = process
        task_id = str(id(process))
        active_tasks[task_id] = process
        
        # Inicia leitura das streams assincronamente
        stdout_task = asyncio.create_task(stream_output(process.stdout, websocket, "stdout"))
        stderr_task = asyncio.create_task(stream_output(process.stderr, websocket, "stderr"))
        
        # Aguarda o fim do processo e leitura das streams
        await asyncio.gather(stdout_task, stderr_task)
        await process.wait()
        
        # Envia o código de saída
        exit_code = process.returncode
        await websocket.send_json({"type": "exit", "data": f"[FIM] Processo terminado com código {exit_code}", "exit_code": exit_code})
        
    except WebSocketDisconnect:
        logger.info("WebSocket desconectado.")
        # Cancela o processo em caso de desconexão (se ainda em execução)
        if current_process and current_process.returncode is None:
            logger.info("Cancelando processo em andamento...")
            try:
                current_process.terminate()
            except Exception as e:
                logger.error(f"Erro ao cancelar processo: {e}")
    except Exception as e:
        logger.error(f"Erro no websocket: {e}")
        try:
            await websocket.send_json({"type": "error", "data": f"Erro interno: {str(e)}"})
        except:
            pass
    finally:
        if task_id in active_tasks:
            del active_tasks[task_id]

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8123, reload=False)
