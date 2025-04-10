const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./.vscode/config.json');

// Configurações
const NOTIFICATION_INTERVAL = 60000; // 1 minuto

class HeartRateMonitor {
  constructor() {
    this.client = new Client();
    this.qrGenerated = false; //controle de qr
    this.setupEvents();
  }
  setupEvents() {
    this.client.on('qr', qr => {
      if (!this.qrGenerated) {  // Só gera se for o primeiro QR
        qrcode.generate(qr, { small: true });
        console.log('Escaneie este QR Code UMA VEZ com o WhatsApp');
        this.qrGenerated = true;
        
        // timeout para evitar loops
        setTimeout(() => {
          if (!this.client.info) {
            console.log('\n⚠️ Tempo esgotado! Reinicie o aplicativo para gerar novo QR.');
            process.exit(1);
          }
        }, 120000); // 2 minutos para escanear
      }
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp conectado com sucesso!');
      this.startMonitoring();
    });

    this.client.on('disconnected', (reason) => {
      console.log(`❌ Sessão desconectada (Motivo: ${reason})`);
      if (reason === 'NAVIGATION') {
        console.log('🔄 Reconectando automaticamente...');
        this.client.initialize();
      } else {
        console.log('⏳ Aguardando nova conexão...');
        return this.setupEvents()
      }
    });
  }

  startMonitoring() {
    setInterval(() => {
      this.sendHeartRateUpdate();
    }, NOTIFICATION_INTERVAL);
  }

  async sendHeartRateUpdate() {
    try {
      // Simulação - substituir por dados reais
      const bpm = Math.floor(Math.random() * 60) + 60; 
      
      await this.client.sendMessage(
        config.patientNumber, 
        `Monitoramento Cardíaco:\nBPM Atual: ${bpm}\nHora: ${new Date().toLocaleTimeString()}`
      );
      console.log(`Notificação enviada - BPM: ${bpm}`);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  initialize() {
    this.client.initialize();
  }
}

// Inicia o monitor
const monitor = new HeartRateMonitor();
monitor.initialize();