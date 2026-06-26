import { format } from 'date-fns';
import { toast } from 'react-toastify';

export const getIconUrl = (icon: string) => {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(icon, 'image/svg+xml');

  const coloredIcon = new XMLSerializer().serializeToString(svgDocument);

  const base64SVG = window.btoa(coloredIcon);
  return `data:image/svg+xml;base64,${base64SVG}`;
};

export const handleErrorToast = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const formatDate = (date?: Date | string) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';

export const isEmpty = (value: any) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return isNaN(value.getTime());
    }
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  return false;
};
