const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/db/db');

dotenv.config();

// DB connect
connectDB();




app.listen(process.env.PORT, () => {
  console.log(`Server running on port 3000`);
});