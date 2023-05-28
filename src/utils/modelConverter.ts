import { ChatDAO } from "../database/models/chat";
import { RoomDAO } from "../database/models/rooms";
import { Chat, Room } from "../types/types";
import app from "../app";

class ModelConverter {
    static toRoom(rooms: RoomDAO[]): Room[] {

        const onlineMap = app.get('onlineMap');

        const roomsData: Room[] = [];
        rooms.map((room) => {

            roomsData.push({
                programId: room.programId,
                programName: room.programName,
                episodeName: room.episodeName,
                channelName: room.channelName,
                viewers: Object.keys(onlineMap[`room${room.programId}`]).length
            })
        })

        return roomsData;
    }
}

export default ModelConverter;
