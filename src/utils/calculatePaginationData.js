export function calculatePaginationData(page, perPage, count) {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalPages,
    totalItems: count,
    hasNextPage,
    hasPreviousPage,
  };
}

export function isPageLessTotalPage(page, perPage, count) {
  const totalPages = Math.ceil(count / perPage);
  let queryPage;
  if (page > totalPages) {
    queryPage = totalPages ? totalPages : 1;
    return queryPage;
  }
  return page;
}
