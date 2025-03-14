import Contact from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = Contact.find();
  const contactCount = await Contact.find()
    .merge(contactQuery)
    .countDocuments();

  const contacts = await contactQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(page, perPage, contactCount);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (id) => Contact.findById(id);

export const createContact = (payload) => Contact.create(payload);

export const deleteContact = (id) => Contact.findOneAndDelete({ _id: id });

export const updateContact = (id, payload) =>
  Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
