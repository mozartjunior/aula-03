import express from 'express';

const app = express();
const PORT = 4040;

// Middleware para JSON
app.use(express.json());

// ===============================
// Desafio 1 - Painel de RH
// ===============================
app.get('/rh/resumo', (req, res) => {
  res.status(200).json({
    total_colaboradores: 1250,
    turno_atual: "Segundo Turno",
    setor_vago: "Nenhum"
  });
});

/* ===============================
   DESAFIO 2 - Check-up de Manutenção
   =============================== */
app.get('/manutencao', (req, res) => {
  res.status(200).json({
    maquinas_criticas: 0,
    ultima_revisao: "2023-10-25",
    proxima_revisao: "2023-11-25"
  });
});

/* ===============================
   DESAFIO 3 - Emergência / Pânico
   =============================== */
app.get('/emergencia', (req, res) => {
  res.status(500).json({
    alerta: "ALERTA: Sensor de incêndio não detectado."
  });
});

// Start do servidor
app.listen(PORT, () => {
  console.log(`🧑‍💼 Servidor RH rodando na porta ${PORT}`);
});
