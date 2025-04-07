import createHttpError from 'http-errors';

import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export async function getAllContactsController(req, res) {
  const userId = req.user._id;

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
  });

  res.json({
    status: 200,
    message:
      contacts.data.length > 0
        ? 'Successfully found contacts!'
        : 'Contacts not found!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const userId = req.user._id;
  const id = req.params.id;

  const contact = await getContactById(userId, id);
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
  const userId = req.user._id;

  const contact = await createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContactController(req, res) {
  const userId = req.user._id;

  const photo = req.file;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const id = req.params.id;

  const result = await updateContact(id, userId, {
    ...req.body,
    photo: photoUrl,
  });
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
  const userId = req.user._id;
  const id = req.params.id;
  const contact = await deleteContact(id, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).end();
}
