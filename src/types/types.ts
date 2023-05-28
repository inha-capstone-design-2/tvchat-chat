import {IsString} from "class-validator";

type Chat = {
    nickname: string,
    userId: number;
    roomId: number;
    text: string;
    image: boolean;
    imageUri?: string;
    timeline: Date;
}

type SendChatForm = {
    nickname: string,
    userId: number;
    programId: number;
    text: string | null;
    image: boolean;
    imageUri: string | null;
}

type ReceiveChatForm = {
    nickname: string,
    userId: number;
    programId: number;
    text: string | null;
    image: boolean;
    imageUri: string | null;
    timeline: Date;
}

type MakeRoomForm = {
    programId: number;
    channelName: string;
    programName: string;
    episodeName: string;
    endTime: Date;
}

type ProgramSchedule =  { program: string, startTime: Date }

type BroadcastSchedule = { [key: string]: ProgramSchedule[] };

type Room = {
    programId: number;
    programName: string;
    episodeName: string;
    channelName: string;
    viewers: number;
}

export type {
    Chat,
    SendChatForm,
    ReceiveChatForm,
    MakeRoomForm,
    ProgramSchedule,
    BroadcastSchedule,
    Room
}
