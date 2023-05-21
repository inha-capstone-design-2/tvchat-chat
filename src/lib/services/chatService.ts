import app from "../../app";
import {MakeRoomForm, ReceiveChatForm, Room, SendChatForm} from "../../types/types";
import {ChatModel} from "../../database/models/chat";
import WinstonLogger from "../../utils/logger";
import Redis from "../../utils/redis";

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

        const onlineMap = app.get('onlineMap');

        const roomName = `room${programId}`;

        const isRoom = await redisClient.hGetAll(`${roomName}`);

        //
        // if(isRoom) {
        //     throw new Error("해당 프로그램에 대한 채팅방이 이미 존재합니다")
        // }

        await redisClient.hSet(roomName, {
            programName,
            episodeName,
            channelName,
        });

        onlineMap[roomName] = {};

        logger.info(`${roomName} 채팅방 생성`);
    }

    async getRooms(): Promise<Room[]> {

        const onlineMap = app.get('onlineMap');

        const roomNames = Object.keys(onlineMap);

        const rooms : Room[] = [];
        roomNames.map(async (roomName: string) => {
            const { programName, episodeName, channelName } = await redisClient.hGetAll(`${roomName}`);

            const programId = parseInt(roomName.match(/\d+/)![0]);

            const room : Room = { programId, programName, episodeName, channelName };

            rooms.push(room);
        })

        return rooms;
    }
}

export default ChatService;
