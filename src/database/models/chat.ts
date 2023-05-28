import { Model, model, Schema } from 'mongoose';

interface ChatDAO {
    nickname: string;
    userId: number;
    programId: number;
    text?: string;
    image: boolean;
    imageUri?: string;
    createdAt: Date;
}

type ChatDAOModel = Model<ChatDAO>;

const chatSchema = new Schema<ChatDAO, ChatDAOModel>(
    {
        nickname: { type: String, required: true },
        userId: { type: Number, required: true },
        programId: { type: Number, required: true },
        text: { type: String },
        image: { type: Boolean, required: true },
        imageUri: { type: String },
    },
    {
        timestamps: true,
    }
);

const ChatModel = model<ChatDAO, ChatDAOModel>('Chat', chatSchema);

export { ChatModel, ChatDAO };
