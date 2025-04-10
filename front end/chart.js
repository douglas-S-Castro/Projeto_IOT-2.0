// Configurações do gráfico
const CHART_CONFIG = {
    maxDataPoints: 20,
    bpmRange: { min: 60, max: 120 },
    updateInterval: 1000,
    chartColors: {
      line: "#007700",
      text: "#00ff00",
      grid: "#00ff00"
    }
  };
  
  const chartEl = document.getElementById("heartRateChart");
  const labels = [];
  const dataPoints = [];
  
  // Formata hora no formato HH:MM:SS
  const getCurrentTime = () => new Date().toLocaleTimeString('pt-BR', { hour12: false });
  
  // Configuração do gráfico
  const chart = new Chart(chartEl, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Batimentos por Minuto (BPM)",
        data: dataPoints,
        borderColor: CHART_CONFIG.chartColors.line,
        borderWidth: 3,
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: "Tempo", color: CHART_CONFIG.chartColors.text },
          ticks: { 
            color: CHART_CONFIG.chartColors.text,
            font: { size: 18 },
            callback: (value, index) => index % 3 === 0 ? labels[index] : ""
          },
          grid: {
            color: CHART_CONFIG.chartColors.grid,
            lineWidth: 0.5
          }
        },
        y: {
          title: { display: true, text: "BPM", color: CHART_CONFIG.chartColors.text },
          min: 40,
          max: 180,
          ticks: { 
            color: CHART_CONFIG.chartColors.text,
            font: { size: 14 },
            stepSize: 20
          },
          grid: {
            color: CHART_CONFIG.chartColors.grid,
            lineWidth: 0.5
          }
        }
      },
      plugins: {
        legend: { 
          labels: { 
            color: CHART_CONFIG.chartColors.text, 
            font: { size: 14 } 
          } 
        }
      }
    }
  });
  
  // Adiciona novos dados ao gráfico
  const addDataPoint = () => {
    const bpm = Math.floor(Math.random() * 
      (CHART_CONFIG.bpmRange.max - CHART_CONFIG.bpmRange.min) + 
      CHART_CONFIG.bpmRange.min);
    
    labels.push(getCurrentTime());
    dataPoints.push(bpm);
  
    // Mantém apenas os últimos pontos definidos
    if (labels.length > CHART_CONFIG.maxDataPoints) {
      labels.shift();
      dataPoints.shift();
    }
  
    chart.update();
  };
  
  // Inicia a atualização do gráfico
  setInterval(addDataPoint, CHART_CONFIG.updateInterval);