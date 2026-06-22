import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  calculateDaysRemaining,
  getStatus,
  getStatusText,
  formatDate,
  getDaysRemainingClass
} from '../utils/helpers';

const CertificateTable = ({ certificates, onEdit, onDelete, sortBy, sortOrder, onSort }) => {
  if (certificates.length === 0) {
    return (
      <div className="empty-state">
        <p>등록된 SSL 인증서가 없습니다.</p>
      </div>
    );
  }

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => onSort('customer')}>
              <div className="sortable">
                고객사 {renderSortIcon('customer')}
              </div>
            </th>
            <th onClick={() => onSort('service')}>
              <div className="sortable">
                서비스명 {renderSortIcon('service')}
              </div>
            </th>
            <th onClick={() => onSort('domain')}>
              <div className="sortable">
                도메인 {renderSortIcon('domain')}
              </div>
            </th>
            <th>발급처</th>
            <th onClick={() => onSort('expiryDate')}>
              <div className="sortable">
                만료일 {renderSortIcon('expiryDate')}
              </div>
            </th>
            <th onClick={() => onSort('daysRemaining')}>
              <div className="sortable">
                남은일수 {renderSortIcon('daysRemaining')}
              </div>
            </th>
            <th>상태</th>
            <th>담당자</th>
            <th>비고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => {
            const daysRemaining = calculateDaysRemaining(cert.expiryDate);
            const status = getStatus(daysRemaining);
            
            return (
              <tr key={cert.id}>
                <td>{cert.customer}</td>
                <td>{cert.service}</td>
                <td>{cert.domain}</td>
                <td>{cert.issuer}</td>
                <td>{formatDate(cert.expiryDate)}</td>
                <td>
                  <span className={`days-remaining ${getDaysRemainingClass(daysRemaining)}`}>
                    {daysRemaining < 0 ? '만료' : `${daysRemaining}일`}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${status}`}>
                    {getStatusText(status)}
                  </span>
                </td>
                <td>{cert.manager}</td>
                <td>{cert.notes || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-button"
                      onClick={() => onEdit(cert)}
                      title="수정"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="icon-button delete"
                      onClick={() => onDelete(cert.id)}
                      title="삭제"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;
