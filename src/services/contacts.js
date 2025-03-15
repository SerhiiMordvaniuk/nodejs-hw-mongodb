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
}) => {
  const contactQuery = Contact.find();

  if (filter.contactType !== undefined) {
    contactQuery.where('contactType').equals(filter.contactType);
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

export const getContactById = (id) => Contact.findById(id);

export const createContact = (payload) => Contact.create(payload);

export const deleteContact = (id) => Contact.findOneAndDelete({ _id: id });

export const updateContact = (id, payload) =>
  Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
