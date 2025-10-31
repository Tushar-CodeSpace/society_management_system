import User from "../models/user.model";
import type { CreateUserDto } from "../dto/createUser.dto";
import type { UpdateUserDto } from "../dto/updateUser.dto";

export const createUser = async (data: CreateUserDto) => {
    return await User.create(data);
}

export const getUser = async () => {
    return await User.find();
}

export const getUserById = async (id: string) => {
    return await User.findById(id);
}

export const updateUser = async (id: string, data: UpdateUserDto) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
}

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
}