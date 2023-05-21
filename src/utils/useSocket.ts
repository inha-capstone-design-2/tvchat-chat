import { Server } from "socket.io";
import Redis from './redis';
import WinstonLogger from './logger';
import http from "http";
import { Application } from "express";

const redisClient = Redis.getInstance().getClient();

const logger = WinstonLogger.getInstance();

interface OnlineMap {
    [key: string]: { [key: string]: number };
}

const onlineMap: OnlineMap = {};

export default (server: http.Server, app: Application) => {
    // if (Object.keys(onlineMap).length === 0) {
    //     //서버가 재시작해서 이게 비어있을 경우
    //     redisClient.get('users', async (err, data) => {
    //         console.log('redisNo:', data);
    //     });
    // } else {
    //     redisClient.get('users', async (err, data) => {
    //         console.log('redisYes:', data);
    //     });
    // }

    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
        },
    });

    app.set('io', io);
    app.set('onlineMap', onlineMap);

    io.on('connect', async (socket) => {
        socket.on('joinRoom', (roomId:number, userId : number) => {

            const roomName = `room${roomId}`;

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

