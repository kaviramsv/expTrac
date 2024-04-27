import express from 'express';
import { validate } from 'express-validation';
import { contactController } from './contact.controllers';
import { contactValidators } from './contact.validation';
import { verifyJwt } from '../../middleware/verifyJwt';
export const contactRouter = express.Router();

contactRouter
    .route('/')
    .post(
        [verifyJwt, validate(contactValidators.createContact)],
        contactController.createContact
    );
contactRouter.route('/').get([verifyJwt], contactController.getContacts);
contactRouter
    .route('/:contactId')
    .delete(
        [verifyJwt, validate(contactValidators.deleteContact)],
        contactController.deleteContact
    );
contactRouter
    .route('/:contactId')
    .put(
        [verifyJwt, validate(contactValidators.updateContact)],
        contactController.updateContact
    );
