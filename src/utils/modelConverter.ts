import { ChatDAO } from "../database/models/chat";
import { RoomDAO } from "../database/models/rooms";
import { Chat, Room } from "../types/types";

class ModelConverter {
    static toRoom(rooms: RoomDAO[]): Room[] {

        const roomsData: Room[] = [];
        rooms.map((room) => {
            roomsData.push({
                programId: room.programId,
                programName: room.programName,
                episodeName: room.episodeName,
                channelName: room.channelName,
            })
        })

        return roomsData;
    }
}

export default ModelConverter;
