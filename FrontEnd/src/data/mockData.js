
const USER = [
  { user_id: 1, username: "admin01", password_hash: "password123", role: "ADMIN", manager_id: null },

  { user_id: 2, username: "manager01", password_hash: "password123", role: "MANAGER", manager_id: 1 },
  { user_id: 3, username: "manager02", password_hash: "password123", role: "MANAGER", manager_id: 2 },
  { user_id: 4, username: "manager03", password_hash: "password123", role: "MANAGER", manager_id: 2 },

  { user_id: 5, username: "emp01", password_hash: "password123", role: "EMPLOYEE", manager_id: 3 },
  { user_id: 6, username: "emp02", password_hash: "password123", role: "EMPLOYEE", manager_id: 3 },
  { user_id: 7, username: "emp03", password_hash: "password123", role: "EMPLOYEE", manager_id: 3 },
  { user_id: 8, username: "emp04", password_hash: "password123", role: "EMPLOYEE", manager_id: 3 },
  { user_id: 9, username: "emp05", password_hash: "password123", role: "EMPLOYEE", manager_id: 3 },

  { user_id: 10, username: "emp06", password_hash: "password123", role: "EMPLOYEE", manager_id: 4 },
  { user_id: 11, username: "emp07", password_hash: "password123", role: "EMPLOYEE", manager_id: 4 },
  { user_id: 12, username: "emp08", password_hash: "password123", role: "EMPLOYEE", manager_id: 4 },
  { user_id: 13, username: "emp09", password_hash: "password123", role: "EMPLOYEE", manager_id: 4 },
  { user_id: 14, username: "emp10", password_hash: "password123", role: "EMPLOYEE", manager_id: 4 },
];

const TASK = [
  // Manager 1 → Manager 2 & 3
  {
    task_id: 1,
    title: "Quarterly Planning",
    description: "Prepare Q1 planning sheet.",
    priority: "HIGH",
    status: "TO_DO",
    due_date: "2025-12-05 17:00:00",
    assigned_to_id: 3,
    assigned_by_id: 2,
  },
  {
    task_id: 2,
    title: "Team Structure Update",
    description: "Update team hierarchy.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    due_date: "2025-12-08 17:00:00",
    assigned_to_id: 4,
    assigned_by_id: 2,
  },

  // Manager 2 → Employees (5–9)
  {
    task_id: 3,
    title: "Build Login UI",
    description: "Implement login page.",
    priority: "HIGH",
    status: "TO_DO",
    due_date: "2025-12-02 18:00:00",
    assigned_to_id: 5,
    assigned_by_id: 3,
  },
  {
    task_id: 4,
    title: "Fix Navbar Bugs",
    description: "Fix responsive navbar.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    due_date: "2025-12-04 15:00:00",
    assigned_to_id: 6,
    assigned_by_id: 3,
  },
  {
    task_id: 5,
    title: "API Integration",
    description: "Integrate backend APIs.",
    priority: "HIGH",
    status: "TO_DO",
    due_date: "2025-12-06 18:00:00",
    assigned_to_id: 7,
    assigned_by_id: 3,
  },
  {
    task_id: 6,
    title: "Write Documentation",
    description: "Write project README.",
    priority: "LOW",
    status: "COMPLETE",
    due_date: "2025-12-01 12:00:00",
    assigned_to_id: 8,
    assigned_by_id: 3,
  },
  {
    task_id: 7,
    title: "Optimize Queries",
    description: "Improve DB performance.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    due_date: "2025-12-10 18:00:00",
    assigned_to_id: 9,
    assigned_by_id: 3,
  },

  // Manager 3 → Employees (10–14)
  {
    task_id: 8,
    title: "Design Dashboard",
    description: "Modern dashboard UI.",
    priority: "HIGH",
    status: "TO_DO",
    due_date: "2025-12-07 17:00:00",
    assigned_to_id: 10,
    assigned_by_id: 4,
  },
  {
    task_id: 9,
    title: "Role-based Routing",
    description: "Implement role routing.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    due_date: "2025-12-09 18:00:00",
    assigned_to_id: 11,
    assigned_by_id: 4,
  },
  {
    task_id: 10,
    title: "Unit Tests",
    description: "Write test cases.",
    priority: "LOW",
    status: "TO_DO",
    due_date: "2025-12-11 14:00:00",
    assigned_to_id: 12,
    assigned_by_id: 4,
  },
  {
    task_id: 11,
    title: "Fix Mobile UI",
    description: "Fix mobile layout bugs.",
    priority: "HIGH",
    status: "IN_PROGRESS",
    due_date: "2025-12-03 13:00:00",
    assigned_to_id: 13,
    assigned_by_id: 4,
  },
  {
    task_id: 12,
    title: "Refactor Components",
    description: "Refactor frontend code.",
    priority: "MEDIUM",
    status: "COMPLETE",
    due_date: "2025-12-01 16:00:00",
    assigned_to_id: 14,
    assigned_by_id: 4,
  },
];

const COMMENT = [
  { comment_id: 1, task_id: 3, user_id: 5, content: "Started working on login UI." },
  { comment_id: 2, task_id: 3, user_id: 3, content: "Great, update status by EOD." },

  { comment_id: 3, task_id: 4, user_id: 6, content: "Navbar almost fixed." },
  { comment_id: 4, task_id: 4, user_id: 3, content: "Test mobile view also." },

  { comment_id: 5, task_id: 8, user_id: 10, content: "Dashboard wireframe ready." },
  { comment_id: 6, task_id: 8, user_id: 4, content: "Share the design link." },

  { comment_id: 7, task_id: 11, user_id: 13, content: "Fixed 80% layout issues." },
  { comment_id: 8, task_id: 11, user_id: 4, content: "Check on iPhone SE as well." },
];

export { USER, TASK, COMMENT };
