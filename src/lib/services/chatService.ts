import app from "../../app";
import {MakeRoomForm, ReceiveChatForm, Room, SendChatForm} from "../../types/types";
import {ChatModel} from "../../database/models/chat";
import WinstonLogger from "../../utils/logger";
import Redis from "../../utils/redis";
import {RoomModel} from "../../database/models/rooms";

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

    /**
     * @param makeRoomForm
     */
    async makeRoom(makeRoomForm: MakeRoomForm): Promise<void> {

        const { programId, programName, episodeName, channelName } = makeRoomForm;

        const isRoom = await RoomModel.findOne({ programId });

        if(isRoom) {
            throw new Error("이미 존재하는 채팅방 입니다!")
        }

        await new RoomModel({
            programId,
            programName,
            episodeName,
            channelName,
        }).save();

        const roomName = `room${programId}`;

        const onlineMap = app.get('onlineMap');

        onlineMap[roomName] = {};

        logger.info(`${roomName} 채팅방 생성`);
    }

    async getRooms(): Promise<Room[]> {

        const onlineMap = app.get('onlineMap');

        const rooms = await RoomModel.find();

        return rooms;
    }
}

export default ChatService;
