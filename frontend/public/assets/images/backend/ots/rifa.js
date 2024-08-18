// URL da função do Netlify
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

        // Log para depuração
        console.log('Dados do formulário:', {
            raffleName,
            raffleImage,
            raffleDescription,
            raffleNumbers,
            raffleValue,
            rafflePrize,
            drawType,
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