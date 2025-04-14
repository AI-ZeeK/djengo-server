/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Chat,
  ChatType,
  Message,
  MessageStatus,
  MessageType,
} from '@internal/prisma-main';
import { UserAuthorizedRequest } from 'src/interfaces/user.interface';
import { FileService } from '../file/file.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async getChatHistory(chat_id: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          chat_id,
        },
        include: {
          messages: {
            orderBy: {
              created_at: 'asc',
            },
            include: {
              sender: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
              read_receipts: {
                include: {
                  user: {
                    select: {
                      user_id: true,
                      first_name: true,
                      last_name: true,
                    },
                  },
                },
              },
            },
          },
          participants: {
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Transform the messages to include read receipts in a more usable format
      const messagesWithReadReceipts = chat.messages.map((message) => {
        const readBy = message.read_receipts.map((read) => ({
          user_id: read.user.user_id,
          name: `${read.user.first_name} ${read.user.last_name}`.trim(),
          read_at: read.read_at,
        }));

        return {
          ...message,
          read_receipts: readBy,
          // Remove the original MessageRead array to clean up the response
        };
      });

      return {
        ...chat,
        messages: messagesWithReadReceipts,
      };
    } catch (error) {
      this.logger.error(`Error getting chat history: ${error.message}`);
      throw new Error('Failed to get chat history');
    }
  }

  async getMessages({
    chat_id,
    req_user,
  }: {
    chat_id: string;
    req_user: UserAuthorizedRequest;
  }) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          chat_id,
        },
        include: {
          read_receipts: {
            where: {
              user_id: {
                not: req_user.user.user_id,
              },
            },
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      return messages;
    } catch (error) {
      this.logger.error(`Error getting messages: ${error.message}`);
      throw new BadRequestException('Failed to get messages');
    }
  }

  async getChats({ user_id }: { user_id: string }) {
    console.log('Getting chats for user_id', user_id);
    try {
      // Get all chats where user is a participant
      const chats = await this.prisma.chat.findMany({
        where: {
          participants: {
            some: {
              user_id,
            },
          },
        },
        include: {
          participants: {
            where: {
              user_id: {
                not: user_id,
              },
            },
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1, // Get only the latest message
          },
          unread_message_counts: {
            where: {
              user_id,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
      });

      // Format the chat data for the client
      const formattedChats = chats.map((chat) => {
        // For direct chats, set the name to the other participant's name
        let chatName = chat.name;
        if (chat.chat_type === 'DIRECT') {
          const otherParticipant = chat.participants.find(
            (p) => p.user_id !== user_id,
          );
          if (otherParticipant) {
            const user = otherParticipant.user;
            chatName = `${user.first_name} ${user.last_name}`.trim();
          }
        }

        // Get unread count
        const unreadCount = chat.unread_message_counts[0]?.count || 0;

        return {
          ...chat,
          name: chatName,
          unread_count: unreadCount,
        };
      });

      return formattedChats;
    } catch (error) {
      this.logger.error(`Error getting chats: ${error.message}`);
      throw new Error('Failed to get chats');
    }
  }

  async isParticipant(chat_id: string, user_id: string): Promise<boolean> {
    const participant = await this.prisma.chatParticipant.findFirst({
      where: {
        chat_id,
        user_id,
      },
    });
    return !!participant; // Returns true if the user is a participant
  }

  async leaveChat(chat_id: string, user_id: string) {
    await this.prisma.chatParticipant.deleteMany({
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
    type: MessageType;
    duration?: number; // For audio messages
  }) {
    const { chat_id, sender_id, content, type, duration } = data;


    const messageData: any = {
      chat_id,
      sender_id,
      content,
      type,
      status: MessageStatus.SENT,
    };

    // Add duration for audio messages
    if (type === MessageType.AUDIO && duration) {
      messageData.duration = duration;
    }

    const message = await this.prisma.message.create({
      data: messageData,
      include: {
        sender: true, // Include sender details
      },
    });

    // Increment unread count for other participants
    await this.prisma.chatParticipant.updateMany({
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

  // Helper methods for content validation
  private isValidImageUrl(url: string): boolean {
    // Basic validation - check if it's a URL and has an image extension
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      return (
        path.endsWith('.jpg') ||
        path.endsWith('.jpeg') ||
        path.endsWith('.png') ||
        path.endsWith('.gif') ||
        path.endsWith('.webp') ||
        path.endsWith('.svg')
      );
    } catch {
      // If it's a base64 image
      return url.startsWith('data:image/');
    }
  }

  private isValidAudioContent(content: string): boolean {
    // Check if it's a valid audio URL or base64 content
    try {
      const parsedUrl = new URL(content);
      const path = parsedUrl.pathname.toLowerCase();
      return (
        path.endsWith('.mp3') ||
        path.endsWith('.wav') ||
        path.endsWith('.ogg') ||
        path.endsWith('.m4a')
      );
    } catch {
      // If it's a base64 audio
      return content.startsWith('data:audio/');
    }
  }

  async markMessagesAsRead(
    chat_id: string,
    user_id: string,
  ): Promise<string[]> {
    try {
      // Get all messages in the chat that:
      // 1. Haven't been read by this user yet
      // 2. Were not sent by this user (no need to mark your own messages as read)
      const unreadMessages = await this.prisma.message.findMany({
        where: {
          chat_id,
          sender_id: {
            not: user_id, // Only mark messages from other users as read
          },
          read_receipts: {
            none: {
              user_id, // No read receipt from this user yet
            },
          },
        },
        select: {
          message_id: true,
        },
      });

      const messageIds = unreadMessages.map((msg) => msg.message_id);

      if (messageIds.length > 0) {
        // Create read receipts for all unread messages
        await this.prisma.messageRead.createMany({
          data: messageIds.map((message_id) => ({
            message_id,
            user_id,
            read_at: new Date(),
          })),
          skipDuplicates: true, // Prevent unique constraint violations
        });

        // Reset unread count for this participant
        await this.prisma.chatParticipant.updateMany({
          where: {
            chat_id,
            user_id: user_id,
          },
          data: {
            unread_count: 0,
          },
        });
      }

      // Return the IDs of the messages that were marked as read
      return messageIds;
    } catch (error) {
      this.logger.error(
        `Error marking messages as read: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to mark messages as read');
    }
  }

  // Add methods to create new chats
  async createDirectChat({
    creator_id,
    participant_id,
  }: {
    creator_id: string;
    participant_id: string;
  }): Promise<Chat> {
    try {
      // Check if a direct chat already exists between these users
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          chat_type: ChatType.DIRECT,
          participants: {
            every: {
              user_id: {
                in: [creator_id, participant_id],
              },
            },
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (existingChat) {
        return existingChat;
      }

      // Create a new direct chat
      const newChat = await this.prisma.chat.create({
        data: {
          chat_type: 'DIRECT',
          participants: {
            create: [{ user_id: creator_id }, { user_id: participant_id }],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return newChat;
    } catch (error) {
      this.logger.error(`Error creating direct chat: ${error.message}`);
      throw new Error('Failed to create direct chat');
    }
  }

  async createGroupChat(
    creatorId: string,
    name: string,
    participantIds: string[],
  ): Promise<Chat> {
    try {
      // Ensure the creator is included in participants
      if (!participantIds.includes(creatorId)) {
        participantIds.push(creatorId);
      }

      // Create a new group chat
      const newChat = await this.prisma.chat.create({
        data: {
          chat_type: ChatType.GROUP,
          name: name,
          participants: {
            create: participantIds.map((userId) => ({
              user_id: userId,
              is_admin: userId === creatorId, // Make the creator an admin
            })),
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      // Create a system message indicating the group was created
      await this.prisma.message.create({
        data: {
          chat_id: newChat.chat_id,
          sender_id: creatorId,
          content: `${name} group was created`,
          type: MessageType.SYSTEM,
        },
      });

      return newChat;
    } catch (error) {
      this.logger.error(`Error creating group chat: ${error.message}`);
      throw new Error('Failed to create group chat');
    }
  }

  async getParticipants(chat_id: string) {
    const participants = await this.prisma.chatParticipant.findMany({
      where: {
        chat_id,
      },
      include: {
        user: true,
      },
    });
    return participants;
  }

  async updateMessageStatus({
    recipient_id,
    from_status,
    to_status,
  }: {
    recipient_id: string;
    from_status: MessageStatus;
    to_status: MessageStatus;
  }) {
    try {
      // Find all chats where the user is a participant
      const chats = await this.prisma.chat.findMany({
        where: {
          participants: {
            some: {
              user_id: recipient_id,
            },
          },
        },
        select: {
          chat_id: true,
        },
      });

      const chatIds = chats.map((chat) => chat.chat_id);

      // Find all messages in these chats that have the from_status and were not sent by this user
      const messages = await this.prisma.message.findMany({
        where: {
          chat_id: {
            in: chatIds,
          },
          sender_id: {
            not: recipient_id, // Only update messages sent by others
          },
          status: from_status,
        },
        select: {
          message_id: true,
          chat_id: true,
          sender_id: true,
        },
      });

      // Update the status of these messages
      if (messages.length > 0) {
        await this.prisma.message.updateMany({
          where: {
            message_id: {
              in: messages.map((m) => m.message_id),
            },
          },
          data: {
            status: to_status,
          },
        });
      }

      return messages;
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      throw new Error('Failed to update message status');
    }
  }
  async updateStatus({
    message_id,
    to_status,
  }: {
    message_id: string;
    to_status: MessageStatus;
  }) {
    try {
      const message = await this.prisma.message.update({
        where: {
          message_id: message_id,
        },
        data: {
          status: to_status,
        },
        include: {
          sender: true, // Include sender details
        },
      });

      return message;
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      throw new Error('Failed to update message status');
    }
  }

  // Add this method to get message status in real-time
  async getMessageStatus(message_id: string) {
    try {
      const message = await this.prisma.message.findUnique({
        where: {
          message_id,
        },
        include: {
          read_receipts: {
            include: {
              user: {
                select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      });

      if (!message) {
        throw new Error('Message not found');
      }

      // Determine message status based on read receipts
      let status = message.status;

      // If there are read receipts, the message is at least delivered
      if (message.read_receipts.length > 0) {
        status = MessageStatus.DELIVERED;
      }

      return {
        message_id: message.message_id,
        status,
        read_receipts: message.read_receipts,
      };
    } catch (error) {
      this.logger.error(`Error getting message status: ${error.message}`);
      throw new Error('Failed to get message status');
    }
  }

  // Add this method to handle file uploads in messages
  async sendMessageWithFile(data: {
    chat_id: string;
    sender_id: string;
    content: string;
    type: MessageType;
    duration?: number;
  }) {
    const { chat_id, sender_id, content, type, duration } = data;

    let finalContent = content;

    // If the content is a base64 string, upload it to Cloudinary
    if (type === MessageType.IMAGE && content.startsWith('data:image/')) {
      finalContent = await this.fileService.uploadBase64File(
        content,
        'image',
        sender_id,
      );
    }

    if (type === MessageType.AUDIO && content.startsWith('data:audio/')) {
      finalContent = await this.fileService.uploadBase64File(
        content,
        'audio',
        sender_id,
      );
    }

    // Create the message with the file URL
    const messageData: any = {
      chat_id,
      sender_id,
      content: finalContent,
      type,
      status: MessageStatus.SENT,
    };

    if (type === MessageType.AUDIO && duration) {
      messageData.duration = duration;
    }

    const message = await this.prisma.message.create({
      data: messageData,
      include: {
        sender: true,
      },
    });

    // Increment unread count for other participants
    await this.prisma.chatParticipant.updateMany({
      where: {
        chat_id,
        user_id: { not: sender_id },
      },
      data: {
        unread_count: { increment: 1 },
      },
    });

    return message;
  }
}
