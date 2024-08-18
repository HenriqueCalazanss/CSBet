// URL da função do Netlify
const FUNCTION_URL = '/.netlify/functions/functions';

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
