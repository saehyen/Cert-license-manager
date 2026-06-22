import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Search, Shield, Key } from 'lucide-react';
import CertificateTable from './components/CertificateTable';
import LicenseTable from './components/LicenseTable';
import CertificateModal from './components/CertificateModal';
import LicenseModal from './components/LicenseModal';
import { filterItems, sortItems } from './utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:11050/api';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('certificates');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // SSL 인증서 상태
  const [certificates, setCertificates] = useState([]);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certSortBy, setCertSortBy] = useState('daysRemaining');
  const [certSortOrder, setCertSortOrder] = useState('asc');
  
  // 라이센스 상태
  const [licenses, setLicenses] = useState([]);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [licenseSortBy, setLicenseSortBy] = useState('daysRemaining');
  const [licenseSortOrder, setLicenseSortOrder] = useState('asc');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 초기 데이터 로드
    fetchCertificates();
    fetchLicenses();
  }, []);

  // API 함수들
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/certificates`);
      const data = await response.json();
      // DB 컬럼명을 프론트엔드 형식으로 변환
      const formatted = data.map(cert => ({
        id: cert.id,
        customer: cert.customer,
        service: cert.service,
        domain: cert.domain,
        issuer: cert.issuer,
        expiryDate: cert.expiry_date,
        manager: cert.manager,
        notes: cert.notes
      }));
      setCertificates(formatted);
    } catch (error) {
      console.error('인증서 조회 실패:', error);
      alert('인증서를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/licenses`);
      const data = await response.json();
      // DB 컬럼명을 프론트엔드 형식으로 변환
      const formatted = data.map(license => ({
        id: license.id,
        customer: license.customer,
        service: license.service,
        licenseName: license.license_name,
        licenseKey: license.license_key,
        expiryDate: license.expiry_date,
        quantity: license.quantity,
        manager: license.manager,
        notes: license.notes
      }));
      setLicenses(formatted);
    } catch (error) {
      console.error('라이센스 조회 실패:', error);
      alert('라이센스를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // SSL 인증서 핸들러
  const handleCertSort = (column) => {
    if (certSortBy === column) {
      setCertSortOrder(certSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setCertSortBy(column);
      setCertSortOrder('asc');
    }
  };

  const handleAddCert = () => {
    setEditingCert(null);
    setIsCertModalOpen(true);
  };

  const handleEditCert = (cert) => {
    setEditingCert(cert);
    setIsCertModalOpen(true);
  };

  const handleSaveCert = async (certData) => {
    try {
      if (editingCert) {
        // 수정
        const response = await fetch(`${API_URL}/certificates/${editingCert.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certData)
        });
        if (response.ok) {
          await fetchCertificates();
          alert('인증서가 수정되었습니다.');
        }
      } else {
        // 추가
        const response = await fetch(`${API_URL}/certificates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(certData)
        });
        if (response.ok) {
          await fetchCertificates();
          alert('인증서가 추가되었습니다.');
        }
      }
    } catch (error) {
      console.error('인증서 저장 실패:', error);
      alert('인증서 저장에 실패했습니다.');
    }
  };

  const handleDeleteCert = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${API_URL}/certificates/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchCertificates();
          alert('인증서가 삭제되었습니다.');
        }
      } catch (error) {
        console.error('인증서 삭제 실패:', error);
        alert('인증서 삭제에 실패했습니다.');
      }
    }
  };

  // 라이센스 핸들러
  const handleLicenseSort = (column) => {
    if (licenseSortBy === column) {
      setLicenseSortOrder(licenseSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setLicenseSortBy(column);
      setLicenseSortOrder('asc');
    }
  };

  const handleAddLicense = () => {
    setEditingLicense(null);
    setIsLicenseModalOpen(true);
  };

  const handleEditLicense = (license) => {
    setEditingLicense(license);
    setIsLicenseModalOpen(true);
  };

  const handleSaveLicense = async (licenseData) => {
    try {
      if (editingLicense) {
        // 수정
        const response = await fetch(`${API_URL}/licenses/${editingLicense.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(licenseData)
        });
        if (response.ok) {
          await fetchLicenses();
          alert('라이센스가 수정되었습니다.');
        }
      } else {
        // 추가
        const response = await fetch(`${API_URL}/licenses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(licenseData)
        });
        if (response.ok) {
          await fetchLicenses();
          alert('라이센스가 추가되었습니다.');
        }
      }
    } catch (error) {
      console.error('라이센스 저장 실패:', error);
      alert('라이센스 저장에 실패했습니다.');
    }
  };

  const handleDeleteLicense = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${API_URL}/licenses/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchLicenses();
          alert('라이센스가 삭제되었습니다.');
        }
      } catch (error) {
        console.error('라이센스 삭제 실패:', error);
        alert('라이센스 삭제에 실패했습니다.');
      }
    }
  };

  // 필터링 및 정렬
  const filteredCerts = sortItems(
    filterItems(certificates, searchTerm),
    certSortBy,
    certSortOrder
  );

  const filteredLicenses = sortItems(
    filterItems(licenses, searchTerm),
    licenseSortBy,
    licenseSortOrder
  );

  return (
    <div className="app">
      {loading && <div className="loading-overlay">로딩 중...</div>}
      <header className="header">
        <h1>🔐 SSL 인증서 & 라이센스 관리</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Shield size={20} />
          SSL 인증서
        </button>
        <button
          className={`tab ${activeTab === 'licenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('licenses')}
        >
          <Key size={20} />
          라이센스
        </button>
      </div>

      <div className="controls">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder={
              activeTab === 'certificates'
                ? '고객사, 서비스, 도메인으로 검색...'
                : '고객사, 서비스, 라이센스명으로 검색...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="add-button"
          onClick={activeTab === 'certificates' ? handleAddCert : handleAddLicense}
        >
          <Plus size={20} />
          {activeTab === 'certificates' ? '인증서 추가' : '라이센스 추가'}
        </button>
      </div>

      {activeTab === 'certificates' ? (
        <>
          <CertificateTable
            certificates={filteredCerts}
            onEdit={handleEditCert}
            onDelete={handleDeleteCert}
            sortBy={certSortBy}
            sortOrder={certSortOrder}
            onSort={handleCertSort}
          />
          <CertificateModal
            isOpen={isCertModalOpen}
            onClose={() => setIsCertModalOpen(false)}
            onSave={handleSaveCert}
            certificate={editingCert}
          />
        </>
      ) : (
        <>
          <LicenseTable
            licenses={filteredLicenses}
            onEdit={handleEditLicense}
            onDelete={handleDeleteLicense}
            sortBy={licenseSortBy}
            sortOrder={licenseSortOrder}
            onSort={handleLicenseSort}
          />
          <LicenseModal
            isOpen={isLicenseModalOpen}
            onClose={() => setIsLicenseModalOpen(false)}
            onSave={handleSaveLicense}
            license={editingLicense}
          />
        </>
      )}
    </div>
  );
}

export default App;
