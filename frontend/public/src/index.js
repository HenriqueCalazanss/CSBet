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
