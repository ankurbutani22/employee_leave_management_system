# Admin Backend

Express + MongoDB backend scaffold for the admin leave management system.

Setup:

```powershell
cd server
npm install
copy .env.example .env
# edit .env with your MongoDB Atlas and Cloudinary values
npm run dev
```

API endpoints (examples):
- `POST /api/admin/register` - register admin
- `POST /api/admin/login` - login admin
- `POST /api/employees` (admin) - create employee
- `GET /api/employees` (admin) - list employees
- `POST /api/employees/login` - employee login
- `POST /api/leaves` - create leave (employee)
- `GET /api/leaves` (admin) - list leaves
- `PATCH /api/leaves/:id/status` (admin) - change leave status
