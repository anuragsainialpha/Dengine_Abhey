import winston from 'winston';
import express from 'express';
import cors from 'cors';
import startup from './startup';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
app.use(cors());
app.use(bodyParser.json());
startup(app);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//starting server
const port = process.env.PORT || 5000;
const server = app.listen(port, listenerCallback());

function listenerCallback(): (() => void) | undefined {
  return () => winston.info(`Listening on port ${port}...`);
}


export default server;
export const ROOT_DIR = __dirname;
