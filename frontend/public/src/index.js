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
