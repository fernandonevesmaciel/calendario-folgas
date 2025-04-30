const userId = "usuario_123"; // Simulando usuário logado
const calendario = document.getElementById('calendario');
const mesAno = document.getElementById('mes-ano');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');

let dataAtual = new Date();

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function atualizarCabecalho() {
  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();
  mesAno.textContent = `${nomesMeses[mes]} ${ano}`;
}

function criarCalendario() {
  calendario.innerHTML = '';

  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  nomesDias.forEach(dia => {
    const el = document.createElement('div');
    el.classList.add('cabecalho');
    el.textContent = dia;
    calendario.appendChild(el);
  });

  // Espaços vazios antes do 1º dia
  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement('div');
    calendario.appendChild(vazio);
  }

  // Dias do mês
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const el = document.createElement('div');
    el.classList.add('dia');
    el.textContent = dia;
    el.dataset.dia = dia;

    el.addEventListener('click', async () => {
      el.classList.toggle('folga');

      const ano = dataAtual.getFullYear();
      const mes = dataAtual.getMonth() + 1;

      try {
        await fetch("http://localhost:3000/api/folga", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dia, mes, ano, userId })
        });
      } catch (err) {
        console.error("Erro ao salvar folga:", err);
      }
    });

    calendario.appendChild(el);
  }
}

async function carregarFolgas() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth() + 1;

  try {
    const resposta = await fetch(`http://localhost:3000/api/folgas/${userId}?mes=${mes}&ano=${ano}`);
    const folgas = await resposta.json();

    folgas.forEach(folga => {
      const diaEl = document.querySelector(`.dia[data-dia='${folga.dia}']`);
      if (diaEl) {
        diaEl.classList.add("folga");
      }
    });
  } catch (err) {
    console.error("Erro ao carregar folgas:", err);
  }
}

btnPrev.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  atualizar();
});

btnNext.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  atualizar();
});

function atualizar() {
  atualizarCabecalho();
  criarCalendario();
  carregarFolgas();
}

atualizar();
