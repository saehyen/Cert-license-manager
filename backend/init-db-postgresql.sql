-- PostgreSQL용 데이터베이스 초기화 스크립트

-- 데이터베이스 생성 (psql에서 실행 전에 수동으로 생성)
-- CREATE DATABASE cert_license_db;

-- 데이터베이스 연결
\c cert_license_db;

-- SSL 인증서 테이블
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  expiry_date DATE NOT NULL,
  manager VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_cert_customer ON certificates(customer);
CREATE INDEX idx_cert_service ON certificates(service);
CREATE INDEX idx_cert_domain ON certificates(domain);
CREATE INDEX idx_cert_expiry_date ON certificates(expiry_date);

-- 라이센스 테이블
CREATE TABLE IF NOT EXISTS licenses (
  id SERIAL PRIMARY KEY,
  customer VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  license_name VARCHAR(255) NOT NULL,
  license_key VARCHAR(500) NOT NULL,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  manager VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_lic_customer ON licenses(customer);
CREATE INDEX idx_lic_service ON licenses(service);
CREATE INDEX idx_lic_license_name ON licenses(license_name);
CREATE INDEX idx_lic_expiry_date ON licenses(expiry_date);

-- updated_at 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (SSL 인증서)
INSERT INTO certificates (customer, service, domain, issuer, expiry_date, manager, notes) VALUES
('네이버', '메인 서비스', 'www.naver.com', 'DigiCert', '2026-08-15', '김철수', 'Wildcard 인증서'),
('카카오', '카카오톡', 'talk.kakao.com', 'Let''s Encrypt', '2026-07-20', '이영희', ''),
('쿠팡', 'E-commerce', 'www.coupang.com', 'GlobalSign', '2026-06-25', '박민수', 'EV SSL'),
('배달의민족', '주문 시스템', 'api.baemin.com', 'Comodo', '2026-07-05', '정수진', '');

-- 샘플 데이터 삽입 (라이센스)
INSERT INTO licenses (customer, service, license_name, license_key, expiry_date, quantity, manager, notes) VALUES
('네이버', '클라우드 인프라', 'VMware vSphere', 'XXXXX-XXXXX-XXXXX-XXXXX', '2026-12-31', 100, '김철수', 'Enterprise 라이센스'),
('카카오', '데이터베이스', 'Oracle Database', 'YYYYY-YYYYY-YYYYY-YYYYY', '2026-09-15', 50, '이영희', 'Standard Edition'),
('쿠팡', '보안 솔루션', 'F5 Load Balancer', 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ', '2026-07-10', 10, '박민수', '');
