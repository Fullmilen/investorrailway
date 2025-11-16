// Enviar investimento
async function enviarInvestimento() {
    const nome = document.getElementById("nome").value.trim();
    const valor = parseFloat(document.getElementById("valor").value);

    if (!nome || isNaN(valor) || valor <= 0) {
        alert("Preencha um nome válido e um valor maior que zero.");
        return;
    }

    const resp = await fetch("/investir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, valor })
    });

    const data = await resp.json();

    if (!resp.ok) {
        alert(data.erro || "Erro ao investir");
        return;
    }
}

// Atualiza o status completo da página
async function atualizarStatus() {
    const resp = await fetch("/status");
    const data = await resp.json();

    // Atualizar barra de progresso
    const barra = document.getElementById("progressBar");
    barra.value = data.total_acumulado;
    barra.max = data.objetivo;

    document.getElementById("progressText").textContent =
        `R$ ${data.total_acumulado.toLocaleString('pt-BR', {minimumFractionDigits: 2})} / ` +
        `R$ ${data.objetivo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

    // Atualizar tabela de investidores
    const tbody = document.querySelector("#tabelaInvestidores tbody");
    tbody.innerHTML = "";

    const investidores = data.investidores;

    for (const nome in investidores) {
        const info = investidores[nome];

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${nome}</td>
            <td>R$ ${info.total_investido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
            <td>R$ ${info.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
        `;

        tbody.appendChild(linha);
    }
}

// Atualização automática
setInterval(atualizarStatus, 2000);
window.onload = atualizarStatus;
