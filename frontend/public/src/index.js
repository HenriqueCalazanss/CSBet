// URL base da função do Netlify
const FUNCTION_URL = '/.netlify/functions/functions';

// Função para desativar o scroll
function disableScroll() {
  document.body.style.overflow = 'hidden';
}

// Função para ativar o scroll
function enableScroll() {
  document.body.style.overflow = '';
}

// Função para abrir o popup
function openPopup(popupId) {
  document.getElementById(popupId).style.display = 'flex';
  disableScroll(); // Desativa o scroll quando o popup é aberto
}

// Função para fechar o popup
function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
  enableScroll(); // Reativa o scroll quando o popup é fechado
}

// Fechar o popup ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
  const popupElements = document.querySelectorAll('.popup');
  popupElements.forEach(popup => {
    if (event.target === popup) {
      popup.style.display = 'none';
      enableScroll(); // Reativa o scroll ao fechar o popup
    }
  });
});

// Função para buscar rifas do backend e exibir na página
document.addEventListener('DOMContentLoaded', () => {
  fetchRaffles();
});

async function fetchRaffles() {
  try {
    const response = await fetch(FUNCTION_URL); // Requisitar rifas do backend
    if (!response.ok) {
      throw new Error('Erro ao carregar as rifas');
    }
    const raffles = await response.json();
    displayRaffles(raffles);

    // Ocultar o elemento de carregamento e mostrar a lista de rifas
    document.getElementById('carregando').style.display = 'none';
    document.querySelector('.raffles-list').style.display = 'grid';
  } catch (error) {
    console.error('Erro:', error);
  }
}

function displayRaffles(raffles) {
  const rafflesList = document.querySelector('.raffles-list');
  rafflesList.innerHTML = ''; // Limpar lista existente

  raffles.forEach(raffle => {
    const raffleItem = document.createElement('li');
    raffleItem.classList.add('raffle-item');
    raffleItem.addEventListener('click', () => {
      openPopup('popUpRifas');
      // Atualizar detalhes do popup com as informações da rifa clicada
      updateRafflePopup(raffle);
    });

    raffleItem.innerHTML = `
      <img src="${raffle.image}" alt="Imagem da Rifa">
      <div class="raffle-details">
        <h3>${raffle.name}</h3>
        <p>${raffle.description}</p>
      </div>
      <span class="raffle-price">R$ ${raffle.value}</span>
    `;

    rafflesList.appendChild(raffleItem);
  });
}

function updateRafflePopup(raffle) {
  document.getElementById('imgRifa').src = raffle.image;
  document.querySelector('#boxRifa h3').textContent = raffle.name;
  document.querySelector('#info div:nth-of-type(1) h4 span').textContent = `R$ ${raffle.value}`;
  document.querySelector('#info div:nth-of-type(1) p').textContent = raffle.description;
  document.querySelector('#info div:nth-of-type(2) h5').textContent = raffle.typeofdraw;
  document.querySelector('#info div:nth-of-type(2) span').textContent = raffle.prize;

  // Atualiza a lista de números
  const boxNumerosUp = document.getElementById('boxNumerosUp');
  boxNumerosUp.innerHTML = ''; // Limpar conteúdo existente

  // Criar a lista ul
  const ul = document.createElement('ul');

  // Adicionar números que estão como true
  for (const [number, isTrue] of Object.entries(raffle.numbers)) {
    if (isTrue) {
      const li = document.createElement('li');
      li.textContent = number;
      li.addEventListener('click', () => {
        li.classList.toggle('selected'); // Alternar a classe de seleção
        // Atualizar o estilo baseado na seleção
        if (li.classList.contains('selected')) {
          li.style.fontWeight = '700'; // Font-weight para item selecionado
        } else {
          li.style.fontWeight = 'normal'; // Font-weight padrão para item não selecionado
        }
        // Atualizar o valor total ao selecionar ou desmarcar
        updateTotal(raffle.value);
      });
      ul.appendChild(li);
    }
  }

  // Adicionar a ul ao boxNumerosUp
  boxNumerosUp.appendChild(ul);
}

function updateTotal(raffleValue) {
  // Obter a quantidade de itens selecionados
  const selectedItems = document.querySelectorAll('#boxNumerosUp ul li.selected').length;

  // Calcular o total
  const total = (selectedItems * parseFloat(raffleValue)).toFixed(2);

  // Formatar o total com vírgula como separador decimal
  const totalFormatted = total.replace('.', ',');

  // Atualizar o valor na span do botão
  const btnEscolherSpan = document.querySelector('#btnEscolher span');
  btnEscolherSpan.textContent = `R$ ${totalFormatted}`;
}