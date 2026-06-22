const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cert_license_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 데이터베이스 연결 테스트
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ PostgreSQL 데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error('❌ PostgreSQL 연결 실패:', err.message);
  });

// Routes

// SSL 인증서 관련 API
app.get('/api/certificates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certificates ORDER BY expiry_date ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('인증서 조회 오류:', error);
    res.status(500).json({ error: '인증서를 가져오는데 실패했습니다.' });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const { customer, service, domain, issuer, expiryDate, manager, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO certificates (customer, service, domain, issuer, expiry_date, manager, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [customer, service, domain, issuer, expiryDate, manager, notes]
    );
    res.status(201).json({ id: result.rows[0].id, message: '인증서가 추가되었습니다.' });
  } catch (error) {
    console.error('인증서 추가 오류:', error);
    res.status(500).json({ error: '인증서를 추가하는데 실패했습니다.' });
  }
});

app.put('/api/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, service, domain, issuer, expiryDate, manager, notes } = req.body;
    await pool.query(
      'UPDATE certificates SET customer = $1, service = $2, domain = $3, issuer = $4, expiry_date = $5, manager = $6, notes = $7 WHERE id = $8',
      [customer, service, domain, issuer, expiryDate, manager, notes, id]
    );
    res.json({ message: '인증서가 수정되었습니다.' });
  } catch (error) {
    console.error('인증서 수정 오류:', error);
    res.status(500).json({ error: '인증서를 수정하는데 실패했습니다.' });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM certificates WHERE id = $1', [id]);
    res.json({ message: '인증서가 삭제되었습니다.' });
  } catch (error) {
    console.error('인증서 삭제 오류:', error);
    res.status(500).json({ error: '인증서를 삭제하는데 실패했습니다.' });
  }
});

// 라이센스 관련 API
app.get('/api/licenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM licenses ORDER BY expiry_date ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('라이센스 조회 오류:', error);
    res.status(500).json({ error: '라이센스를 가져오는데 실패했습니다.' });
  }
});

app.post('/api/licenses', async (req, res) => {
  try {
    const { customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO licenses (customer, service, license_name, license_key, expiry_date, quantity, manager, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes]
    );
    res.status(201).json({ id: result.rows[0].id, message: '라이센스가 추가되었습니다.' });
  } catch (error) {
    console.error('라이센스 추가 오류:', error);
    res.status(500).json({ error: '라이센스를 추가하는데 실패했습니다.' });
  }
});

app.put('/api/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes } = req.body;
    await pool.query(
      'UPDATE licenses SET customer = $1, service = $2, license_name = $3, license_key = $4, expiry_date = $5, quantity = $6, manager = $7, notes = $8 WHERE id = $9',
      [customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes, id]
    );
    res.json({ message: '라이센스가 수정되었습니다.' });
  } catch (error) {
    console.error('라이센스 수정 오류:', error);
    res.status(500).json({ error: '라이센스를 수정하는데 실패했습니다.' });
  }
});

app.delete('/api/licenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM licenses WHERE id = $1', [id]);
    res.json({ message: '라이센스가 삭제되었습니다.' });
  } catch (error) {
    console.error('라이센스 삭제 오류:', error);
    res.status(500).json({ error: '라이센스를 삭제하는데 실패했습니다.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', database: 'PostgreSQL' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 시그널 받음. 서버 종료 중...');
  pool.end(() => {
    console.log('PostgreSQL 풀 종료됨');
    process.exit(0);
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다. (PostgreSQL)`);
});
