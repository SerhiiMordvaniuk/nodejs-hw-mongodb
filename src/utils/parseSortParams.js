import { SORT_ORDER } from '../constants/index.js';

function parseSortOrder(sortOrder) {
  const isKnowSortOrder = [SORT_ORDER.DESC, SORT_ORDER.ASC].includes(sortOrder);

  if (isKnowSortOrder) return sortOrder;

  return SORT_ORDER.ASC;
}

function parseSortBy(sortBy) {
  const keysOFContact = ['_id', 'name'];

  if (keysOFContact.includes(sortBy)) return sortBy;

  return '_id';
}

export function parseSortParams(query) {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
}
