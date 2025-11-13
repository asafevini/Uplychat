// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();

// Ajuste o origin se quiser travar pra um domínio específico
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, message } = req.body;

    // Validação básica
    if (!name || !email || !phone || !company) {
      return res.status(400).json({ success: false, error: 'Campos obrigatórios faltando.' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;
    const sourcePage = req.headers['referer'] || null;

    const [result] = await pool.execute(
      `INSERT INTO contact_requests
        (full_name, email, phone, company, message, source_page, user_agent, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        company,
        message || null,
        sourcePage,
        userAgent,
        ip
      ]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Erro ao salvar contato:', err);
    return res.status(500).json({ success: false, error: 'Erro interno ao enviar seu contato.' });
  }
});

// Rota simples pra testar se o servidor está online
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
