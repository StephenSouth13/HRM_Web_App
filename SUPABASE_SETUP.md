# Hướng Dẫn Kết Nối Supabase cho LIFE OS HRM

## Bước 1: Tạo Project Supabase

1. Đi tới [supabase.com](https://supabase.com) và đăng nhập
2. Click "New Project"
3. Điền tên project: `life-os-hrm`
4. Chọn region gần bạn nhất
5. Đặt mật khẩu database
6. Click "Create new project" và đợi ~2 phút

## Bước 2: Lấy Credentials

1. Vào "Project Settings" → "API"
2. Copy những giá trị này vào file `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

## Bước 3: Chạy Database Migrations

1. Vào Supabase → "SQL Editor"
2. Tạo một query mới
3. Copy-paste nội dung từ file `supabase/migrations/001_organizations_and_auth.sql`
4. Click "Run"
5. Lặp lại bước này cho tất cả file migration từ 001 đến 008

Hoặc chạy script tự động:
\`\`\`bash
npm run migrate:supabase
\`\`\`

## Bước 4: Cập Nhật Auth Pages

Đã được setup sẵn! Các trang auth sẽ tự kết nối với Supabase.

## Demo Accounts

Sau khi chạy migrations, bạn có thể tạo tài khoản demo:

- **BOD**: bod@lifeoshrm.com / password123
- **LEADER**: leader@lifeoshrm.com / password123
- **EMPLOYEE**: employee@lifeoshrm.com / password123

## Troubleshooting

**Lỗi: "CORS error"**
- Vào Supabase → Settings → API → CORS
- Thêm URL của ứng dụng

**Lỗi: "Invalid API key"**
- Kiểm tra lại env variables
- Restart development server

**Lỗi: "Table doesn't exist"**
- Chạy lại migrations
- Kiểm tra Supabase SQL Editor
