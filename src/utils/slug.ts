export const getAbsoluteSlug = (slug: string): string => {
  const [, second, third] = slug.split('/');
  return third || second;
};
