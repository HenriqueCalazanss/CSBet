const FUNCTION_URL = '/.netlify/functions/functions';

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
}

function openPopup(popupId) {
  document.getElementById(popupId).style.display = 'flex';
  disableScroll(); // Desativa o scroll quando o popup é aberto
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
  enableScroll(); // Reativa o scroll quando o popup é fechado
  
  // Limpar o cálculo do total
  updateTotal('0.00'); // Define o total como zero
}

window.addEventListener('click', function(event) {
  const popupElements = document.querySelectorAll('.popup');
  popupElements.forEach(popup => {
    if (event.target === popup) {
      popup.style.display = 'none';
      enableScroll();
      
      updateTotal('0.00');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  fetchRaffles();
});

async function fetchRaffles() {
  try {
    const response = await fetch(FUNCTION_URL);
    if (!response.ok) {
      throw new Error('Erro ao carregar as rifas');
    }
    const raffles = await response.json();
    displayRaffles(raffles);

    document.getElementById('carregando').style.display = 'none';
    document.querySelector('.raffles-list').style.display = 'grid';
  } catch (error) {
    console.error('Erro:', error);
  }
}

function displayRaffles(raffles) {
  const rafflesList = document.querySelector('.raffles-list');
  rafflesList.innerHTML = '';
  raffles.forEach(raffle => {
    const raffleItem = document.createElement('li');
    raffleItem.classList.add('raffle-item');
    raffleItem.addEventListener('click', () => {
      openPopup('popUpRifas');
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

let maxSelectable = Infinity;

function updateRafflePopup(raffle) {
  document.getElementById('imgRifa').src = raffle.image;
  document.querySelector('#boxRifa h3').textContent = raffle.name;
  document.querySelector('#info div:nth-of-type(1) h4 span').textContent = `R$ ${raffle.value}`;
  document.querySelector('#info div:nth-of-type(1) p').textContent = raffle.description;
  document.querySelector('#info div:nth-of-type(2) h5').textContent = raffle.typeofdraw;
  document.querySelector('#info div:nth-of-type(2) span').textContent = raffle.prize;

  const boxNumerosUp = document.getElementById('boxNumerosUp');
  boxNumerosUp.innerHTML = '';
  const ul = document.createElement('ul');
  const npersonKeys = Object.keys(raffle.nperson);
  const trueValues = npersonKeys.filter(key => raffle.nperson[key] === true);

  if (trueValues.length > 0) {
    maxSelectable = parseInt(trueValues[0], 10);
  } else {
    maxSelectable = Infinity;
  }

  for (const [number, isTrue] of Object.entries(raffle.numbers)) {
    if (isTrue) {
      const li = document.createElement('li');
      li.textContent = number;
      li.addEventListener('click', () => {
        const selectedItems = document.querySelectorAll('#boxNumerosUp ul li.selected').length;

        if (li.classList.contains('selected')) {
          li.classList.remove('selected');
          li.style.fontWeight = 'normal';
        } else {
          if (maxSelectable === Infinity || selectedItems < maxSelectable) {
            li.classList.add('selected');
            li.style.fontWeight = '700';
          } else {
            alert(`Você pode selecionar no máximo ${maxSelectable} números.`);
          }
        }
        
        updateTotal(raffle.value);
      });
      ul.appendChild(li);
    }
  }

  boxNumerosUp.appendChild(ul);

  updateTotal(raffle.value);
}

function updateTotal(raffleValue) {
  const selectedItems = document.querySelectorAll('#boxNumerosUp ul li.selected').length;
  const raffleValueNumber = parseFloat(raffleValue.replace(',', '.'));
  const total = (selectedItems * raffleValueNumber).toFixed(2);
  const totalFormatted = total.replace('.', ',');
  const btnEscolherSpan = document.querySelector('#btnEscolher span');
  btnEscolherSpan.textContent = `${totalFormatted}`;
}