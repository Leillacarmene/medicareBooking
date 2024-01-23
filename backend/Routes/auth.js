import Express from "express";
import { register, login } from "../Controllers/authController.js";

// const router = express.Router();
const router = Express.Router()

router.post('/register', register);
router.post('/login', login);


export default router;
