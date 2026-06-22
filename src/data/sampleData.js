// 샘플 데이터
export const sampleCertificates = [
  {
    id: 1,
    customer: '네이버',
    service: '메인 서비스',
    domain: 'www.naver.com',
    issuer: 'DigiCert',
    expiryDate: '2026-08-15',
    manager: '김철수',
    notes: 'Wildcard 인증서'
  },
  {
    id: 2,
    customer: '카카오',
    service: '카카오톡',
    domain: 'talk.kakao.com',
    issuer: 'Let\'s Encrypt',
    expiryDate: '2026-07-20',
    manager: '이영희',
    notes: ''
  },
  {
    id: 3,
    customer: '쿠팡',
    service: 'E-commerce',
    domain: 'www.coupang.com',
    issuer: 'GlobalSign',
    expiryDate: '2026-06-25',
    manager: '박민수',
    notes: 'EV SSL'
  },
  {
    id: 4,
    customer: '배달의민족',
    service: '주문 시스템',
    domain: 'api.baemin.com',
    issuer: 'Comodo',
    expiryDate: '2026-07-05',
    manager: '정수진',
    notes: ''
  }
];

export const sampleLicenses = [
  {
    id: 1,
    customer: '네이버',
    service: '클라우드 인프라',
    licenseName: 'VMware vSphere',
    licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX',
    expiryDate: '2026-12-31',
    quantity: 100,
    manager: '김철수',
    notes: 'Enterprise 라이센스'
  },
  {
    id: 2,
    customer: '카카오',
    service: '데이터베이스',
    licenseName: 'Oracle Database',
    licenseKey: 'YYYYY-YYYYY-YYYYY-YYYYY',
    expiryDate: '2026-09-15',
    quantity: 50,
    manager: '이영희',
    notes: 'Standard Edition'
  },
  {
    id: 3,
    customer: '쿠팡',
    service: '보안 솔루션',
    licenseName: 'F5 Load Balancer',
    licenseKey: 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ',
    expiryDate: '2026-07-10',
    quantity: 10,
    manager: '박민수',
    notes: ''
  }
];
