import express from 'express';
import ChatService from '../services/chatService';
import SendChatDto from "../../types/requestTypes/sendChat.dto";
import {validateOrReject} from "class-validator";


const router = express.Router();
const chatService = ChatService.getInstance();

router.post('/', async(req, res, next) => {
    try {
        const sendChatDto = new SendChatDto(req.body);

        await validateOrReject(sendChatDto);

        await chatService.sendChat(sendChatDto.toServiceModel());

        res.send({ data: true });
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
export default router;
