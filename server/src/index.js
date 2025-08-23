require('dotenv').config({ path: './config/dev.env' }); 

const {app , server} = require('./app');
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log('Server is up on port ' + port);
});          
