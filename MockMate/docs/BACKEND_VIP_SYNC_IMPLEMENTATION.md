# Backend Implementation Checklist

## 📋 Tóm Tắt

App đã được cập nhật để **tự động đồng bộ VIP status** với backend sau mỗi giao dịch RevenueCat. Backend cần implement endpoint mới để nhận những cập nhật này.

## 🔧 Endpoint Cần Implement

### `PUT /api/v1/users/vip-status`

**Mục đích**: Nhận cập nhật VIP status từ app sau khi user mua/restore gói

**Authentication**: Bearer JWT token (từ Appwrite)

**Request Body**:
```json
{
  "isVip": true,
  "vipExpiryDate": "2027-04-10T22:47:59.562Z",
  "entitlementIdentifier": "MockMate! VIP"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "isVip": true,
    "vipExpiryDate": "2027-04-10T22:47:59.562Z",
    "entitlementIdentifier": "MockMate! VIP",
    "updatedAt": "2026-04-10T22:47:59.562Z"
  }
}
```

**Response (Error - 400/500)**:
```json
{
  "success": false,
  "error": "Failed to update VIP status"
}
```

## 🛠️ Implementation (HonoJS)

```typescript
// routes/users.ts
import { Hono } from 'hono';
import { verifyJWT } from '@/middleware/auth';
import { db } from '@/db';

const usersRouter = new Hono();

// PUT /api/v1/users/vip-status
usersRouter.put('/vip-status', verifyJWT, async (c) => {
  try {
    const userId = c.get('userId'); // From JWT middleware
    
    if (!userId) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, 401);
    }

    const body = await c.req.json();
    const { isVip, vipExpiryDate, entitlementIdentifier } = body;

    // Validate input
    if (typeof isVip !== 'boolean') {
      return c.json({ 
        success: false, 
        error: 'Invalid isVip value' 
      }, 400);
    }

    // Update user in database
    const updatedUser = await db.users.update({
      where: { id: userId },
      data: {
        isVip,
        vipExpiryDate: vipExpiryDate ? new Date(vipExpiryDate) : null,
        vipEntitlementId: entitlementIdentifier || null,
        vipUpdatedAt: new Date(),
      },
      select: {
        id: true,
        isVip: true,
        vipExpiryDate: true,
        vipEntitlementId: true,
        vipUpdatedAt: true,
      },
    });

    // Log for audit trail
    console.log(`[VIP_SYNC] User ${userId} VIP status updated:`, {
      isVip,
      vipExpiryDate,
      entitlementIdentifier,
    });

    return c.json({
      success: true,
      data: {
        userId: updatedUser.id,
        isVip: updatedUser.isVip,
        vipExpiryDate: updatedUser.vipExpiryDate?.toISOString() || null,
        entitlementIdentifier: updatedUser.vipEntitlementId,
        updatedAt: updatedUser.vipUpdatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('[VIP_SYNC_ERROR]', error);
    return c.json({
      success: false,
      error: 'Failed to update VIP status',
    }, 500);
  }
});

export default usersRouter;
```

## 📊 Database Schema Updates

### Thêm/Cập nhật columns trong `users` table:

```sql
-- Nếu chưa có
ALTER TABLE users ADD COLUMN IF NOT EXISTS isVip BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vipExpiryDate TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS vipEntitlementId VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS vipUpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Index để query nhanh
CREATE INDEX IF NOT EXISTS idx_users_isVip ON users(isVip);
CREATE INDEX IF NOT EXISTS idx_users_vipExpiryDate ON users(vipExpiryDate);
```

### Prisma Schema (nếu dùng):

```prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String
  
  // VIP fields
  isVip                 Boolean   @default(false)
  vipExpiryDate         DateTime?
  vipEntitlementId      String?
  vipUpdatedAt          DateTime  @default(now()) @updatedAt
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([isVip])
  @@index([vipExpiryDate])
}
```

## 🔄 Webhook Fallback (Vẫn Cần)

Webhook từ RevenueCat vẫn là fallback nếu app sync thất bại:

```typescript
// routes/webhooks.ts
webhookRouter.post('/revenuecat', async (c) => {
  try {
    const event = await c.req.json();
    
    // Handle RevenueCat events
    if (event.type === 'CUSTOMER_INFO_UPDATED') {
      const { app_user_id, entitlements } = event.data;
      
      const isVip = Boolean(entitlements?.active?.['MockMate! VIP']);
      const vipEntitlement = entitlements?.active?.['MockMate! VIP'];
      
      // Update user
      await db.users.update({
        where: { revenuecatUserId: app_user_id },
        data: {
          isVip,
          vipExpiryDate: vipEntitlement?.expires_date 
            ? new Date(vipEntitlement.expires_date) 
            : null,
          vipEntitlementId: vipEntitlement?.id || null,
          vipUpdatedAt: new Date(),
        },
      });
      
      console.log(`[WEBHOOK] User ${app_user_id} VIP updated via webhook`);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('[WEBHOOK_ERROR]', error);
    return c.json({ success: false }, 500);
  }
});
```

## 🧪 Testing

### 1. Test endpoint trực tiếp:

```bash
# Mua VIP
curl -X PUT http://localhost:3000/api/v1/users/vip-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isVip": true,
    "vipExpiryDate": "2027-04-10T22:47:59.562Z",
    "entitlementIdentifier": "MockMate! VIP"
  }'

# Hủy VIP
curl -X PUT http://localhost:3000/api/v1/users/vip-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isVip": false,
    "vipExpiryDate": null,
    "entitlementIdentifier": null
  }'
```

### 2. Test flow hoàn chỉnh:

```typescript
// test/vip-sync.test.ts
describe('VIP Sync Flow', () => {
  it('should update user VIP status when app syncs', async () => {
    // 1. Create user
    const user = await createTestUser();
    
    // 2. Simulate app sync after purchase
    const response = await fetch('/api/v1/users/vip-status', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isVip: true,
        vipExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        entitlementIdentifier: 'MockMate! VIP',
      }),
    });
    
    // 3. Verify response
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.isVip).toBe(true);
    
    // 4. Verify database
    const updatedUser = await db.users.findUnique({
      where: { id: user.id },
    });
    expect(updatedUser.isVip).toBe(true);
    expect(updatedUser.vipExpiryDate).toBeDefined();
  });

  it('should handle VIP expiry', async () => {
    const user = await createTestUser();
    
    // Set VIP with past expiry date
    const pastDate = new Date(Date.now() - 1000).toISOString();
    
    const response = await fetch('/api/v1/users/vip-status', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isVip: false,
        vipExpiryDate: pastDate,
        entitlementIdentifier: null,
      }),
    });
    
    expect(response.status).toBe(200);
    const updatedUser = await db.users.findUnique({
      where: { id: user.id },
    });
    expect(updatedUser.isVip).toBe(false);
  });
});
```

## 📝 Logging & Monitoring

### Thêm logging để debug:

```typescript
// middleware/logging.ts
export const logVipSync = (userId: string, data: any) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: 'VIP_SYNC',
    userId,
    isVip: data.isVip,
    vipExpiryDate: data.vipExpiryDate,
    entitlementIdentifier: data.entitlementIdentifier,
  }));
};
```

### Metrics để track:

- Số lần sync thành công
- Số lần sync thất bại
- Thời gian response
- Số user có VIP active
- VIP expiry distribution

## ⚠️ Edge Cases

### 1. User mua VIP, app sync thất bại, webhook chạy
```
✅ Webhook sẽ cập nhật DB
✅ Lần sau app sync lại sẽ thành công
```

### 2. User restore, app sync thành công, webhook cũng chạy
```
✅ Cả 2 sẽ cập nhật cùng data
✅ Không có conflict vì data giống nhau
```

### 3. User hủy subscription trên RevenueCat
```
✅ App sẽ sync isVip = false
✅ Backend sẽ cập nhật DB
```

### 4. VIP hết hạn
```
✅ RevenueCat sẽ báo isVip = false
✅ App sẽ sync
✅ Backend sẽ cập nhật vipExpiryDate
```

## 🚀 Deployment Checklist

- [ ] Database migration chạy thành công
- [ ] Endpoint `/api/v1/users/vip-status` deployed
- [ ] JWT middleware hoạt động đúng
- [ ] Error handling đầy đủ
- [ ] Logging được setup
- [ ] Tests pass
- [ ] Webhook vẫn hoạt động
- [ ] Monitoring/alerts được setup
- [ ] Documentation cập nhật

## 📞 Support

Nếu có vấn đề:

1. Kiểm tra logs: `[VIP_SYNC]` entries
2. Kiểm tra database: `users.isVip`, `users.vipExpiryDate`
3. Kiểm tra JWT: Có valid không?
4. Kiểm tra network: App có kết nối được không?
5. Kiểm tra webhook: RevenueCat webhook có chạy không?
