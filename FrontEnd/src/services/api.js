import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
    baseURL: 'http://13.221.87.183:8080/api', // API Gateway running on port 8080
    withCredentials: true, // Required for CORS with credentials
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// DATA TRANSFORMERS (Backend -> Frontend format)
// ============================================

/**
 * Transform user data from backend format to frontend format
 * Backend (UserResponseDTO): id, firstName, lastName, email, role, status (boolean), department (enum), managerId
 * Frontend expects: user_id, username, firstName, email, role, status (string), department (string), manager_id
 */
export const transformUser = (user) => {
    if (!user) return null;
    return {
        user_id: user.id,
        username: user.firstName || user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: typeof user.department === 'object' ? user.department?.name || user.department : (user.department || 'General'),
        status: user.status === true || user.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        manager_id: user.managerId,
    };
};

/**
 * Transform task data from backend format to frontend format
 * Backend (TaskResponseDto): Id, Title, Description, Priority, Status, AssignedToUserId, AssignedByUserId, DueDate, Comments
 * Frontend expects: task_id, title, description, priority, status, assigned_to_id, assigned_by_id, due_date, comments
 */
export const transformTask = (task) => {
    if (!task) return null;

    // Handle both PascalCase and camelCase from backend
    const getId = task.id ?? task.Id;
    const getTitle = task.title ?? task.Title;
    const getDescription = task.description ?? task.Description;
    const getPriority = task.priority ?? task.Priority;
    const getStatus = task.status ?? task.Status;
    const getAssignedTo = task.assignedToUserId ?? task.AssignedToUserId;
    const getAssignedBy = task.assignedByUserId ?? task.AssignedByUserId;
    const getDueDate = task.dueDate ?? task.DueDate;
    const getComments = task.comments ?? task.Comments ?? [];

    // Normalize status - convert enum number to string if needed
    let normalizedStatus = getStatus;
    if (typeof getStatus === 'number') {
        const statusMap = { 0: 'NEW', 1: 'IN_PROGRESS', 2: 'COMPLETED', 3: 'CANCELLED' };
        normalizedStatus = statusMap[getStatus] || 'NEW';
    } else if (typeof getStatus === 'string') {
        normalizedStatus = getStatus.toUpperCase().replace(/\s+/g, '_');
    }

    // Normalize priority - convert enum number to string if needed
    let normalizedPriority = getPriority;
    if (typeof getPriority === 'number') {
        const priorityMap = { 0: 'LOW', 1: 'MEDIUM', 2: 'HIGH' };
        normalizedPriority = priorityMap[getPriority] || 'MEDIUM';
    } else if (typeof getPriority === 'string') {
        normalizedPriority = getPriority.toUpperCase();
    }

    return {
        task_id: getId,
        title: getTitle,
        description: getDescription,
        priority: normalizedPriority,
        status: normalizedStatus,
        assigned_to_id: getAssignedTo,
        assigned_by_id: getAssignedBy,
        due_date: getDueDate,
        created_at: getDueDate, // Backend doesn't have created_at, using due_date as fallback
        comments: getComments.map(transformComment),
    };
};

/**
 * Transform comment data from backend format to frontend format
 * Backend (CommentResponseDto): Id, Text, CommentedByUserId, TaskId, CreatedOn
 * Frontend expects: comment_id, content, user_id, task_id, created_at
 */
export const transformComment = (comment) => {
    if (!comment) return null;

    const getId = comment.id ?? comment.Id;
    const getText = comment.text ?? comment.Text;
    const getUserId = comment.commentedByUserId ?? comment.CommentedByUserId;
    const getTaskId = comment.taskId ?? comment.TaskId;
    const getCreatedOn = comment.createdOn ?? comment.CreatedOn;

    return {
        comment_id: getId,
        content: getText,
        user_id: getUserId,
        task_id: getTaskId,
        created_at: getCreatedOn,
    };
};

// ============================================
// REQUEST PAYLOAD TRANSFORMERS (Frontend -> Backend format)
// ============================================

/**
 * Transform task creation payload from frontend format to backend format
 */
export const transformTaskCreatePayload = (payload) => {
    // Map frontend status strings to backend enum values
    const statusMap = {
        'TO_DO': 0,
        'NEW': 0,
        'IN_PROGRESS': 1,
        'COMPLETED': 2,
        'COMPLETE': 2,
        'CANCELLED': 3,
    };

    const priorityMap = {
        'LOW': 0,
        'MEDIUM': 1,
        'HIGH': 2,
    };

    return {
        Title: payload.title,
        Description: payload.description || '',
        Priority: priorityMap[payload.priority?.toUpperCase()] ?? 1,
        Status: statusMap[payload.status?.toUpperCase()] ?? 0,
        AssignedToUserId: parseInt(payload.assigned_to_id),
        AssignedByUserId: parseInt(payload.assigned_by_id),
        DueDate: payload.due_date,
    };
};

/**
 * Transform task update payload from frontend format to backend format
 */
export const transformTaskUpdatePayload = (task, updates) => {
    const statusMap = {
        'TO_DO': 0,
        'NEW': 0,
        'IN_PROGRESS': 1,
        'COMPLETED': 2,
        'COMPLETE': 2,
        'CANCELLED': 3,
    };

    const priorityMap = {
        'LOW': 0,
        'MEDIUM': 1,
        'HIGH': 2,
    };

    // Backend expects all fields for update
    const status = updates.status || task.status;
    const priority = updates.priority || task.priority;

    return {
        Title: updates.title || task.title,
        Description: updates.description ?? task.description ?? '',
        Priority: priorityMap[priority?.toUpperCase()] ?? 1,
        Status: statusMap[status?.toUpperCase()] ?? 0,
        AssignedToUserId: parseInt(updates.assigned_to_id || task.assigned_to_id),
        DueDate: updates.due_date || task.due_date,
    };
};

/**
 * Transform comment creation payload from frontend format to backend format
 */
export const transformCommentCreatePayload = (payload) => {
    return {
        Text: payload.content,
        CommentedByUserId: parseInt(payload.user_id),
    };
};

/**
 * Transform user creation/update payload from frontend format to backend format
 */
export const transformUserPayload = (payload) => {
    return {
        firstName: payload.username || payload.firstName,
        lastName: payload.lastName || '',
        email: payload.email,
        password: payload.password_hash || payload.password || 'password123',
        role: payload.role,
        status: payload.status === 'ACTIVE',
        department: payload.department,
        managerId: payload.manager_id ? parseInt(payload.manager_id) : null,
    };
};

export default api;
