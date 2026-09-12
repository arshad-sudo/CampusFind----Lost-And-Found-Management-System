import dayjs from 'dayjs';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM D, YYYY');
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A';
  return dayjs(dateTime).format('MMM D, YYYY h:mm A');
};

export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'LOST':
    case 'PENDING':
      return 'warning';
    case 'FOUND':
      return 'info';
    case 'CLAIMED':
      return 'secondary';
    case 'RETURNED':
    case 'APPROVED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

export const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getImageUrl = (input) => {
  if (!input) return 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600';
  
  let path = '';
  if (typeof input === 'string') {
    path = input;
  } else if (input && typeof input === 'object') {
    path = input.filePath || input.fileName || input.url || input.preview || '';
  }

  if (!path) return 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  const cleanPath = path.replace(/^(\.\/|\/)+/, '');
  return `http://localhost:8080/${cleanPath}`;
};
