import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);

  const contacts = await getAllContacts({ page, perPage });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const id = req.params.id;
  const contact = await getContactById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 20,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
}

export async function createContactController(req, res) {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const id = req.params.id;
  const result = await updateContact(id, req.body);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully updated a contact!`,
    data: result,
  });
}

export async function deleteContactController(req, res) {
  const id = req.params.id;
  const contact = await deleteContact(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).end();
}
