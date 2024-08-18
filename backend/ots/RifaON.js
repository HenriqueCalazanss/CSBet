// Simulação de dados para rifas
const raffles = [
    {
        id: 1,
        name: 'Rifa 1',
        numbersSold: 150,
        numbersAvailable: 50,
        percentageSold: '75%',
        topBuyer: 'João Silva'
    },
    {
        id: 2,
        name: 'Rifa 2',
        numbersSold: 200,
        numbersAvailable: 100,
        percentageSold: '67%',
        topBuyer: 'Maria Oliveira'
    },
    {
        id: 3,
        name: 'Rifa 3',
        numbersSold: 90,
        numbersAvailable: 10,
        percentageSold: '90%',
        topBuyer: 'Carlos Santos'
    },
    {
        id: 4,
        name: 'Rifa 4',
        numbersSold: 50,
        numbersAvailable: 50,
        percentageSold: '50%',
        topBuyer: 'Ana Costa'
    }
];

// Função para exibir as rifas na lista
function populateRafflesList() {
    const rafflesList = document.getElementById('rafflesList');
    raffles.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.name;
        li.onclick = () => showRaffleDetails(r);
        rafflesList.appendChild(li);
    });
}

// Função para exibir o popup com detalhes da rifa
function showRaffleDetails(raffle) {
    document.getElementById('raffleName').textContent = raffle.name;
    document.getElementById('numbersSold').textContent = raffle.numbersSold;
    document.getElementById('numbersAvailable').textContent = raffle.numbersAvailable;
    document.getElementById('percentageSold').textContent = raffle.percentageSold;
    document.getElementById('topBuyer').textContent = raffle.topBuyer;
    document.getElementById('raffleDetailsPopup').style.display = 'flex';
}

// Função para fechar o popup
function closePopup() {
    document.getElementById('raffleDetailsPopup').style.display = 'none';
}

// Inicializa a lista de rifas
populateRafflesList();
