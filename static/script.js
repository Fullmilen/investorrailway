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
    }

    atualizarBarra();
    atualizarLista();
}

// Atualizar barra de progresso
async function atualizarBarra() {
    const resp = await fetch("/status");
    const data = await resp.json();

    const porcentagem = (data.total_acumulado / data.objetivo) * 100;

    document.getElementById("barra").style.width = porcentagem + "%";
    document.getElementById("total").innerText = data.total_acumulado.toFixed(2);
}

// Atualizar lista de investidores
async function atualizarLista() {
    const resp = await fetch("/lista");
    const data = await resp.json();

    const lista = document.getElementById("lista-investidores");
    lista.innerHTML = ""; // limpa antes de recriar

    for (const nome in data) {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${nome}</strong> — 
            Investido: R$ ${data[nome].total_investido.toFixed(2)} —
            Saldo: R$ ${data[nome].saldo.toFixed(2)}
        `;
        lista.appendChild(item);
    }
}

// Atualiza tudo ao carregar a página
window.onload = () => {
    atualizarBarra();
    atualizarLista();
};
