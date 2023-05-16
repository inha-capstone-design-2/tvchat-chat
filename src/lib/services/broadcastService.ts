import app from "../../app";
import { ReceiveChatForm, SendChatForm} from "../../types/types";
import {ChatModel} from "../../database/models/chat";

class BroadcastService {
    private static instance: BroadcastService;

    private constructor() {}

    public static getInstance(): BroadcastService {
        if (!BroadcastService.instance) {
            BroadcastService.instance = new BroadcastService();
        }
        return BroadcastService.instance;
    }
}

export default BroadcastService;
