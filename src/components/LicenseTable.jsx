import React from 'react';
import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  calculateDaysRemaining,
  getStatus,
  getStatusText,
  formatDate,
  getDaysRemainingClass
} from '../utils/helpers';

const LicenseTable = ({ licenses, onEdit, onDelete, sortBy, sortOrder, onSort }) => {
  if (licenses.length === 0) {
    return (
      <div className="empty-state">
        <p>등록된 라이센스가 없습니다.</p>
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
            <th onClick={() => onSort('licenseName')}>
              <div className="sortable">
                라이센스명 {renderSortIcon('licenseName')}
              </div>
            </th>
            <th>라이센스 키</th>
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
            <th>수량</th>
            <th>상태</th>
            <th>담당자</th>
            <th>비고</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((license) => {
            const daysRemaining = calculateDaysRemaining(license.expiryDate);
            const status = getStatus(daysRemaining);
            
            return (
              <tr key={license.id}>
                <td>{license.customer}</td>
                <td>{license.service}</td>
                <td>{license.licenseName}</td>
                <td>
                  <code style={{ fontSize: '0.875rem' }}>
                    {license.licenseKey}
                  </code>
                </td>
                <td>{formatDate(license.expiryDate)}</td>
                <td>
                  <span className={`days-remaining ${getDaysRemainingClass(daysRemaining)}`}>
                    {daysRemaining < 0 ? '만료' : `${daysRemaining}일`}
                  </span>
                </td>
                <td>{license.quantity}</td>
                <td>
                  <span className={`status-badge status-${status}`}>
                    {getStatusText(status)}
                  </span>
                </td>
                <td>{license.manager}</td>
                <td>{license.notes || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="icon-button"
                      onClick={() => onEdit(license)}
                      title="수정"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="icon-button delete"
                      onClick={() => onDelete(license.id)}
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

export default LicenseTable;
