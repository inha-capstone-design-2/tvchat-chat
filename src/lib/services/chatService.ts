import app from "../../app";
import {MakeRoomForm, ReceiveChatForm, Room, SendChatForm} from "../../types/types";
import WinstonLogger from "../../utils/logger";
import Redis from "../../utils/redis";

import {ChatModel} from "../../database/models/chat";
import {RoomModel} from "../../database/models/rooms";

import ModelConverter from "../../utils/modelConverter";
const redisClient = Redis.getInstance().getClient();
const logger = WinstonLogger.getInstance();

class ChatService {
    private static instance: ChatService;

    private constructor() {}

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    /**
     * @param sendChatForm
     */
    async sendChat(sendChatForm: SendChatForm): Promise<boolean> {
        const { nickname, userId, programId, text, image, imageUri } = sendChatForm;

        const io = app.get('io');
        io.of('/').to(`room${programId}`).emit('message',sendChatForm);

        await new ChatModel({
            nickname,
            userId,
            programId,
            text,
            image,
            imageUri
        }).save();

        return true;
    }

    /**
     * @param programId
     */
    async getChat(programId: string): Promise<ReceiveChatForm[]> {
       const chats = await ChatModel.find({programId});

       return chats.map((chat) => ({
           nickname: chat.nickname,
           userId: chat.userId,
           programId: chat.programId,
           text: chat.text ? chat.text : null,
           image: chat.image,
           imageUri: chat.imageUri ? chat.imageUri : null,
           timeline: chat.createdAt,
       }))
    }
}

export default ChatService;
