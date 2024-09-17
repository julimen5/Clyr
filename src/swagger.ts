import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'Swagger Clyr',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '',
    },
  ],
};

const outputFile = './swagger_output.ts';
const endpointsFiles = ['./src/routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
