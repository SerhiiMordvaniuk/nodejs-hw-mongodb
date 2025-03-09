import Contact from '../db/models/contact.js';

export const getAllContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const createContact = (payload) => Contact.create(payload);

export const deleteContact = (id) => Contact.findOneAndDelete({ _id: id });

export const updateContact = (id, payload) =>
  Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
