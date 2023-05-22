import { Model, model, Schema } from 'mongoose';

interface RoomDAO {
    programId: number;
    channelName: string;
    programName: string;
    episodeName: string;
    deletedAt: Date;
}

type RoomDAOModel = Model<RoomDAO>;

const roomSchema = new Schema<RoomDAO, RoomDAOModel>(
    {
        programId: { type: Number, required: true },
        channelName: { type: String, required: true },
        programName: { type: String, required: true },
        episodeName: { type: String, required: true },
        deletedAt: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

const RoomModel = model<RoomDAO, RoomDAOModel>('Room', roomSchema);

export { RoomModel, RoomDAO };
