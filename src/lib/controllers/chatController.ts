import express from 'express';
import ChatService from '../services/chatService';
import SendChatDto from "../../types/requestTypes/sendChat.dto";
import {validateOrReject} from "class-validator";
import MakeRoomDto from "../../types/requestTypes/makeRoom.dto";


const router = express.Router();
const chatService = ChatService.getInstance();

router.post('/', async(req, res, next) => {
    try {
        const sendChatDto = new SendChatDto(req.body);

        await validateOrReject(sendChatDto);

        await chatService.sendChat(sendChatDto.toServiceModel());

        res.send({ success: true });
    } catch (error) {
        next(error);
    }
})

router.get('/:roomId', async(req, res, next) => {
    try {
        const chats = await chatService.getChat(req.params.roomId);

        res.send({ data: chats });
    } catch (error) {
        next(error);
    }
})


router.get('/rooms', async(req, res, next) => {
    try {
        const rooms = await chatService.getRooms();

        res.send({ data: rooms });
    } catch (error) {
        next(error);
    }
})


router.post('/room', async(req, res, next) => {
    try {
        const makeRoomDto = new MakeRoomDto(req.body);

        await validateOrReject(makeRoomDto);

        await chatService.makeRoom(makeRoomDto.toServiceModel());

        res.send({ success: true });
    } catch (error) {
        next(error);
    }
})

export default router;
