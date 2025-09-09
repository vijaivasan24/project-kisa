import { users, type User, type InsertUser, type DiseaseScan, type Activity } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDiseaseScan(scan: { userId: string; imageData: string; diagnosis?: string; confidence?: number; remedies?: string[] }): Promise<DiseaseScan>;
  createActivity(activity: { userId: string; type: string; title: string; description?: string; icon?: string }): Promise<Activity>;
  getActivitiesByUserId(userId: string): Promise<Activity[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private diseaseScans: Map<number, DiseaseScan>;
  private activities: Map<number, Activity>;
  currentId: number;
  scanId: number;
  activityId: number;

  constructor() {
    this.users = new Map();
    this.diseaseScans = new Map();
    this.activities = new Map();
    this.currentId = 1;
    this.scanId = 1;
    this.activityId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );

  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.currentId++).toString();
    const user: User = { 
      id,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      location: insertUser.location || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      language: insertUser.language || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async createDiseaseScan(scan: { userId: string; imageData: string; diagnosis?: string; confidence?: number; remedies?: string[] }): Promise<DiseaseScan> {
    const id = this.scanId++;
    const diseaseScan: DiseaseScan = {
      id,
      userId: scan.userId,
      imageData: scan.imageData,
      diagnosis: scan.diagnosis || null,
      confidence: scan.confidence || null,
      remedies: scan.remedies || [],
      scanDate: new Date()
    };
    this.diseaseScans.set(id, diseaseScan);
    return diseaseScan;
  }

  async createActivity(activity: { userId: string; type: string; title: string; description?: string; icon?: string }): Promise<Activity> {
    const id = this.activityId++;
    const newActivity: Activity = {
      id,
      userId: activity.userId,
      type: activity.type,
      title: activity.title,
      description: activity.description || null,
      icon: activity.icon || null,
      createdAt: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
