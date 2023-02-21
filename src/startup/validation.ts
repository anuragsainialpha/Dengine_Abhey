import * as Joi from 'joi';
import jObjectId from 'joi-objectid';

export default function() {
  Joi.objectId = jObjectId(Joi);
}
