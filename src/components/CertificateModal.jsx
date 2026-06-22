import React, { useState, useEffect } from 'react';

const CertificateModal = ({ isOpen, onClose, onSave, certificate }) => {
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    domain: '',
    issuer: '',
    expiryDate: '',
    manager: '',
    notes: ''
  });

  useEffect(() => {
    if (certificate) {
      setFormData(certificate);
    } else {
      setFormData({
        customer: '',
        service: '',
        domain: '',
        issuer: '',
        expiryDate: '',
        manager: '',
        notes: ''
      });
    }
  }, [certificate, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{certificate ? 'SSL 인증서 수정' : 'SSL 인증서 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer">고객사 *</label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">서비스명 *</label>
            <input
              type="text"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="domain">도메인 *</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="issuer">발급처 *</label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">만료일 *</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manager">담당자 *</label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">비고</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="button button-primary">
              {certificate ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateModal;
