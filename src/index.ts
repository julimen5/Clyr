import app from '@/server';

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

export default server;
