var express = require('express');
var cors = require("cors");
var router = express.Router();

const app = express();

const email = 'fernando.latence.2025@gmail.com';
const apiToken = process.env.TOKEN_ATLASSIAN;
const domain = 'fernandolatence2025.atlassian.net';
app.use(cors())

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

router.get('/chamados-abertos', async (req, res) => {
  const jql = 'project=KAN AND statusCategory!=Done'; // chave do projeto

  const response = await fetch(`https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}`, {
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

router.post('/criar-chamado', async (req, res) => {
  const { summary, description } = req.body;

  const issueData = {
    fields: {
      project: { key: "KAN" },
      summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: description || "Descrição padrão do chamado",
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
      return res.status(response.status).json({ error: data });
    }

    console.log('Chamado criado:', data);
    res.json({ message: 'Chamado criado com sucesso!', data });
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    res.status(500).json({ error: 'Erro interno ao criar chamado' });
  }
});
module.exports = router;



