import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();
const publicUrl = z.string().url();

export const chamberMemberSchema = z.object({
  id: z.string().min(1),
  sourceId: optionalText,
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  shortDescription: optionalText,
  description: optionalText,
  categories: z.array(z.string().trim().min(1)),
  address: z.object({
    line1: optionalText,
    line2: optionalText,
    city: optionalText,
    province: optionalText,
    postalCode: optionalText,
    country: optionalText,
  }).optional(),
  phone: optionalText,
  email: z.string().email().optional(),
  website: publicUrl.optional(),
  hours: optionalText,
  logoUrl: publicUrl.optional(),
  sourceUrl: publicUrl,
});

export const chamberEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  description: optionalText,
  startAt: optionalText,
  endAt: optionalText,
  venue: optionalText,
  address: optionalText,
  categories: z.array(z.string().trim().min(1)).optional(),
  registrationUrl: publicUrl.optional(),
  sourceUrl: publicUrl,
});

export const chamberResourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1),
  description: optionalText,
  businessName: optionalText,
  validFrom: optionalText,
  validUntil: optionalText,
  sourceUrl: publicUrl,
});

export const chamberSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  snapshotId: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generatedAt: z.string().datetime(),
  source: z.object({
    organization: z.literal("Orillia & District Chamber of Commerce"),
    platform: z.literal("GrowthZone"),
    baseUrl: publicUrl,
  }),
  stats: z.object({
    members: z.number().int().nonnegative(),
    categories: z.number().int().nonnegative(),
    events: z.number().int().nonnegative(),
  }),
  members: z.array(chamberMemberSchema),
  categories: z.array(z.string().trim().min(1)),
  events: z.array(chamberEventSchema),
  benefits: z.array(chamberResourceSchema),
  deals: z.array(chamberResourceSchema),
}).superRefine((value, ctx) => {
  if (value.stats.members !== value.members.length) {
    ctx.addIssue({ code: "custom", path: ["stats", "members"], message: "Member count does not match members array" });
  }
  if (value.stats.categories !== value.categories.length) {
    ctx.addIssue({ code: "custom", path: ["stats", "categories"], message: "Category count does not match categories array" });
  }
  if (value.stats.events !== value.events.length) {
    ctx.addIssue({ code: "custom", path: ["stats", "events"], message: "Event count does not match events array" });
  }
});

export type ChamberMember = z.infer<typeof chamberMemberSchema>;
export type ChamberEvent = z.infer<typeof chamberEventSchema>;
export type ChamberResource = z.infer<typeof chamberResourceSchema>;
export type ChamberSnapshot = z.infer<typeof chamberSnapshotSchema>;

export type SnapshotDiff = {
  previous: { members: number; categories: number; futureEvents: number } | null;
  current: { members: number; categories: number; futureEvents: number };
  addedMembers: number;
  removedMembers: number;
  changedMembers: number;
  warnings: string[];
  rejected: boolean;
};
