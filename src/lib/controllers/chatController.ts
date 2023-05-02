import express from 'express';
import ChatService from '../services/chatService';

const router = express.Router();
const userService = ChatService.getInstance();

export default router;
