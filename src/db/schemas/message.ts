import {
  foreignKey,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./user";
import { ChannelTable } from "./channel";
import { relations } from "drizzle-orm";
import { ReactionTable } from "./reaction";

export const MessageTable = pgTable(
  "messages",
  {
    id: uuid().primaryKey().defaultRandom(),
    message: varchar("message").notNull(),
    image: varchar("image"),
    userId: varchar("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    threadId: uuid("thread_id"),
    channelId: uuid("channel_id")
      .references(() => ChannelTable.id, { onDelete: "cascade" })
      .notNull(),
    organizationId: varchar("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      columns: [table.threadId],
      foreignColumns: [table.id],
    }).onDelete("cascade"),
  ],
);

export const messageRelations = relations(MessageTable, ({ one, many }) => ({
  user: one(user, {
    fields: [MessageTable.userId],
    references: [user.id],
  }),
  channel: one(ChannelTable, {
    fields: [MessageTable.channelId],
    references: [ChannelTable.id],
  }),
  organization: one(organization, {
    fields: [MessageTable.organizationId],
    references: [organization.id],
  }),
  reactions: many(ReactionTable),
  parentMessage: one(MessageTable, {
    fields: [MessageTable.threadId],
    references: [MessageTable.id],
    relationName: "thread_messages",
  }),

  threadMessages: many(MessageTable, {
    relationName: "thread_messages",
  }),
}));
