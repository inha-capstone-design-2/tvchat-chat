import {IsNumber, IsString,} from 'class-validator';
import { MakeRoomForm } from "../types";

class MakeRoomDto {
    @IsNumber()
    programId: number;

    @IsString()
    channelName: string;

    @IsString()
    programName: string;

    @IsString()
    episodeName: string;

    constructor(obj: MakeRoomDto) {
        this.programId = obj.programId;
        this.channelName = obj.channelName;
        this.programName = obj.programName;
        this.episodeName = obj.episodeName;
    }

    toServiceModel(): MakeRoomForm {
        return {
            programId: this.programId,
            channelName: this.channelName,
            programName: this.programName,
            episodeName: this.episodeName,


        };
    }
}

export default MakeRoomDto;
