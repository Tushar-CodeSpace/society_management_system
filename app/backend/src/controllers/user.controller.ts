import type { Request, Response } from "express";
import * as userService from "../services/user.service";

export const create = async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
}

export const findAll = async (_: Request, res: Response) => {
    const users = await userService.getUser();
    res.status(200).json(users);
}

export const findOne = async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id!);
    res.status(200).json(user);
}

export const update = async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id!, req.body);
    res.status(200).json(user);
}

export const remove = async (req: Request, res: Response) => {
    const user = await userService.deleteUser(req.params.id!);
    res.status(204).json(user);
}