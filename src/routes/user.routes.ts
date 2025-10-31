import { Router } from "express";
import * as userController from "../controllers/user.controller";

const router = Router();

router.post("/", userController.create);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

export default router;