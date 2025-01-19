import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './Config/db';
import commentRoutes from './Routes/commentRoutes';
import postRoutes from './Routes/postRoutes';
import swaggerSpec from './swagger';
import * as swaggerUI from 'swagger-ui-express';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.get('/', (_req, res) => {
    res.send('Assignment 2');
});
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default app;