export const filterPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, '').slice(0, 11);
  const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  }
  return value;
};

export const filterNameValue = (value: string): string => {
  return value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z\s]/g, '');
};

export const filterDepartmentValue = filterNameValue;

export const filterStudentIdValue = (value: string): string => {
  return value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9\s]/g, '').slice(0, 7);
};

export const filterBirthdateValue = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, '').slice(0, 8);
  const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);
  if (match) {
    return [match[1], match[2], match[3]].filter(Boolean).join('/');
  }
  return value;
};

export const filterEmailValue = (value: string): string => {
  return value.trim().toLowerCase();
};
