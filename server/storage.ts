import { 
  users, orders, tasks, events, metrics,
  type User, type InsertUser,
  type Order, type InsertOrder,
  type Task, type InsertTask,
  type Event, type InsertEvent,
  type Metrics, type InsertMetrics
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Orders
  getOrders(limit?: number, offset?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getOrdersCount(): Promise<number>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Metrics
  getLatestMetrics(): Promise<Metrics | undefined>;
  createMetrics(metrics: InsertMetrics): Promise<Metrics>;
  getChartData(): Promise<{ revenue: number[], users: number[], labels: string[] }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private tasks: Map<number, Task>;
  private events: Map<number, Event>;
  private metrics: Map<number, Metrics>;
  private currentUserId: number;
  private currentOrderId: number;
  private currentTaskId: number;
  private currentEventId: number;
  private currentMetricsId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.tasks = new Map();
    this.events = new Map();
    this.metrics = new Map();
    this.currentUserId = 1;
    this.currentOrderId = 12345;
    this.currentTaskId = 1;
    this.currentEventId = 1;
    this.currentMetricsId = 1;

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample orders
    const sampleOrders: InsertOrder[] = [
      {
        customerId: 1,
        customerName: "John Smith",
        customerEmail: "john@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        amount: 2457.00,
        status: "completed"
      },
      {
        customerId: 2,
        customerName: "Emily Davis",
        customerEmail: "emily@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
        amount: 1234.50,
        status: "pending"
      },
      {
        customerId: 3,
        customerName: "Michael Chen",
        customerEmail: "michael@example.com",
        customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        amount: 987.25,
        status: "failed"
      }
    ];

    sampleOrders.forEach(order => this.createOrder(order));

    // Sample tasks
    const sampleTasks: InsertTask[] = [
      {
        title: "Design new landing page",
        description: "Create a modern landing page design",
        status: "todo",
        priority: "high",
        category: "design",
        assigneeId: 1,
        assigneeName: "Sarah Wilson",
        assigneeAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=20&h=20&fit=crop&crop=face",
        progress: 0
      },
      {
        title: "Update user documentation",
        description: "Update documentation for new features",
        status: "todo",
        priority: "medium",
        category: "docs",
        assigneeId: 2,
        assigneeName: "John Smith",
        assigneeAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=20&h=20&fit=crop&crop=face",
        progress: 0
      },
      {
        title: "API integration",
        description: "Integrate third-party API",
        status: "in-progress",
        priority: "high",
        category: "backend",
        assigneeId: 3,
        assigneeName: "Michael Chen",
        assigneeAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face",
        progress: 60
      },
      {
        title: "User authentication",
        description: "Implement user login system",
        status: "done",
        priority: "high",
        category: "frontend",
        assigneeId: 4,
        assigneeName: "Emily Davis",
        assigneeAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20&fit=crop&crop=face",
        progress: 100
      }
    ];

    sampleTasks.forEach(task => this.createTask(task));

    // Sample events
    const sampleEvents: InsertEvent[] = [
      {
        title: "Team Meeting",
        description: "Weekly team sync",
        start: new Date("2023-10-13T10:00:00"),
        end: new Date("2023-10-13T11:00:00"),
        color: "#2563eb"
      },
      {
        title: "Project Deadline",
        description: "Project delivery deadline",
        start: new Date("2023-10-18T09:00:00"),
        end: new Date("2023-10-18T17:00:00"),
        color: "#dc2626"
      }
    ];

    sampleEvents.forEach(event => this.createEvent(event));

    // Sample metrics
    this.createMetrics({
      revenue: 124592,
      users: 8249,
      orders: 1429,
      conversionRate: 3.21
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Orders
  async getOrders(limit = 10, offset = 0): Promise<Order[]> {
    const allOrders = Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return allOrders.slice(offset, offset + limit);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder,
      customerAvatar: insertOrder.customerAvatar || null,
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, orderUpdate: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderUpdate };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getOrdersCount(): Promise<number> {
    return this.orders.size;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const task: Task = { 
      ...insertTask,
      description: insertTask.description || null,
      assigneeId: insertTask.assigneeId || null,
      assigneeName: insertTask.assigneeName || null,
      assigneeAvatar: insertTask.assigneeAvatar || null,
      progress: insertTask.progress || null,
      id, 
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { 
      ...insertEvent,
      description: insertEvent.description || null,
      color: insertEvent.color || null,
      id, 
      createdAt: new Date()
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Metrics
  async getLatestMetrics(): Promise<Metrics | undefined> {
    const allMetrics = Array.from(this.metrics.values());
    return allMetrics.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  async createMetrics(insertMetrics: InsertMetrics): Promise<Metrics> {
    const id = this.currentMetricsId++;
    const metrics: Metrics = { 
      ...insertMetrics, 
      id, 
      date: new Date()
    };
    this.metrics.set(id, metrics);
    return metrics;
  }

  async getChartData(): Promise<{ revenue: number[], users: number[], labels: string[] }> {
    return {
      revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      users: [400, 600, 800, 1200, 900, 1100, 1400],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    };
  }
}

export const storage = new MemStorage();
