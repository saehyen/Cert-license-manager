import React, { useState, useEffect } from 'react';

const LicenseModal = ({ isOpen, onClose, onSave, license }) => {
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    licenseName: '',
    licenseKey: '',
    expiryDate: '',
    quantity: '',
    manager: '',
    notes: ''
  });

  useEffect(() => {
    if (license) {
      // 날짜 형식을 YYYY-MM-DD로 변환
      const formattedDate = license.expiryDate 
        ? new Date(license.expiryDate).toISOString().split('T')[0]
        : '';
      
      setFormData({
        ...license,
        expiryDate: formattedDate
      });
    } else {
      setFormData({
        customer: '',
        service: '',
        licenseName: '',
        licenseKey: '',
        expiryDate: '',
        quantity: '',
        manager: '',
        notes: ''
      });
    }
  }, [license, isOpen]);

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
    <div className="modal-overlay">
      <div className="modal">{/* onClick={(e) => e.stopPropagation()} 제거 - 이제 필요없음 */}
        <h2>{license ? '라이센스 수정' : '라이센스 추가'}</h2>
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
            <label htmlFor="licenseName">라이센스명 *</label>
            <input
              type="text"
              id="licenseName"
              name="licenseName"
              value={formData.licenseName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenseKey">라이센스 키 *</label>
            <input
              type="text"
              id="licenseKey"
              name="licenseKey"
              value={formData.licenseKey}
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
            <label htmlFor="quantity">수량 *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
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
              {license ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LicenseModal;
