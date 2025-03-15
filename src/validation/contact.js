import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(30).required().messages({
    'string.base': 'phoneNumber should be a string',
    'string.min': 'phoneNumber should have at least {#limit} characters',
    'string.max': 'phoneNumber should have at most {#limit} characters',
  }),
  email: Joi.string().min(10).max(30).messages({
    'string.base': 'email should be a string', //дописати вимоги саме по емайлу
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'contactType should be a string',
    'any.valid': 'contactType is not valid',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(30).messages({
    'string.base': 'phoneNumber should be a string',
    'string.min': 'phoneNumber should have at least {#limit} characters',
    'string.max': 'phoneNumber should have at most {#limit} characters',
    'any.required': 'phoneNumber is required',
  }),
  email: Joi.string().min(10).max(30).messages({
    'string.base': 'email should be a string', //дописати вимоги саме по емайлу
    'string.min': 'email should have at least {#limit} characters',
    'string.max': 'email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'contactType should be a string',
    'any.valid': 'contactType is not valid',
  }),
});
