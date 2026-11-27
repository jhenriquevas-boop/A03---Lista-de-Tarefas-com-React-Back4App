import { useState, useEffect } from "react";

const HEADERS = {
  "X-Parse-Application-Id": import.meta.env.VITE_APP_ID,
  "X-Parse-REST-API-Key": import.meta.env.VITE_REST_KEY,
  "Content-Type": "application/json",
};

const URL = "https://parseapi.back4app.com/parse/classes/Tarefa";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(URL, { headers: HEADERS })
      .then((r) => r.json())
      .then((dados) => {
        if (dados.results) {
          setTarefas(dados.results);
        }
      });
  }, []);

  async function adicionarTarefa() {
    if (!input.trim()) return;

    const resposta = await fetch(URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ titulo: input.trim() }),
    });

    const criada = await resposta.json();

    setTarefas([
      ...tarefas,
      { objectId: criada.objectId, titulo: input.trim() },
    ]);
    setInput("");
  }

  async function excluirTarefa(objectId) {
    await fetch(`${URL}/${objectId}`, {
      method: "DELETE",
      headers: HEADERS,
    });

    setTarefas(tarefas.filter((tarefa) => tarefa.objectId !== objectId));
  }

  return (
    <div>
      <h1><strong>Minha Lista de Tarefas</strong></h1>

      <input
        class="caixainput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nova tarefa"
      />
      <button class="botaoAdicionar" onClick={adicionarTarefa}>
      <strong> Adicionar</strong>
      </button>

      <ul class="itens">
        {tarefas.map((tarefa) => (
          <li class="todoitem" key={tarefa.objectId}>
           <strong> {tarefa.titulo} </strong>
            <button
              class="botaoExcluir"
              onClick={() => excluirTarefa(tarefa.objectId)}
            >
              <img class="lixeira" src="src/assets/lixeira fechada.png" alt="excluir tarefa" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
