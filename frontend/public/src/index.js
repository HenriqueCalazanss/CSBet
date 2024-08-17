// URL base da função do Netlify
const FUNCTION_URL = '/.netlify/functions/functions';

// PopUp da tela inicial, abrie e fechar contatos e como participar!
function openPopup(popupId) {
  document.getElementById(popupId).style.display = 'flex';
}

function closePopup(popupId) {
  document.getElementById(popupId).style.display = 'none';
}

// Fechar o pop-up ao clicar fora do conteúdo
window.addEventListener('click', function(event) {
  const popupElements = document.querySelectorAll('.popup');
  popupElements.forEach(popup => {
      if (event.target === popup) {
          popup.style.display = 'none';
      }
  });
});

// Função para enviar dados ao banco de dados
async function sendData() {
  try {
    const response = await fetch(`${FUNCTION_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'integração com o banco de dados realizado!' }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Texto enviado com sucesso!');
    } else {
      alert(`Erro: ${result.error}`);
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao enviar dados.');
  }
}

// Função para coletar dados do banco de dados
async function fetchData() {
  try {
    const response = await fetch(`${FUNCTION_URL}`, {
      method: 'GET',
    });

    const result = await response.json();
    if (response.ok) {
      const mostrarElement = document.getElementById('mostrar');
      mostrarElement.innerHTML = result.map(text => `<p>${text}</p>`).join('');
    } else {
      alert(`Erro: ${result.error}`);
    }
  } catch (error) {
    console.error('Erro ao coletar dados:', error);
    alert('Erro ao coletar dados.');
  }
}

// Adiciona event listeners aos botões
document.getElementById('enviar').addEventListener('click', sendData);
document.getElementById('coletar').addEventListener('click', fetchData);