import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fullstack API',
            version: '1.0.0',
            description: 'API documentation for the Fullstack course project',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/Routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
