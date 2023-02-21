import axios from 'axios';
import { CONSTS } from '../helper/other';

export default axios.create({
  baseURL: CONSTS.SCHEMA_URI
});
