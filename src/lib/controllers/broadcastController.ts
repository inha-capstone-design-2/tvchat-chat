import express from 'express';
import BroadcastService from '../services/broadcastService';
const router = express.Router();

const broadcastService = BroadcastService.getInstance();

router.get('/schedules', async(req, res, next) => {
    try {
        const schedules = await broadcastService.getSchedules();

        res.json({ data: schedules });
    } catch (error) {
        next(error);
    }
})

router.get('/', async(req, res, next) => {
    try {
        const schedules = await broadcastService.getSchedule();

        res.json({ data: schedules });
    } catch (error) {
        next(error);
    }
})


export default router;
