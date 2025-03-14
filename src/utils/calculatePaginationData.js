import createHttpError from 'http-errors';

export function calculatePaginationData(page, perPage, count) {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  if (page > totalPages) {
    throw createHttpError(404, `Page in query less than totalPages`);
  }

  return {
    page,
    perPage,
    totalPages,
    totalItems: count,
    hasNextPage,
    hasPreviousPage,
  };
}
