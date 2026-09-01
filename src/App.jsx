import { useState, useEffect, useRef } from 'react';
import {
    listarChamados,
    criarChamado,
    editarChamado,
    alterarStatus,
    listarAtrasados
} from './services/chamadoService';
import './App.css';

const STATUS_OPCOES = ['NOVO', 'EM_ANDAMENTO', 'RESOLVIDO', 'ENCERRADO'];

const CHAMADO_VAZIO = {
    titulo: '',
    descricao: '',
    solicitante: '',
    prioridade: 'MEDIA'
};

function App() {
    const [chamados, setChamados] = useState([]);
    const [idsAtrasados, setIdsAtrasados] = useState(new Set());
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    const [novoChamado, setNovoChamado] = useState(CHAMADO_VAZIO);
    const [editandoId, setEditandoId] = useState(null); // null = modo criação

    const formRef = useRef(null);

    useEffect(() => {
        Promise.all([listarChamados(), listarAtrasados()])
            .then(([dadosChamados, dadosAtrasados]) => {
                setChamados(dadosChamados);
                setIdsAtrasados(new Set(dadosAtrasados.map(c => c.id)));
            })
            .catch(err => setErro(err.message))
            .finally(() => setCarregando(false));
    }, []);

    function handleCampoChange(evento) {
        const { name, value } = evento.target;
        setNovoChamado({ ...novoChamado, [name]: value });
    }

    function handleIniciarEdicao(chamado) {
        setEditandoId(chamado.id);
        setNovoChamado({
            titulo: chamado.titulo,
            descricao: chamado.descricao,
            solicitante: chamado.solicitante,
            prioridade: chamado.prioridade
        });
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function handleCancelarEdicao() {
        setEditandoId(null);
        setNovoChamado(CHAMADO_VAZIO);
    }

    async function handleSalvarChamado(evento) {
        evento.preventDefault();

        if (editandoId) {
            const atualizado = await editarChamado(editandoId, novoChamado);
            setChamados(chamados.map(c => c.id === atualizado.id ? atualizado : c));
        } else {
            const criado = await criarChamado(novoChamado);
            setChamados([...chamados, criado]);
        }

        setNovoChamado(CHAMADO_VAZIO);
        setEditandoId(null);
    }

    async function handleMudarStatus(chamado, novoStatus) {
        const atualizado = await alterarStatus(chamado.id, novoStatus);
        setChamados(chamados.map(c => c.id === atualizado.id ? atualizado : c));

        // Reconsulta os atrasados, já que mudar o status pode tirar
        // (ou colocar) o chamado dessa lista
        const dadosAtrasados = await listarAtrasados();
        setIdsAtrasados(new Set(dadosAtrasados.map(c => c.id)));
    }

    if (carregando) return <p>Carregando chamados...</p>;
    if (erro) return <p>Erro: {erro}</p>;

    return (
        <div>
            <h1>Gestão de Chamados</h1>

            <form ref={formRef} onSubmit={handleSalvarChamado} className="form-criar">
                <input
                    name="titulo"
                    placeholder="Título"
                    value={novoChamado.titulo}
                    onChange={handleCampoChange}
                    required
                />
                <input
                    name="descricao"
                    placeholder="Descrição"
                    value={novoChamado.descricao}
                    onChange={handleCampoChange}
                />
                <input
                    name="solicitante"
                    placeholder="Solicitante"
                    value={novoChamado.solicitante}
                    onChange={handleCampoChange}
                    required
                />
                <select name="prioridade" value={novoChamado.prioridade} onChange={handleCampoChange}>
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                </select>
                <button type="submit">{editandoId ? 'Salvar edição' : 'Criar chamado'}</button>
                {editandoId && (
                    <button type="button" className="btn-cancelar" onClick={handleCancelarEdicao}>
                        Cancelar
                    </button>
                )}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Solicitante</th>
                        <th>Prioridade</th>
                        <th>Status</th>
                        <th>Atenção</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {chamados.map(chamado => (
                        <tr key={chamado.id} className={idsAtrasados.has(chamado.id) ? 'atrasado' : ''}>
                            <td>{chamado.titulo}</td>
                            <td>{chamado.solicitante}</td>
                            <td>
                                <span className={`prioridade prioridade-${chamado.prioridade}`}>
                                    {chamado.prioridade}
                                </span>
                            </td>
                            <td>
                                <select
                                    value={chamado.status}
                                    onChange={e => handleMudarStatus(chamado, e.target.value)}
                                >
                                    {STATUS_OPCOES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                {idsAtrasados.has(chamado.id) && (
                                    <span className="badge-atrasado">⚠ Atrasado</span>
                                )}
                            </td>
                            <td>
                                <button type="button" className="btn-editar" onClick={() => handleIniciarEdicao(chamado)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
