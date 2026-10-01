const API_URL = 'http://localhost:8080/api/chamados';


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

export async function listarChamados(pagina = 0, tamanho = 10) {
    const resposta = await fetch(`${API_URL}?page=${pagina}&size=${tamanho}`);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar chamados');
    }
    return resposta.json(); // agora retorna { content, totalPages, totalElements, ... }
}

export async function listarComentarios(chamadoId) {
    const resposta = await fetch(`${API_URL}/${chamadoId}/comentarios`);
    if (!resposta.ok) {
        throw new Error('Erro ao buscar comentários');
    }
    return resposta.json();
}

export async function adicionarComentario(chamadoId, comentario) {
    const resposta = await fetch(`${API_URL}/${chamadoId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario })
    });
    if (!resposta.ok) {
        throw new Error('Erro ao adicionar comentário');
    }
    return resposta.json();
}