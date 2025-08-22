require('dotenv').config({ path: './config/dev.env' }); 

const {app , io} = require('./app');
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});          
