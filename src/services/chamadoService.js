const API_URL = 'http://localhost:8080/api/chamados';

export async function listarChamados() {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar chamados');
    }
    return resposta.json();
}

export async function alterarStatus(id, novoStatus) {
    const resposta = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
    });
    if (!resposta.ok) {
        throw new Error('Erro ao alterar status');
    }
    return resposta.json();
}

export async function criarChamado(dados) {
    const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!resposta.ok) {
        throw new Error('Erro ao criar chamado');
    }
    return resposta.json();
}

export async function listarAtrasados() {
    const resposta = await fetch(`${API_URL}/atrasados`);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar chamados atrasados');
    }
    return resposta.json();
}

export async function editarChamado(id, dados) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    if (!resposta.ok) {
        throw new Error('Erro ao editar chamado');
    }
    return resposta.json();
}