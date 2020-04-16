export const getAbsoluteSlug = (slug) => {
  const parts = slug.split('/');
  return parts[2] || parts[1];
};
