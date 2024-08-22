const FUNCTION_URL = '/.netlify/functions/functions';

document.addEventListener('DOMContentLoaded', function () {
    // Atualiza a imagem com o link inserido
    document.querySelector('.btn-upload').addEventListener('click', function () {
        const imageUrl = document.getElementById('raffleImageText').value.trim();
        const imagePreview = document.getElementById('raffleImage');

        if (imageUrl) {
            // Verifica se a URL é válida
            const img = new Image();
            img.onload = function () {
                imagePreview.src = imageUrl;
                imagePreview.style.display = 'block'; // Mostrar a imagem
            };
            img.onerror = function () {
                alert('URL da imagem inválida. Por favor, insira um link válido.');
                imagePreview.style.display = 'none'; // Ocultar a imagem em caso de erro
            };
            img.src = imageUrl;
        } else {
            imagePreview.style.display = 'none'; // Ocultar a imagem se nenhum link for inserido
        }
    });

    // Função de formatação monetária
    function formatCurrency(value) {
        // Formata o valor para 2 casas decimais e substitui o ponto por vírgula
        return parseFloat(value).toFixed(2).replace('.', ',');
    }

    // Atualiza o valor do campo com a formatação monetária
    function updateValueField(event) {
        const input = event.target;
        let value = input.value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

        if (value === '') {
            input.value = '0,00';
            return;
        }

        // Adiciona a vírgula e garante duas casas decimais
        const integerPart = value.slice(0, -2) || '0';
        const decimalPart = value.slice(-2).padEnd(2, '0');

        input.value = formatCurrency(`${integerPart}.${decimalPart}`);
    }

    // Adiciona eventos ao campo de valor
    const raffleValueField = document.getElementById('raffleValue');
    raffleValueField.addEventListener('input', updateValueField);
    raffleValueField.addEventListener('blur', () => {
        // Garantir que o valor final tenha sempre duas casas decimais
        updateValueField({ target: raffleValueField });
    });

    // Função para obter o texto da opção selecionada
    function getSelectedText(selectElement) {
        return selectElement.options[selectElement.selectedIndex].text;
    }
    
    // Validação e criação da rifa
    document.getElementById('createRaffleButton').addEventListener('click', async function (e) {
        e.preventDefault();

        // Coleta os dados do formulário
        const raffleName = document.getElementById('raffleName').value.trim();
        const raffleImage = document.getElementById('raffleImageText').value.trim(); // Link da imagem
        const raffleDescription = document.getElementById('raffleDescription').value.trim();
        const raffleNumbers = document.getElementById('raffleNumbers').value;
        const raffleValue = document.getElementById('raffleValue').value.trim();
        const rafflePrize = document.getElementById('rafflePrize').value.trim();
        const drawTypeSelect = document.getElementById('drawType');
        const drawType = getSelectedText(drawTypeSelect); // Obter o texto da opção selecionada
        const raffleNubrPerson = document.getElementById('raffleNubrPerson').value; // Coleta o número de pessoas
        const rafflePAYMENT = document.getElementById('rafflepPAYMENT').value; // Coleta o método de pagamento

        // Log para depuração
         console.log('Dados do formulário:', {
             raffleName,
             raffleImage,
             raffleDescription,
             raffleNumbers,
             raffleValue,
             rafflePrize,
             drawType,
             raffleNubrPerson, // Adiciona o número de pessoas ao log
             rafflePAYMENT, // Adiciona o método de pagamento ao log
         });
     
         // Validação extra
         if (raffleName === '' || raffleDescription === '' || rafflePrize === '' || raffleImage === '') {
             alert('Por favor, preencha todos os campos obrigatórios.');
             return;
         }

        if (!/^\d+,\d{2}$/.test(raffleValue)) {
            alert('Insira um valor válido. Ex: 10,00');
            return;
        }

        // Enviar os dados para o backend
         try {
             const response = await fetch(FUNCTION_URL, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                     raffleName,
                     raffleImage, // Link da imagem
                     raffleDescription,
                     raffleNumbers,
                     raffleValue,
                     rafflePrize,
                     drawType, // Salvar o nome selecionado
                     raffleNubrPerson, // Adiciona o número de pessoas ao corpo da requisição
                     rafflePAYMENT, // Adiciona o método de pagamento ao corpo da requisição
                 }),
             });

             const result = await response.json();
             console.log('Resposta do backend:', result); // Log para depuração
     
             if (result.success) {
                 alert('Rifa criada com sucesso!');
                 // Limpar o formulário ou redirecionar o usuário
                 const raffleForm = document.getElementById('newRaffleForm');
                 if (raffleForm) {
                     raffleForm.reset(); // Limpar o formulário somente se ele existir
                     // Garantir que a pré-visualização da imagem também seja oculta
                     document.getElementById('raffleImage').style.display = 'none';
                 } else {
                     console.error('Formulário não encontrado.');
                 }
             } else {
                 alert('Erro ao criar a rifa: ' + (result.error || 'Erro desconhecido.'));
             }
            } catch (error) {
                console.error('Erro ao criar a rifa:', error);
                alert('Erro ao criar a rifa. Tente novamente.');
            }
        });
});

// Função para buscar rifas do backend
async function fetchRaffles() {
    const rafflesList = document.getElementById('rafflesList');
    const carregando = document.getElementById('carregando');

    // Mostrar mensagem de carregamento
    carregando.style.display = 'flex';
    rafflesList.innerHTML = ''; // Limpar lista existente

    try {
        // Fazer uma requisição para a função do backend que lista as rifas
        const response = await fetch(FUNCTION_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar rifas');
        }
        const raffles = await response.json();
        // Garantir que as rifas estão na ordem correta
        if (Array.isArray(raffles)) {
            populateRafflesList(raffles);
        } else {
            throw new Error('Formato de resposta inválido');
        }
    } catch (error) {
        console.error('Erro ao buscar rifas:', error);
        // Mostrar mensagem de erro se ocorrer um problema
        rafflesList.innerHTML = '<li>Erro ao carregar rifas</li>';
    } finally {
        // Esconder mensagem de carregamento após carregar as informações
        carregando.style.display = 'none';
    }
}

// Função para exibir as rifas na lista
function populateRafflesList(raffles) {
    const rafflesList = document.getElementById('rafflesList');
    
    // Verificar se há rifas e criar elementos de lista para cada uma
    if (raffles.length === 0) {
        rafflesList.innerHTML = '<li>Nenhuma rifa disponível</li>';
        return;
    }

    raffles.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.name; // Alterar o campo exibido se necessário
        li.onclick = () => showRaffleDetails(r); // Adicionar um clique para mostrar detalhes
        rafflesList.appendChild(li);
    });
}

// Função para exibir o popup com detalhes da rifa
function showRaffleDetails(raffle) {
    // Atualizar o conteúdo do popup com os detalhes da rifa
    document.getElementById('raffleName').textContent = raffle.name;
    document.getElementById('numbersSold').textContent = countSoldNumbers(raffle.numbers) || 'N/A';
    document.getElementById('numbersAvailable').textContent = countAvailableNumbers(raffle.numbers) || 'N/A';
    document.getElementById('percentageSold').textContent = calculatePercentageSold(raffle.numbers) || 'N/A';
    document.getElementById('topBuyer').textContent = raffle.topBuyer || 'N/A';
    document.getElementById('raffleDetailsPopup').style.display = 'flex'; // Exibir o popup
}

// Função para contar os números disponíveis
function countAvailableNumbers(numbers) {
    return Object.values(numbers).filter(value => value === true).length;
}

// Função para contar os números vendidos
function countSoldNumbers(numbers) {
    return Object.values(numbers).filter(value => value === false).length;
}

// Função para calcular a porcentagem de números vendidos
function calculatePercentageSold(numbers) {
    const totalNumbers = Object.keys(numbers).length;
    const soldNumbers = countSoldNumbers(numbers);

    if (totalNumbers === 0) {
        return 'N/A'; // Evita divisão por zero
    }

    const percentage = (soldNumbers / totalNumbers) * 100;
    return `${Math.round(percentage)}%`; // Arredonda a porcentagem e adiciona o símbolo de %
}

// Função para fechar o popup
function closePopup() {
    document.getElementById('raffleDetailsPopup').style.display = 'none'; // Ocultar o popup
}

// Inicializa a lista de rifas ao carregar a página
fetchRaffles();

// Função para mostrar a tela 1 e esconder a main
function showTela1() {
    document.getElementById('tela1').style.display = 'flex';
    document.querySelector('main').style.display = 'none';
}

// Função para mostrar a tela 2 e esconder a main
function showTela2() {
    document.getElementById('tela2').style.display = 'flex';
    document.querySelector('main').style.display = 'none';
}

// Adiciona eventos de clique aos botões
document.getElementById('btn1').addEventListener('click', showTela1);
document.getElementById('btn2').addEventListener('click', showTela2);

// Função para fechar o popup
function closePopup(telaId) {
    if (telaId === 'tela1') {
        document.getElementById('tela1').style.display = 'none';
        document.querySelector('main').style.display = 'flex';
    } else if (telaId === 'tela2') {
        document.getElementById('tela2').style.display = 'none';
        document.querySelector('main').style.display = 'flex';
    }
}

// Função para ocultar o popup ao clicar na área de conteúdo
function hidePopupOnClick(event) {
    // Verifica se o clique foi dentro do popup-content
    if (event.target.closest('.popup-content')) {
        document.getElementById('raffleDetailsPopup').style.display = 'none';
    }
}

// Adiciona o evento de clique ao documento para capturar cliques fora do popup-content
document.addEventListener('click', hidePopupOnClick);
