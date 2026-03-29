import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./user";
import { ChannelTable } from "./channel";
import { relations } from "drizzle-orm";

export const MessageTable = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  message: varchar("message").notNull(),
  image: varchar("image"),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
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
});

export const messageRelations = relations(MessageTable, ({ one }) => ({
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
}));
