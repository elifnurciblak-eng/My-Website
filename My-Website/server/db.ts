import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transcriptions, translations, mergedDocuments, InsertTranscription, InsertTranslation, InsertMergedDocument } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Transcription helpers
export async function createTranscription(data: InsertTranscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transcriptions).values(data);
  return result;
}

export async function getTranscriptionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(transcriptions).where(eq(transcriptions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserTranscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(transcriptions).where(eq(transcriptions.userId, userId));
}

// Translation helpers
export async function createTranslation(data: InsertTranslation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(translations).values(data);
  return result;
}

export async function getTranslationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(translations).where(eq(translations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTranscriptionTranslations(transcriptionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(translations).where(eq(translations.transcriptionId, transcriptionId));
}

// MergedDocument helpers
export async function createMergedDocument(data: InsertMergedDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(mergedDocuments).values(data);
  return result;
}

export async function getMergedDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(mergedDocuments).where(eq(mergedDocuments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserMergedDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(mergedDocuments).where(eq(mergedDocuments.userId, userId));
}
