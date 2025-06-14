const {Router} = require("express");

const router = Router();  

const email = 'ana.latence.2025@gmail.com';
const apiToken = process.env.TOKEN_ATLASSIAN;
const domain = 'fernandolatence2025.atlassian.net';

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

router.get('/chamados-abertos', async (req, res) => {

  const jql = 'project=KANBAN AND statusCategory != Done';
  const maxResults = 100;
  const response = await fetch(`https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  console.log("Chamados do Jira:", data.issues);
  res.json(data.issues);
});

const abrirChamado = async (summary, description) => {
  const issueData = {
    fields: {
      project: { key: "KANBAN" },
      summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: description,
                type: "text"
              }
            ]
          }
        ]
      },
      issuetype: { name: "Task" }
    }
  };

  try {
    const response = await fetch(`https://${domain}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao criar chamado:', data);
      return { error: data };
    }

    console.log('Chamado criado:', data);
    return data.id;
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    return "Erro ao abrir chamado"
  }
};

router.get('/chamados-abertos-sem-atribuicao', async (req, res) => {
const jql = 'project=KANBAN AND assignee=null AND statusCategory != Done';
const maxResults = 100;
  const response = await fetch(`https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  console.log("Chamados do Jira:", data.issues);
  res.json(data.issues);
});

router.get('/chamados-totais', async (req, res) => {
const jql = 'project = KANBAN AND statusCategory != Done AND created >= startOfMonth()';
maxResults = 100;

  const response = await fetch(`https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  const data = await response.json();
  console.log("Chamados do Jira:", data.issues);
  res.json(data.issues);
});

router.get("/getQuantidadeDeChamadosDoMesPassado", (req, res) => {
    serverController.getQuantidadeDeChamadosDoMesPassado(req, res);
});

module.exports = {
  router,
  abrirChamado
};