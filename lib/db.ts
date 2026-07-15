// Dynamically import mongodb inside functions to avoid loading BSON at module initialization
import type { MongoClient, Db } from 'mongodb';
import { siteConfig } from './site';
import fs from 'fs';
import path from 'path';

const CONTACTS_FILE = path.join(process.cwd(), 'lib', 'contacts_db.json');
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'lib', 'subscribers_db.json');

function readLocalSubscribers(): any[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const content = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading local subscribers:', error);
  }
  return [];
}

function writeLocalSubscribers(subscribers: any[]): void {
  try {
    const dir = path.dirname(SUBSCRIBERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local subscribers:', error);
  }
}

function readLocalContacts(): any[] {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const content = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading local contacts:', error);
  }
  return [];
}

function writeLocalContacts(contacts: any[]): void {
  try {
    const dir = path.dirname(CONTACTS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local contacts:', error);
  }
}
import { services } from './services';
import { projects, type Project } from './projects';
import { team, values, awards } from './team';
import { stats, testimonials, processSteps } from './content';
import { faqs } from './faqs';

function serialize<T>(data: T): T {
  if (data === undefined || data === null) return data;
  return JSON.parse(JSON.stringify(data));
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'tectoflow';

let globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
  _mongoClientPromise?: Promise<MongoClient>;
  _lastConnectFailureTime?: number;
};

const CONNECTION_COOLDOWN_MS = 30000; // 30 seconds

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // If a connection failed recently, fail fast instantly without attempting to connect again
  if (globalWithMongo._lastConnectFailureTime && (Date.now() - globalWithMongo._lastConnectFailureTime < CONNECTION_COOLDOWN_MS)) {
    throw new Error('MongoDB connection is in cooldown after a recent failure');
  }

  if (globalWithMongo._mongoClient && globalWithMongo._mongoDb) {
    return { client: globalWithMongo._mongoClient, db: globalWithMongo._mongoDb };
  }

  if (!globalWithMongo._mongoClientPromise) {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    globalWithMongo._mongoClientPromise = client.connect();
  }

  try {
    const client = await globalWithMongo._mongoClientPromise;
    const db = client.db(MONGODB_DB);

    globalWithMongo._mongoClient = client;
    globalWithMongo._mongoDb = db;

    // Clear any previous failure time on success
    globalWithMongo._lastConnectFailureTime = undefined;

    return { client, db };
  } catch (error) {
    // Record failure time and clear promise so that we don't hold a rejected promise forever,
    // but the cooldown check above will prevent immediate retries.
    globalWithMongo._lastConnectFailureTime = Date.now();
    globalWithMongo._mongoClientPromise = undefined;
    throw error;
  }
}

// Check database connection health
export async function isDbConnected(): Promise<boolean> {
  if (!MONGODB_URI) return false;
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    return true;
  } catch (e) {
    return false;
  }
}

// -------------------------------------------------------------
// Site Config
// -------------------------------------------------------------
export async function getSiteConfig() {
  try {
    const { db } = await connectToDatabase();
    const config = await db.collection('site_config').findOne({});
    if (!config) {
      // Seed initial data
      const initial = { ...siteConfig };
      await db.collection('site_config').insertOne(initial);
      return serialize(initial);
    }
    return serialize(config);
  } catch (error) {
    console.warn('MongoDB siteConfig read failed, falling back to static content:', error);
    return serialize(siteConfig);
  }
}

export async function updateSiteConfig(data: any) {
  const { db } = await connectToDatabase();
  const { _id, ...cleanData } = data;
  await db.collection('site_config').updateOne(
    {},
    { $set: cleanData },
    { upsert: true }
  );
  return cleanData;
}

// -------------------------------------------------------------
// Services
// -------------------------------------------------------------
export async function getServices() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('services').find({}).toArray();
    if (items.length === 0) {
      // Seed initial data (mapping icon functions to strings)
      const initial = services.map(s => ({
        slug: s.slug,
        title: s.title,
        short: s.short,
        description: s.description,
        icon: serviceIconName(s.slug),
        deliverables: s.deliverables,
        startingPrice: s.startingPrice
      }));
      await db.collection('services').insertMany(initial);
      return serialize(initial);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB services read failed, falling back to static content:', error);
    return serialize(services.map(s => ({ ...s, icon: serviceIconName(s.slug) })));
  }
}

const SERVICE_ICONS: Record<string, string> = {
  'brand-strategy': 'Palette',
  'web-design': 'MonitorSmartphone',
  'product-design': 'Code2',
  'launch-sprint': 'Rocket',
  'growth-design': 'LineChart',
  'motion-brand': 'Sparkles',
  'website-development': 'Globe',
  'ecommerce-development': 'ShoppingCart',
  'custom-business-software': 'Building2',
  'ui-ux-design': 'PenTool',
  'seo-optimization': 'Search',
  'automation-ai-solutions': 'Bot',
};

function serviceIconName(slug: string): string {
  return SERVICE_ICONS[slug] ?? 'Palette';
}

export async function saveServices(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('services').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('services').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Projects
// -------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('projects').find({}).toArray();
    if (items.length === 0) {
      // Seed initial data
      await db.collection('projects').insertMany(projects);
      return serialize(projects);
    }
    return serialize(items) as unknown as Project[];
  } catch (error) {
    console.warn('MongoDB projects read failed, falling back to static content:', error);
    return serialize(projects);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (typeof slug !== 'string') {
    throw new Error('Invalid project slug');
  }
  try {
    const { db } = await connectToDatabase();
    const project = await db.collection('projects').findOne({ slug });
    if (!project) {
      return serialize(projects.find(p => p.slug === slug) || null);
    }
    return serialize(project) as unknown as Project;
  } catch (error) {
    return serialize(projects.find(p => p.slug === slug) || null);
  }
}

export async function saveProject(slug: string, data: any) {
  if (typeof slug !== 'string') {
    throw new Error('Invalid project slug');
  }
  const { db } = await connectToDatabase();
  const { _id, ...cleanData } = data;
  await db.collection('projects').updateOne(
    { slug },
    { $set: cleanData },
    { upsert: true }
  );
  return cleanData;
}

export async function createProject(data: any) {
  const { db } = await connectToDatabase();
  const { _id, ...cleanData } = data;
  await db.collection('projects').insertOne(cleanData);
  return cleanData;
}

export async function deleteProject(slug: string) {
  if (typeof slug !== 'string') {
    throw new Error('Invalid project slug');
  }
  const { db } = await connectToDatabase();
  await db.collection('projects').deleteOne({ slug });
  return { success: true };
}

// -------------------------------------------------------------
// Team Members
// -------------------------------------------------------------
export async function getTeam() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('team').find({}).toArray();
    if (items.length === 0) {
      await db.collection('team').insertMany(team);
      return serialize(team);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB team read failed, falling back to static content:', error);
    return serialize(team);
  }
}

export async function saveTeam(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('team').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('team').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Values
// -------------------------------------------------------------
export async function getValues() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('values').find({}).toArray();
    if (items.length === 0) {
      await db.collection('values').insertMany(values);
      return serialize(values);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB values read failed, falling back to static content:', error);
    return serialize(values);
  }
}

export async function saveValues(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('values').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('values').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Awards
// -------------------------------------------------------------
export async function getAwards() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('awards').find({}).toArray();
    if (items.length === 0) {
      await db.collection('awards').insertMany(awards);
      return serialize(awards);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB awards read failed, falling back to static content:', error);
    return serialize(awards);
  }
}

export async function saveAwards(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('awards').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('awards').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Stats
// -------------------------------------------------------------
export async function getStats() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('stats').find({}).toArray();
    if (items.length === 0) {
      await db.collection('stats').insertMany(stats);
      return serialize(stats);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB stats read failed, falling back to static content:', error);
    return serialize(stats);
  }
}

export async function saveStats(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('stats').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('stats').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Testimonials
// -------------------------------------------------------------
export async function getTestimonials() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('testimonials').find({}).toArray();
    if (items.length === 0) {
      await db.collection('testimonials').insertMany(testimonials);
      return serialize(testimonials);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB testimonials read failed, falling back to static content:', error);
    return serialize(testimonials);
  }
}

export async function saveTestimonials(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('testimonials').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('testimonials').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Process Steps
// -------------------------------------------------------------
export async function getProcessSteps() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('process_steps').find({}).toArray();
    if (items.length === 0) {
      // Seed initial data mapping icon functions to strings
      const initial = processSteps.map(s => {
        let iconName = 'Search';
        if (s.number === '01') iconName = 'Search';
        else if (s.number === '02') iconName = 'PenTool';
        else if (s.number === '03') iconName = 'Code2';
        else if (s.number === '04') iconName = 'Send';
        return {
          number: s.number,
          title: s.title,
          description: s.description,
          icon: iconName
        };
      });
      await db.collection('process_steps').insertMany(initial);
      return serialize(initial);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB process_steps read failed, falling back to static content:', error);
    return serialize(processSteps.map(s => {
      let iconName = 'Search';
      if (s.number === '01') iconName = 'Search';
      else if (s.number === '02') iconName = 'PenTool';
      else if (s.number === '03') iconName = 'Code2';
      else if (s.number === '04') iconName = 'Send';
      return { ...s, icon: iconName };
    }));
  }
}

export async function saveProcessSteps(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('process_steps').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('process_steps').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// FAQs
// -------------------------------------------------------------
export async function getFAQs() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('faqs').find({}).toArray();
    if (items.length === 0) {
      await db.collection('faqs').insertMany(faqs);
      return serialize(faqs);
    }
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB faqs read failed, falling back to static content:', error);
    return serialize(faqs);
  }
}

export async function saveFAQs(items: any[]) {
  const { db } = await connectToDatabase();
  await db.collection('faqs').deleteMany({});
  if (items.length > 0) {
    const cleanItems = items.map(({ _id, ...item }) => item);
    await db.collection('faqs').insertMany(cleanItems);
  }
  return items;
}

// -------------------------------------------------------------
// Contact Inquiries
// -------------------------------------------------------------
export async function getContacts() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB contacts read failed, falling back to local JSON:', error);
    return serialize(readLocalContacts());
  }
}

export async function createContact(data: any) {
  const contact = {
    ...data,
    read: false,
    createdAt: new Date().toISOString()
  };
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('contacts').insertOne(contact);
    return { ...contact, _id: result.insertedId };
  } catch (error) {
    console.warn('MongoDB contact insert failed, falling back to local JSON:', error);
    const local = readLocalContacts();
    const newContact = { ...contact, id: Date.now().toString() };
    local.unshift(newContact);
    writeLocalContacts(local);
    return newContact;
  }
}

export async function markContactRead(id: string, read: boolean) {
  if (typeof id !== 'string') {
    throw new Error('Invalid contact ID');
  }
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read } }
    );
    return { id, read };
  } catch (error) {
    console.warn('MongoDB contact update failed, falling back to local JSON:', error);
    const local = readLocalContacts();
    const updated = local.map((c: any) => c.id === id ? { ...c, read } : c);
    writeLocalContacts(updated);
    return { id, read };
  }
}

export async function deleteContact(id: string) {
  if (typeof id !== 'string') {
    throw new Error('Invalid contact ID');
  }
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (error) {
    console.warn('MongoDB contact delete failed, falling back to local JSON:', error);
    const local = readLocalContacts();
    const updated = local.filter((c: any) => c.id !== id);
    writeLocalContacts(updated);
    return { success: true };
  }
}

export async function addContactReply(id: string, reply: { subject: string; message: string; repliedAt: string }) {
  if (typeof id !== 'string') {
    throw new Error('Invalid contact ID');
  }
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { replies: reply } as any,
        $set: { replied: true, read: true } // Replying implies it is read as well
      }
    );
    return { id, reply };
  } catch (error) {
    console.warn('MongoDB contact reply update failed, falling back to local JSON:', error);
    const local = readLocalContacts();
    const updated = local.map((c: any) => {
      if (c.id === id || (c._id && c._id.toString() === id)) {
        const replies = c.replies || [];
        replies.push(reply);
        return { ...c, replied: true, read: true, replies };
      }
      return c;
    });
    writeLocalContacts(updated);
    return { id, reply };
  }
}

// -------------------------------------------------------------
// Newsletter Subscribers
// -------------------------------------------------------------
export async function getNewsletterSubscribers() {
  try {
    const { db } = await connectToDatabase();
    const items = await db.collection('subscribers').find({}).sort({ subscribedAt: -1 }).toArray();
    return serialize(items);
  } catch (error) {
    console.warn('MongoDB subscribers read failed, falling back to local JSON:', error);
    return serialize(readLocalSubscribers());
  }
}

export async function createNewsletterSubscriber(email: string) {
  if (typeof email !== 'string') {
    throw new Error('Invalid email address');
  }
  const subscriber = {
    email,
    subscribedAt: new Date().toISOString()
  };
  try {
    const { db } = await connectToDatabase();
    const existing = await db.collection('subscribers').findOne({ email });
    if (existing) {
      return existing;
    }
    const result = await db.collection('subscribers').insertOne(subscriber);
    return { ...subscriber, _id: result.insertedId };
  } catch (error) {
    console.warn('MongoDB subscriber insert failed, falling back to local JSON:', error);
    const local = readLocalSubscribers();
    const existing = local.find((s: any) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;
    const newSubscriber = { ...subscriber, id: Date.now().toString() };
    local.unshift(newSubscriber);
    writeLocalSubscribers(local);
    return newSubscriber;
  }
}

export async function deleteNewsletterSubscriber(id: string) {
  if (typeof id !== 'string') {
    throw new Error('Invalid subscriber ID');
  }
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');
    let query: any;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }
    await db.collection('subscribers').deleteOne(query);
    return { success: true };
  } catch (error) {
    console.warn('MongoDB subscriber delete failed, falling back to local JSON:', error);
    const local = readLocalSubscribers();
    const updated = local.filter((s: any) => s.id !== id && s._id !== id);
    writeLocalSubscribers(updated);
    return { success: true };
  }
}
