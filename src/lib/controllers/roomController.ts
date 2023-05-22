import express from 'express';
import RoomService from '../services/roomService';
import SendChatDto from "../../types/requestTypes/sendChat.dto";
import {validateOrReject} from "class-validator";
import MakeRoomDto from "../../types/requestTypes/makeRoom.dto";

const router = express.Router();
const roomService = RoomService.getInstance();

router.get('/', async(req, res, next) => {
    try {
        const rooms = await roomService.getRooms();

        res.send({ data: rooms });
    } catch (error) {
        next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const makeRoomDto = new MakeRoomDto(req.body);

        await validateOrReject(makeRoomDto);

        await roomService.makeRoom(makeRoomDto.toServiceModel());

        res.send({ success: true });
    } catch (error) {
        next(error);
    }
})

export default router;
