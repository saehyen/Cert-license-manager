const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cert_license_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 데이터베이스 연결 테스트
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL 데이터베이스 연결 성공');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL 연결 실패:', err.message);
  });

// Routes

// SSL 인증서 관련 API
app.get('/api/certificates', async (req, res) => {
  console.log('📥 GET /api/certificates 요청 받음');
  try {
    const [rows] = await pool.query('SELECT * FROM certificates ORDER BY expiry_date ASC');
    console.log(`✅ 인증서 ${rows.length}개 조회 성공`);
    res.json(rows);
  } catch (error) {
    console.error('❌ 인증서 조회 오류:', error.message);
    console.error('상세 에러:', error);
    res.status(500).json({ error: '인증서를 가져오는데 실패했습니다.', details: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const { customer, service, domain, issuer, expiryDate, manager, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO certificates (customer, service, domain, issuer, expiry_date, manager, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [customer, service, domain, issuer, expiryDate, manager, notes]
    );
    res.status(201).json({ id: result.insertId, message: '인증서가 추가되었습니다.' });
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
      'UPDATE certificates SET customer = ?, service = ?, domain = ?, issuer = ?, expiry_date = ?, manager = ?, notes = ? WHERE id = ?',
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
    await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ message: '인증서가 삭제되었습니다.' });
  } catch (error) {
    console.error('인증서 삭제 오류:', error);
    res.status(500).json({ error: '인증서를 삭제하는데 실패했습니다.' });
  }
});

// 라이센스 관련 API
app.get('/api/licenses', async (req, res) => {
  console.log('📥 GET /api/licenses 요청 받음');
  try {
    const [rows] = await pool.query('SELECT * FROM licenses ORDER BY expiry_date ASC');
    console.log(`✅ 라이센스 ${rows.length}개 조회 성공`);
    res.json(rows);
  } catch (error) {
    console.error('❌ 라이센스 조회 오류:', error.message);
    console.error('상세 에러:', error);
    res.status(500).json({ error: '라이센스를 가져오는데 실패했습니다.', details: error.message });
  }
});

app.post('/api/licenses', async (req, res) => {
  try {
    const { customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO licenses (customer, service, license_name, license_key, expiry_date, quantity, manager, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer, service, licenseName, licenseKey, expiryDate, quantity, manager, notes]
    );
    res.status(201).json({ id: result.insertId, message: '라이센스가 추가되었습니다.' });
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
      'UPDATE licenses SET customer = ?, service = ?, license_name = ?, license_key = ?, expiry_date = ?, quantity = ?, manager = ?, notes = ? WHERE id = ?',
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
    await pool.query('DELETE FROM licenses WHERE id = ?', [id]);
    res.json({ message: '라이센스가 삭제되었습니다.' });
  } catch (error) {
    console.error('라이센스 삭제 오류:', error);
    res.status(500).json({ error: '라이센스를 삭제하는데 실패했습니다.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log('============================================');
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 로컬: http://localhost:${PORT}`);
  console.log(`📍 네트워크: http://0.0.0.0:${PORT}`);
  console.log('============================================');
  console.log('');
  console.log('💡 프론트엔드 .env 파일 확인:');
  console.log(`   VITE_API_URL=http://localhost:${PORT}/api`);
  console.log('');
});
