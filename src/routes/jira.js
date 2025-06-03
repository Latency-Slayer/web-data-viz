var express = require('express');
var cors = require("cors");
var router = express.Router();

const app = express();

const email = 'ana.latence.2025@gmail.com';
const apiToken = process.env.TOKEN_ATLASSIAN;
const domain = 'fernandolatence2025.atlassian.net';
app.use(cors())

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

router.get('/chamados-abertos', async (req, res) => {
const jql = 'project=KANBAN AND statusCategory != Done';

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

router.get('/chamados-abertos-sem-atribuicao', async (req, res) => {
const jql = 'project=KANBAN AND assignee=null AND statusCategory != Done';

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

router.get('/chamados-totais', async (req, res) => {
const jql = 'project=KANBAN';

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

module.exports = router;



