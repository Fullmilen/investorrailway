const form = document.getElementById('investForm');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nome: document.getElementById('nome').value,
        valor: document.getElementById('valor').value
    };

    const res = await fetch('/investir', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const json = await res.json();

    // Handle server errors
    if (!res.ok || json.error) {
        resultado.textContent = `❌ Erro: ${json.error || 'Erro desconhecido'}`;
        return;
    }

    // Atualiza mensagem de sucesso ou aprovação
    if (json.aprovado) {
        resultado.textContent = "🎉 Projeto aprovado! Parabéns, investidores! 🎉";
    } else {
        resultado.textContent = "✅ Investimento registrado com sucesso!";
    }

    // Força atualização da barra/tabela chamando a função já definida no index.html
    if (typeof atualizarStatus === "function") {
        atualizarStatus();
    }

    form.reset();
});

