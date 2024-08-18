document.getElementById('raffleImage').addEventListener('change', function (e) {
    const fileName = e.target.files[0]?.name || 'Nenhuma imagem selecionada';
    document.getElementById('raffleImageText').value = fileName;
});

document.getElementById('raffleValue').addEventListener('input', function (e) {
    let value = e.target.value;

    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Se a string estiver vazia, defina como "0,00"
    if (value === '') {
        e.target.value = '';
        return;
    }

    // Converte o valor para um número com centavos
    value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');

    // Atualiza o valor no input
    e.target.value = value;
});
