import app from "../../app";
import { ReceiveChatForm, SendChatForm} from "../../types/types";
import {ChatModel} from "../../database/models/chat";

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
        const { nickname, userId, roomId, text, image, imageUri } = sendChatForm;

        const io = app.get('io');
        io.of('/').to(`room${roomId}`).emit('message',sendChatForm);

        await new ChatModel({
            nickname,
            userId,
            roomId,
            text,
            image,
            imageUri
        }).save();

        return true;
    }

    /**
     * @param roomId
     */
    async getChat(roomId: string): Promise<ReceiveChatForm[]> {
       const chats = await ChatModel.find({roomId});

       return chats.map((chat) => ({
           nickname: chat.nickname,
           userId: chat.userId,
           roomId: chat.roomId,
           text: chat.text ? chat.text : null,
           image: chat.image,
           imageUri: chat.imageUri ? chat.imageUri : null,
           timeline: chat.createdAt,
       }))
    }
}

export default ChatService;
