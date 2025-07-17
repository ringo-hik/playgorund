const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// API 라우트 매핑
server.get('/api/v1/devportal/ai-chatops/health', (req, res) => {
  const data = router.db.get('health').value();
  res.json(data);
});

server.get('/api/v1/devportal/ai-chatops/personas', (req, res) => {
  const data = router.db.get('personas').value();
  res.json(data);
});

server.post('/api/v1/devportal/ai-chatops/message/async', (req, res) => {
  const data = router.db.get('message-async').value();
  res.json(data);
});

server.post('/api/v1/devportal/ai-chatops/quick-questions', (req, res) => {
  const data = router.db.get('quick-questions').value();
  res.json(data);
});

server.get('/api/v1/devportal/ai-chatops/conversations/:personaCode', (req, res) => {
  const personaCode = req.params.personaCode;
  const data = router.db.get(`conversations-${personaCode}`).value();
  res.json(data);
});

server.delete('/api/v1/devportal/ai-chatops/conversations/:personaCode', (req, res) => {
  const personaCode = req.params.personaCode;
  const data = router.db.get(`conversations-${personaCode}`).value();
  res.json(data);
});

server.post('/api/v1/devportal/ai-chatops/feedback', (req, res) => {
  const data = router.db.get('feedback').value();
  res.json(data);
});

server.use(router);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});