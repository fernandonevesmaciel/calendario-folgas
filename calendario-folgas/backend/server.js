const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conecte ao MongoDB Atlas (vamos configurar já já)
mongoose.connect('mongodb+srv://fernandonevesmaciel:Familia31%21@cluster0.bwwpock.mongodb.net/calendario-folgas?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch((err) => console.log('Erro ao conectar:', err));

// Modelo
const FolgaSchema = new mongoose.Schema({
  dia: Number,
  mes: Number,
  ano: Number,
  userId: String
});
const Folga = mongoose.model('Folga', FolgaSchema);

// Rota para buscar folgas
app.get('/api/folgas/:userId', async (req, res) => {
  const { userId } = req.params;
  const { mes, ano } = req.query;

  try {
    const filtro = { userId };
    if (mes) filtro.mes = parseInt(mes);
    if (ano) filtro.ano = parseInt(ano);

    const folgas = await Folga.find(filtro);
    res.json(folgas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar', err });
  }
});

// Rota para adicionar/remover folga
app.post('/api/folga', async (req, res) => {
  const { dia, mes, ano, userId } = req.body;

  try {
    const existente = await Folga.findOne({ dia, mes, ano, userId });
    if (existente) {
      await Folga.deleteOne({ _id: existente._id });
      res.json({ message: 'Folga removida' });
    } else {
      const nova = new Folga({ dia, mes, ano, userId });
      await nova.save();
      res.json({ message: 'Folga adicionada' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar/remover folga', err });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

