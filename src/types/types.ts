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
    roomId: number;
    text: string | null;
    image: boolean;
    imageUri: string | null;
}

type ReceiveChatForm = {
    nickname: string,
    userId: number;
    roomId: number;
    text: string | null;
    image: boolean;
    imageUri: string | null;
    timeline: Date;
}

type ProgramSchedule =  { program: string, startTime: string }

type BroadcastSchedule = { [key: string]: ProgramSchedule[] };

export type {
    Chat,
    SendChatForm,
    ReceiveChatForm,
    ProgramSchedule,
    BroadcastSchedule
}
