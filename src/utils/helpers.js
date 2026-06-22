// 날짜 관련 헬퍼 함수
export const calculateDaysRemaining = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatus = (daysRemaining) => {
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 30) return 'expiring';
  return 'active';
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return '정상';
    case 'expiring':
      return '만료임박';
    case 'expired':
      return '만료됨';
    default:
      return '알수없음';
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const getDaysRemainingClass = (days) => {
  if (days < 0) return 'critical';
  if (days <= 30) return 'warning';
  return 'safe';
};

// 검색 필터 함수
export const filterItems = (items, searchTerm) => {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => {
    return (
      item.customer?.toLowerCase().includes(term) ||
      item.service?.toLowerCase().includes(term) ||
      item.domain?.toLowerCase().includes(term) ||
      item.licenseName?.toLowerCase().includes(term)
    );
  });
};

// 정렬 함수
export const sortItems = (items, sortBy, sortOrder) => {
  return [...items].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === 'daysRemaining') {
      aValue = calculateDaysRemaining(a.expiryDate);
      bValue = calculateDaysRemaining(b.expiryDate);
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};
