import { Model, model, Schema } from 'mongoose';

interface ProgramDAO {
    program:string;
    broadcastor:string;
    startTime: Date;
    endTime: Date;
}

type ProgramDAOModel = Model<ProgramDAO>;

const programSchema = new Schema<ProgramDAO, ProgramDAOModel>(
    {
        program: { type: String, required: true },
        broadcastor: { type: String, required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

const ProgramModel = model<ProgramDAO, ProgramDAOModel>('Program', programSchema);

export { ProgramModel, ProgramDAO };
