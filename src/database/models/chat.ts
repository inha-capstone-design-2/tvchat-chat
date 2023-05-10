import { Model, model, Schema } from 'mongoose';

interface ChatDAO {
    senderId: number;
    roomId: number;
}

type ChatDAOModel = Model<ChatDAO>;

const chatSchema = new Schema<ChatDAO, ChatDAOModel>(
    {
        senderId: { type: Number, required: true },
        roomId: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const ChatModel = model<ChatDAO, ChatDAOModel>('Chat', chatSchema);

export { ChatModel, ChatDAO };
