import {IsBoolean, IsNumber, IsString} from 'class-validator';
import { SendChatForm } from "../types";

class SendChatDto {
    @IsString()
    nickname: string;

    @IsNumber()
    userId: number;

    @IsNumber()
    roomId: number;

    text: string | null;

    @IsBoolean()
    image: boolean;

    imageUri: string | null;

    constructor(obj: SendChatDto) {
        this.nickname = obj.nickname;
        this.userId = obj.userId;
        this.roomId = obj.roomId;
        this.text = obj.text;
        this.image = obj.image;
        this.imageUri = obj.imageUri;
    }

    toServiceModel(): SendChatForm {
        return {
            nickname: this.nickname,
            userId: this.userId,
            roomId: this.roomId,
            text: this.text,
            image: this.image,
            imageUri: this.imageUri
        };
    }
}

export default SendChatDto;
