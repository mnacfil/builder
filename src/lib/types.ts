import { Notification, Role } from "@prisma/client";

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: Role;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;
