/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Chat,
  ChatType,
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
        let name = chat.name;
        if (chat.chat_type === 'DIRECT') {
          const otherParticipant = chat.participants.find(
            (p) => p.user_id !== user_id,
          );
          if (otherParticipant) {
            const user = otherParticipant.user;
            name = `${user.first_name} ${user.last_name}`.trim();
          }
        }

        // Get unread count
        const unreadCount = chat.unread_message_counts[0]?.count || 0;

        return {
          ...chat,
          name,
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
    const participant = await this.prisma.chatParticipant.findUnique({
      where: {
        chat_id_user_id: {
        chat_id,
        user_id,
        },
      },
    });

    return !!participant;
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
    try {
      const { chat_id, sender_id, content, type, duration } = data;

      // Validate content based on type
      if (type === MessageType.IMAGE && !this.isValidImageUrl(content)) {
        throw new BadRequestException('Invalid image URL or format');
      }

      if (type === MessageType.AUDIO && !this.isAudioFile(content)) {
        throw new BadRequestException('Invalid audio content');
      }

      // Save the message to the database with appropriate fields
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
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      throw new Error('Failed to send message');
    }
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

  private isAudioFile(path: string): boolean {
    const hasAudioExtension =
      path.endsWith('.mp3') ||
      path.endsWith('.wav') ||
      path.endsWith('.ogg') ||
      path.endsWith('.webm') ||
      path.endsWith('.m4a');

    const isSupabaseAudio =
      path.includes('supabase') && path.includes('/audio/');

    return hasAudioExtension || isSupabaseAudio;
  }

  async markMessagesAsRead(chat_id: string, user_id: string) {
    // Find all unread messages in the chat that were not sent by the user
    const messages = await this.prisma.message.findMany({
        where: {
          chat_id,
          sender_id: {
            not: user_id,
          },
        status: {
          in: [MessageStatus.SENT, MessageStatus.DELIVERED],
            },
          },
      select: {
        message_id: true,
        sender_id: true,
        },
      });

    if (messages.length === 0) {
      return [];
    }

    // Update all messages to read status
    await this.prisma.message.updateMany({
          where: {
        message_id: {
          in: messages.map((m) => m.message_id),
        },
          },
          data: {
        status: MessageStatus.READ,
          },
        });

    // Return the message IDs that were marked as read
    return messages.map((m) => ({
      message_id: m.message_id,
      sender_id: m.sender_id,
    }));
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
      if (!participant_id || !creator_id)
        throw new BadRequestException('Chat Create constrainsts not met');
      console.log('CREATOR_ID', creator_id);
      console.log('participant_id', participant_id);
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
        },
        select: {
          chat_id: true,
        },
      });
      const participant = await this.prisma.chatParticipant.upsert({
        where: {
          chat_id_user_id: {
            chat_id: newChat.chat_id,
            user_id: creator_id,
          },
        },
        update: {
          is_admin: true,
        },
        create: {
          chat_id: newChat.chat_id,
          user_id: creator_id,
          is_admin: true,
        },
      });
      const participant2 = await this.prisma.chatParticipant.upsert({
        where: {
          chat_id_user_id: {
            chat_id: newChat.chat_id,
            user_id: participant_id,
          },
        },
        update: {
          is_admin: true,
        },
        create: {
          chat_id: newChat.chat_id,
          user_id: participant_id,
          is_admin: true,
        },
      });
      console.log('newChat', newChat);
      console.log('participant', participant);
      console.log('participant2', participant2);
      const chat = await this.prisma.chat.findFirst({
        where: {
          chat_id: newChat.chat_id,
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
      return chat!;
    } catch (error) {
      this.logger.error(`Error creating direct chat: ${error.message}`);
      throw new Error('Failed to create direct chat');
    }
  }

  async createGroupChat(
    creator_id: string,
    name: string,
    participant_ids: string[],
  ) {
    return this.createChat({
      chat_type: ChatType.GROUP,
      creator_id,
      participant_ids,
      name,
    });
  }
  async getChatType({ chat_id, user_id }: { chat_id: string; user_id }) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          chat_id,
        },
        include: {
          participants: {
            where: {
              user_id,
            },
            include: {
              user: true,
            },
          },
        },
      });

      if (!chat) throw new NotFoundException();

      const chat_name =
        chat.chat_type === 'DIRECT'
          ? chat.participants[0]?.user?.first_name
            ? `${chat.participants[0]?.user?.first_name} ${chat.participants[0]?.user?.last_name}`
            : chat.participants[0]?.user?.email ||
              chat.participants[0]?.user?.phone_number
          : chat?.name;

      return {
        chat_type: chat.chat_type,
        chat_name,
      };
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      throw new Error('Failed to update message status');
    }
  }

  async getParticipants({ chat_id }: { chat_id: string }) {
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

  async getChat({ chat_id }: { chat_id: string }) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          chat_id,
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      return chat;
    } catch (error) {
      this.logger.error(`Error getting chat: ${error.message}`);
      throw new Error('Failed to get chat');
    }
  }

  // Add this method to get message status in real-time
  async getMessageStatus({ message_id }: { message_id: string }) {
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

  async createChat({
    chat_type,
    creator_id,
    participant_ids,
    name,
  }: {
    chat_type: ChatType;
    creator_id: string;
    participant_ids: string[];
    name?: string;
  }) {
    try {
      this.logger.log(
        `Creating chat with type ${chat_type} and ${participant_ids.length} participants`,
      );

      // Ensure creator is included in participants
      if (!participant_ids.includes(creator_id)) {
        participant_ids.push(creator_id);
      }

      // Remove any duplicate participant IDs
      const uniqueParticipantIds = [...new Set(participant_ids)];

      this.logger.log(
        `Creating chat with ${uniqueParticipantIds.length} unique participants`,
      );

      // Create a new chat with participants
      const newChat = await this.prisma.chat.create({
        data: {
          chat_type,
          name,
          participants: {
            create: uniqueParticipantIds.map((user_id) => ({
              user_id,
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

      this.logger.log(
        `Created chat ${newChat.chat_id} with ${newChat.participants.length} participants`,
      );
      return newChat;
    } catch (error) {
      this.logger.error(`Error creating chat: ${error.message}`);
      throw new BadRequestException(`Failed to create chat: ${error.message}`);
    }
  }

  async getChatMessages(chat_id: string) {
    return this.prisma.message.findMany({
      where: {
        chat_id,
      },
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
      },
    });
  }

  /**
   * Get the last message for a chat
   * @param chat_id The chat ID
   * @returns The last message for the chat
   */
  async getLastMessage({ chat_id }: { chat_id: string }) {
    try {
      const message = await this.prisma.message.findFirst({
        where: {
          chat_id,
        },
        orderBy: {
          created_at: 'desc',
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
        },
      });

      return message;
    } catch (error) {
      this.logger.error(`Error getting last message: ${error.message}`);
      throw new BadRequestException(
        `Failed to get last message: ${error.message}`,
      );
    }
  }

  /**
   * Get the last messages for multiple chats
   * @param chat_ids Array of chat IDs
   * @returns Object with chat_id as key and last message as value
   */
  async getLastMessagesForChats(chat_ids: string[]) {
    try {
      // For each chat, get the most recent message
      const lastMessages = await Promise.all(
        chat_ids.map(async (chat_id) => {
          const message = await this.getLastMessage({ chat_id });
          return { chat_id, message };
        }),
      );

      // Convert to an object with chat_id as key
      const lastMessagesMap = lastMessages.reduce(
        (acc, { chat_id, message }) => {
          acc[chat_id] = message;
          return acc;
        },
        {},
      );

      return lastMessagesMap;
    } catch (error) {
      this.logger.error(`Error getting last messages: ${error.message}`);
      throw new BadRequestException(
        `Failed to get last messages: ${error.message}`,
      );
    }
  }

  /**
   * Get a chat by ID
   * @param chat_id The chat ID
   * @returns The chat
   */
  async getChatById(chat_id: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          chat_id,
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
          messages: {
            take: 1,
            orderBy: {
              created_at: 'desc',
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
            },
          },
        },
      });

      return chat;
    } catch (error) {
      this.logger.error(`Error getting chat by ID: ${error.message}`);
      throw new BadRequestException(`Failed to get chat: ${error.message}`);
    }
  }
}
