const app = require("../index");
const dotenv = require("dotenv");
require("../config/db");

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
