/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async getChatHistory(chat_id: string) {
    return this.prisma.message.findMany({
      where: { chat_id },
      include: {
        sender: true, // Include sender details
      },
      orderBy: {
        created_at: 'asc', // Oldest messages first
      },
    });
  }
  async isParticipant(chat_id: string, user_id: string): Promise<boolean> {
    const participant = await this.prisma.participant.findFirst({
      where: {
        chat_id,
        user_id,
      },
    });
    return !!participant; // Returns true if the user is a participant
  }
  async leaveChat(chat_id: string, user_id: string) {
    await this.prisma.participant.deleteMany({
      where: {
        chat_id,
        user_id,
      },
    });
  }
  async sendMessage(data: {
    chat_id: string;
    sender_id: string;
    content: string;
  }) {
    const { chat_id, sender_id, content } = data;

    // Save the message to the database
    const message = await this.prisma.message.create({
      data: {
        chat_id,
        sender_id,
        content,
      },
      include: {
        sender: true, // Include sender details
      },
    });

    await this.prisma.participant.updateMany({
      where: {
        chat_id,
        user_id: { not: sender_id }, // Exclude the sender
      },
      data: {
        unread_count: { increment: 1 },
      },
    });

    return message;
  }

  async markMessagesAsRead(chat_id: string, user_id: string) {
    // Reset unread_count for the user in this chat
    await this.prisma.participant.updateMany({
      where: {
        chat_id,
        user_id,
      },
      data: {
        unread_count: 0,
      },
    });
  }
}
