# Leave Management System - API Integration Guide

## Architecture Overview

The system has three main components that communicate via RESTful APIs:

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│  Admin Frontend │◄────────┤   Express API   ├────────►│   MongoDB    │
│  (React/Vite)   │         │   (Node.js)     │         │  Cloudinary  │
└─────────────────┘         └─────────────────┘         └──────────────┘
                                    ▲
                                    │
                                    │
                            ┌───────▼──────┐
                            │ Employee     │
                            │ Frontend     │
                            │ (React/Vite) │
                            └──────────────┘
```

---

## Backend Server (Port 5000)

**Base URL:** `http://localhost:5000`

### Admin Endpoints

#### Register Admin
```
POST /api/admin/register
Content-Type: application/json

Body:
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}

Response (201):
{
  "id": "admin_id_mongo",
  "email": "admin@example.com"
}
```

#### Login Admin
```
POST /api/admin/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Token Structure (decoded):
{
  "adminId": "mongo_admin_id",
  "isAdmin": true,
  "email": "admin@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

### Employee Endpoints

#### Create Employee (Admin Only)
```
POST /api/employees
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "emp_password123"
}

Response (200):
{
  "_id": "employee_mongo_id",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

#### List Employees (Admin Only)
```
GET /api/employees
Authorization: Bearer {admin_token}

Response (200):
[
  {
    "_id": "emp_id_1",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cloudinary.com/image_url"
  },
  {
    "_id": "emp_id_2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "avatar": "https://cloudinary.com/image_url"
  }
]
```

#### Employee Login
```
POST /api/employees/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "emp_password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Token Structure (decoded):
{
  "employeeId": "mongo_emp_id",
  "email": "john@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

#### Upload Employee Avatar (Admin Only)
```
POST /api/employees/{employeeId}/avatar
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Body:
{
  "file": <image_file>
}

Response (200):
{
  "_id": "emp_id",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://res.cloudinary.com/danneh8cs/image/upload/..."
}
```

---

### Leave Endpoints

#### Create Leave Request (Employee)
```
POST /api/leaves
Content-Type: application/json

Body:
{
  "employeeId": "mongo_emp_id",
  "startDate": "2026-02-01",
  "endDate": "2026-02-05",
  "days": 5,
  "reason": "Personal leave"
}

Response (200):
{
  "_id": "leave_mongo_id",
  "employee": "mongo_emp_id",
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2026-02-05T00:00:00Z",
  "days": 5,
  "reason": "Personal leave",
  "status": "pending",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

#### List All Leaves (Admin Only)
```
GET /api/leaves
Authorization: Bearer {admin_token}

Response (200):
[
  {
    "_id": "leave_id_1",
    "employee": {
      "_id": "emp_id_1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "startDate": "2026-02-01T00:00:00Z",
    "endDate": "2026-02-05T00:00:00Z",
    "days": 5,
    "reason": "Personal leave",
    "status": "pending"
  },
  {
    "_id": "leave_id_2",
    "employee": {
      "_id": "emp_id_2",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "startDate": "2026-01-20T00:00:00Z",
    "endDate": "2026-01-22T00:00:00Z",
    "days": 3,
    "reason": "Sick leave",
    "status": "approved"
  }
]
```

#### Update Leave Status (Admin Only)
```
PATCH /api/leaves/{leaveId}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

Body:
{
  "status": "approved"
}

Allowed Status Values:
- "pending"
- "approved"
- "cancelled"

Response (200):
{
  "_id": "leave_id",
  "employee": "emp_id",
  "startDate": "2026-02-01T00:00:00Z",
  "endDate": "2026-02-05T00:00:00Z",
  "days": 5,
  "reason": "Personal leave",
  "status": "approved",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-15T10:30:00Z"
}
```

---

## Authentication & Authorization

### JWT Implementation

- **Algorithm:** HS256
- **Secret:** `process.env.JWT_SECRET` (from `.env`)
- **Duration:** 7 days
- **Header Format:** `Authorization: Bearer {token}`

### Middleware Protection

| Route | Middleware | Purpose |
|-------|-----------|---------|
| `POST /api/admin/register` | None | Public |
| `POST /api/admin/login` | None | Public |
| `POST /api/employees` | `authAdmin` | Admin only |
| `GET /api/employees` | `authAdmin` | Admin only |
| `POST /api/employees/login` | None | Public |
| `POST /api/employees/:id/avatar` | `authAdmin` | Admin only |
| `POST /api/leaves` | None | Public (employee provides ID) |
| `GET /api/leaves` | `authAdmin` | Admin only |
| `PATCH /api/leaves/:id/status` | `authAdmin` | Admin only |

### Token Validation Response Codes

- **401:** No token or invalid token
- **403:** Token valid but insufficient permissions
- **200:** Authorized

---

## Admin Frontend Integration (React)

**Base URL:** `http://localhost:3000`

### Current Implementation: LocalStorage-Based

⚠️ **Note:** The current admin frontend uses localStorage without connecting to the backend API.

### Storage Keys
- `auth`: Authentication flag (boolean string)

### Data Storage
- Employees: `localStorage.getItem('employees')`
- Leaves: `localStorage.getItem('leaves')`

---

## Employee Frontend Integration (React)

**Base URL:** `http://localhost:5173`

### Current Implementation: LocalStorage-Based

⚠️ **Note:** The current employee frontend uses localStorage without connecting to the backend API.

### Storage Keys
- `emp_auth`: Authentication flag (boolean string)
- `emp_email`: Employee email
- `emp_users`: User credentials (for signup/signin)
- `emp_leaves`: Leave requests

---

## Environment Configuration

### Server .env File
```
PORT=5000
MONGO_URI=mongodb+srv://ankurbutani229_db_user:ankur2209@cluster0.d0srevy.mongodb.net
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=danneh8cs
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Collections (MongoDB)

**Admins Collection:**
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

**Employees Collection:**
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  avatar: String (Cloudinary URL),
  createdAt: Date,
  updatedAt: Date
}
```

**Leaves Collection:**
```
{
  _id: ObjectId,
  employee: ObjectId (ref: Employee),
  startDate: Date,
  endDate: Date,
  days: Number,
  reason: String,
  status: String (enum: pending, approved, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "message": "Error description"
}
```

### Common Error Codes

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Admin exists | Email already registered as admin |
| 400 | Employee exists | Email already registered as employee |
| 400 | Invalid | Invalid email/password combination |
| 400 | No file | Avatar upload without file |
| 400 | Invalid status | Status not in allowed values |
| 401 | No token | Missing authorization header |
| 401 | Invalid token | Token expired or signature invalid |
| 403 | Admin only | Non-admin accessing admin endpoint |
| 403 | Employee only | Non-employee accessing employee endpoint |
| 500 | Server error | Database or processing error |

---

## Testing API Endpoints

### Using cURL

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

**Create Employee:**
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "password":"emp_pass123"
  }'
```

**Create Leave Request:**
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"EMPLOYEE_MONGO_ID",
    "startDate":"2026-02-01",
    "endDate":"2026-02-05",
    "days":5,
    "reason":"Personal leave"
  }'
```

---

## Next Steps for Integration

1. **Admin Frontend:** Update React components to fetch from `http://localhost:5000/api/admin` and `http://localhost:5000/api/employees`
2. **Employee Frontend:** Update React components to use backend API instead of localStorage
3. **Token Management:** Store JWT tokens in localStorage/sessionStorage and include in Authorization headers
4. **Error Handling:** Implement proper error handling for API responses
5. **Loading States:** Add loading indicators for async API calls
6. **CORS:** Ensure backend CORS is configured correctly for frontend origin

---

## Security Considerations

- ✅ Passwords are hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Admin and Employee authentication middleware
- ✅ Input validation in controllers
- ⚠️ HTTPS should be used in production
- ⚠️ JWT_SECRET should be strong and unique in production
- ⚠️ API keys should not be committed to version control

---

## Running All Services

```powershell
# Terminal 1 - Start Backend
cd server
npm run dev

# Terminal 2 - Start Admin Frontend
cd admin
npm run dev

# Terminal 3 - Start Employee Frontend
cd employee
npm run dev
```

**Access Points:**
- Admin: `http://localhost:5173`
- Employee: `http://localhost:5174` (or next available port)
- API: `http://localhost:5000`
