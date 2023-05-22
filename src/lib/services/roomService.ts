import app from "../../app";
import {MakeRoomForm, Room} from "../../types/types";
import WinstonLogger from "../../utils/logger";
import Redis from "../../utils/redis";
import cron from "node-cron";
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

        const isRoom = await RoomModel.findOne({ programId, deletedAt : { $gt: new Date() } });

        if(isRoom) {
            throw new Error("이미 존재하는 채팅방 입니다!")
        }

        const roomName = `room${programId}`;

        const onlineMap = app.get('onlineMap');

        onlineMap[roomName] = {};

        const originalDateTime = new Date(endTime);

        const cronMinute = originalDateTime.getUTCMinutes();
        const cronHour = originalDateTime.getUTCHours();
        const cronDay = originalDateTime.getUTCDate();
        const cronMonth = originalDateTime.getUTCMonth() + 1;

        const cronExpression = `${cronMinute} ${cronHour} ${cronDay} ${cronMonth} *`;

        cron.schedule(cronExpression, () => {
            try {
                delete onlineMap[roomName];
                logger.info(`${roomName} 채팅방 삭제`);
            } catch (error) {
                console.error(error);
            }
        });

        await new RoomModel({
            programId,
            programName,
            episodeName,
            channelName,
            deletedAt: endTime
        }).save();

        logger.info(`${roomName} 채팅방 생성`);
    }

    async getRooms(): Promise<Room[]> {

        const currentDateTime = new Date();
        const modifiedDateTime = new Date(currentDateTime.getTime() + (9 * 60 * 60 * 1000));

        const rooms = await RoomModel.find({ deletedAt : { $gt: modifiedDateTime }});

        return ModelConverter.toRoom(rooms);
    }

}

export default RoomService;
