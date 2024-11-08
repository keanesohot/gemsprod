import Guest from "../models/guest.model";
import jwt from "jsonwebtoken";

export const regis_guest = async (payload: { name: string }) => {
    try {
        const key = process.env.TOKEN_KEY || "kimandfamily";

        const newGuest = await Guest.create({ name: payload.name });
        console.log("New guest created:", newGuest);
        const token = jwt.sign({ id: newGuest._id, role: 'guest' }, key);
        return token;
    } catch (error) {
        console.error('Error adding guest:', error);
        throw error;
    }
};

export const findGuestById = async (ObjectId: string) => {
    try {
        const guest = await Guest.findById(ObjectId);
        return guest;
    } catch (error) {
        console.error('Error finding guest:', error);
        throw error;
    }
}

export const getAllGuests = async () => {
    try {
        const guests = await Guest.find();
        return guests;
    } catch (error) {
        console.error('Error finding guests:', error);
        throw error;
    }
}

export const getGuestById = async (ObjectId: string) => {
    try {
        const guest = await Guest.findById(ObjectId);
        if (!guest) {
            throw new Error('Guest not found');
        }
        return guest;
    } catch (error) {
        console.log('Error finding guest:', error);
        throw error;
    }
};