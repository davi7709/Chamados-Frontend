# Gestão de Chamados — Frontend

Interface web em React para consumir a [API de Gestão de Chamados](https://github.com/davi7709/Gestao-de-Chamados) . Permite cadastrar, editar, listar, filtrar por status e visualizar chamados atrasados em uma tabela.

Este foi meu primeiro contato com React — desenvolvido durante o desafio como forma de aprender o framework na prática.

## Tecnologias utilizadas

- **React** (com Vite como ferramenta de build)
- **JavaScript** (sem TypeScript, para focar no aprendizado dos conceitos base do React)
- **CSS puro** (sem biblioteca de componentes)
- `fetch` nativo do navegador para consumo da API (sem Axios ou similares)

## Pré-requisitos

- Node.js (LTS recomendado)
- A [API backend](../../gestao-chamados) rodando em `http://localhost:8080` antes de iniciar o front

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Certifique-se de que o backend Spring Boot já está rodando — sem ele, a tela fica presa em "Carregando chamados..." e depois exibe erro.

## Funcionalidades

- **Listagem em tabela**, com badges coloridos por prioridade.
- **Criação de chamado** via formulário (título, descrição, solicitante, prioridade — status inicial sempre `NOVO`, definido pelo backend).
- **Alteração de status** direto na tabela, através de um `<select>` por linha — atualiza a API e a tela sem precisar recarregar a página.
- **Edição de dados gerais** de um chamado (reaproveita o mesmo formulário de criação, alternando entre modo criar/editar).
- **Destaque visual de chamados atrasados** (linha destacada + badge "Atrasado"), consumindo o endpoint `GET /api/chamados/atrasados` do backend.

## Estrutura do projeto

```
src/
├── services/
│   └── chamadoService.js   # todas as chamadas HTTP para a API (fetch)
├── App.jsx                 # componente principal (estado, formulário, tabela)
├── App.css                 # estilos
└── main.jsx                # ponto de entrada, monta o App no HTML
```

A camada `services/` concentra toda comunicação com a API — os componentes não fazem `fetch` diretamente, só chamam funções como `listarChamados()` ou `criarChamado(dados)`. Separação de responsabilidade equivalente à que existe entre Controller e Service no backend.

## Decisões técnicas

**JavaScript puro (sem TypeScript) e HTML/CSS sem framework de UI.**
Como este era meu primeiro projeto em React, optei por manter as demais variáveis conhecidas — menos ferramentas novas ao mesmo tempo, foco em entender os conceitos centrais (componentes, estado, efeitos) sem a complexidade adicional de tipagem estática ou de aprender uma biblioteca de componentes.

**`fetch` nativo em vez de Axios.**
Evita uma dependência externa para algo que o navegador já resolve nativamente — trade-off consciente de simplicidade sobre conveniência (Axios oferece interceptors e tratamento de erro mais prático, mas não era necessário para o escopo deste projeto).

**Um único componente (`App.jsx`) em vez de vários componentes menores.**
Dado o tamanho do projeto, dividir em componentes separados (ex.: `Tabela`, `FormularioChamado`) adicionaria complexidade de passagem de props sem ganho real de organização nesta escala. Seria o primeiro refactor a considerar caso o projeto crescesse.

**Formulário de criação e edição compartilhado.**
Em vez de duplicar um segundo formulário, o mesmo formulário alterna entre "modo criar" e "modo editar" (controlado por um estado `editandoId`), reaproveitando os mesmos campos e validação.

**Reconsulta de "atrasados" após qualquer mudança de status.**
Como mudar o status de um chamado pode tirá-lo da lista de atrasados (ex.: marcar como `RESOLVIDO`), o front busca essa lista novamente após cada alteração de status, para manter o destaque visual sempre coerente com o estado real dos dados.

## Possíveis evoluções (fora do escopo deste desafio)

- Divisão em componentes menores e reutilizáveis.
- Migração para TypeScript.
- Feedback visual de carregamento durante o envio do formulário (estado `enviando` + `disabled` no botão).
- Filtro por status na própria interface (atualmente mostra todos os chamados).
