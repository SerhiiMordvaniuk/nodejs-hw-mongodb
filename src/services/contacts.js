import { SORT_ORDER } from '../constants/index.js';
import Contact from '../db/models/contact.js';
import {
  calculatePaginationData,
  isPageLessTotalPage,
} from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const contactQuery = Contact.find({ userId });

  if (filter.type !== undefined) {
    contactQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (!contactQuery) return;

  const contactCount = await Contact.find()
    .merge(contactQuery)
    .countDocuments();

  const queryPage = isPageLessTotalPage(page, perPage, contactCount);

  const limit = perPage;
  const skip = (queryPage - 1) * perPage;

  const contacts = await contactQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(page, perPage, contactCount);

  return {
    ...paginationData,
    data: contacts,
  };
};

export const getContactById = (userId, id) =>
  Contact.findOne({ _id: id, userId });

export const createContact = (payload) => Contact.create(payload);

export const deleteContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });

export const updateContact = (id, userId, payload) =>
  Contact.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
