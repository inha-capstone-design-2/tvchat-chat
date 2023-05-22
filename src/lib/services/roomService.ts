import app from "../../app";
import {MakeRoomForm, Room} from "../../types/types";
import WinstonLogger from "../../utils/logger";
import Redis from "../../utils/redis";

import {RoomModel} from "../../database/models/rooms";

import ModelConverter from "../../utils/modelConverter";

const redisClient = Redis.getInstance().getClient();
const logger = WinstonLogger.getInstance();

class RoomService {
    private static instance: RoomService;

    private constructor() {}

    public static getInstance(): RoomService {
        if (!RoomService.instance) {
            RoomService.instance = new RoomService();
        }
        return RoomService.instance;
    }

    /**
     * @param makeRoomForm
     */
    async makeRoom(makeRoomForm: MakeRoomForm): Promise<void> {

        const { programId, programName, episodeName, channelName, endTime } = makeRoomForm;

        const isRoom = await RoomModel.findOne({ programId });

        if(isRoom) {
            throw new Error("이미 존재하는 채팅방 입니다!")
        }

        await new RoomModel({
            programId,
            programName,
            episodeName,
            channelName,
            deletedAt: endTime
        }).save();

        const roomName = `room${programId}`;

        const onlineMap = app.get('onlineMap');

        onlineMap[roomName] = {};

        // TODO:cron-job으로 채팅방 닫기

        logger.info(`${roomName} 채팅방 생성`);
    }

    async getRooms(): Promise<Room[]> {

        const rooms = await RoomModel.find({ deletedAt : { $gt: new Date() }});

        return ModelConverter.toRoom(rooms);
    }
}

export default RoomService;
