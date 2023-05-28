import { Server } from "socket.io";
import Redis from './redis';
import WinstonLogger from './logger';
import http from "http";
import { Application } from "express";
import {RoomModel} from "../database/models/rooms";

const redisClient = Redis.getInstance().getClient();

const logger = WinstonLogger.getInstance();

interface OnlineMap {
    [key: string]: { [key: string]: number };
}

const onlineMap: OnlineMap = {};

export default (server: http.Server, app: Application) => {
    if (Object.keys(onlineMap).length === 0) {
        (async () => {
            const currentDateTime = new Date();
            const modifiedDateTime = new Date(currentDateTime.getTime() + (9 * 60 * 60 * 1000));

            const rooms = await RoomModel.find({ deletedAt : { $gt: modifiedDateTime }});

            rooms.map((room) => {
                const roomName = `room${room.programId}`;
                onlineMap[roomName] = {};
            })
        })();
    }

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
        },
    });

    app.set('io', io);
    app.set('onlineMap', onlineMap);

    io.on('connect', async (socket) => {
        socket.on('joinRoom', (programId:number, userId : number) => {

            const roomName = `room${programId}`;

            socket.join(roomName);

            if (!onlineMap[roomName]) {
                throw new Error("존재하지 않는 채팅방 입니다")
            }

            onlineMap[roomName][socket.id] = userId;

            logger.info(`${userId} 번 유저 ${roomName} 채팅방 입장`);

            // TODO:redis에 저장
        });

        socket.on('leaveRoom', (roomId, userId) => {
            const roomName = `room${roomId}`;

            socket.leave(roomName);

            if (onlineMap[roomName]) {
                delete onlineMap[roomName][socket.id];
            }

            logger.info(`${userId} 번 유저 ${roomName} 채팅방 나감`);

            // TODO:redis에서 삭제
        })


        socket.on('disconnect', async () => {

        });
    });
};

