import {IsDateString, IsNumber, IsString,} from 'class-validator';
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

    @IsDateString()
    endTime: Date;

    constructor(obj: MakeRoomDto) {
        this.programId = obj.programId;
        this.channelName = obj.channelName;
        this.programName = obj.programName;
        this.episodeName = obj.episodeName;
        this.endTime = obj.endTime;
    }

    toServiceModel(): MakeRoomForm {
        return {
            programId: this.programId,
            channelName: this.channelName,
            programName: this.programName,
            episodeName: this.episodeName,
            endTime: this.endTime
        };
    }
}

export default MakeRoomDto;
