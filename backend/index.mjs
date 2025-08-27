// index.mjs
import { app } from "./app.mjs";
import { config } from "./constants/config.mjs";


app.listen(config.PORT, () => {
	console.log(`Server is running on http://localhost:${config.PORT}`);
});
