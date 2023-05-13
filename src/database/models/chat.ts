import { Model, model, Schema } from 'mongoose';

interface ChatDAO {
    nickname: string;
    userId: number;
    roomId: number;
    text: string;
    image: boolean;
    imageUri?: string;
    createdAt: Date;
}

type ChatDAOModel = Model<ChatDAO>;

const chatSchema = new Schema<ChatDAO, ChatDAOModel>(
    {
        nickname: { type: String, required: true },
        userId: { type: Number, required: true },
        roomId: { type: Number, required: true },
        text: { type: String, required: true },
        image: { type: Boolean, required: true },
        imageUri: { type: String },
    },
    {
        timestamps: true,
    }
);

const ChatModel = model<ChatDAO, ChatDAOModel>('Chat', chatSchema);

export { ChatModel, ChatDAO };
