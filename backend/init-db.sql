-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS cert_license_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cert_license_db;

-- SSL 인증서 테이블
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer VARCHAR(255) NOT NULL COMMENT '고객사',
  service VARCHAR(255) NOT NULL COMMENT '서비스명',
  domain VARCHAR(255) NOT NULL COMMENT '도메인',
  issuer VARCHAR(255) NOT NULL COMMENT '발급처',
  expiry_date DATE NOT NULL COMMENT '만료일',
  manager VARCHAR(100) NOT NULL COMMENT '담당자',
  notes TEXT COMMENT '비고',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer (customer),
  INDEX idx_service (service),
  INDEX idx_domain (domain),
  INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 라이센스 테이블
CREATE TABLE IF NOT EXISTS licenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer VARCHAR(255) NOT NULL COMMENT '고객사',
  service VARCHAR(255) NOT NULL COMMENT '서비스명',
  license_name VARCHAR(255) NOT NULL COMMENT '라이센스명',
  license_key VARCHAR(500) NOT NULL COMMENT '라이센스 키',
  expiry_date DATE NOT NULL COMMENT '만료일',
  quantity INT NOT NULL DEFAULT 1 COMMENT '수량',
  manager VARCHAR(100) NOT NULL COMMENT '담당자',
  notes TEXT COMMENT '비고',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer (customer),
  INDEX idx_service (service),
  INDEX idx_license_name (license_name),
  INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 샘플 데이터 삽입 (SSL 인증서)
INSERT INTO certificates (customer, service, domain, issuer, expiry_date, manager, notes) VALUES
('네이버', '메인 서비스', 'www.naver.com', 'DigiCert', '2026-08-15', '김철수', 'Wildcard 인증서'),
('카카오', '카카오톡', 'talk.kakao.com', 'Let\'s Encrypt', '2026-07-20', '이영희', ''),
('쿠팡', 'E-commerce', 'www.coupang.com', 'GlobalSign', '2026-06-25', '박민수', 'EV SSL'),
('배달의민족', '주문 시스템', 'api.baemin.com', 'Comodo', '2026-07-05', '정수진', '');

-- 샘플 데이터 삽입 (라이센스)
INSERT INTO licenses (customer, service, license_name, license_key, expiry_date, quantity, manager, notes) VALUES
('네이버', '클라우드 인프라', 'VMware vSphere', 'XXXXX-XXXXX-XXXXX-XXXXX', '2026-12-31', 100, '김철수', 'Enterprise 라이센스'),
('카카오', '데이터베이스', 'Oracle Database', 'YYYYY-YYYYY-YYYYY-YYYYY', '2026-09-15', 50, '이영희', 'Standard Edition'),
('쿠팡', '보안 솔루션', 'F5 Load Balancer', 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ', '2026-07-10', 10, '박민수', '');
