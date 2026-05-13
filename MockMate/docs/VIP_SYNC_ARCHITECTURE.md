# Kiến Trúc Đồng Bộ VIP Status

## Vấn Đề

Trước đây có 2 "nguồn chân lý" về trạng thái VIP:

1. **RevenueCat (Local)**: `isPro` được tính từ `customerInfo` trên điện thoại
2. **PostgreSQL (Backend)**: `isVip` được lưu trong database qua HonoJS API

**Hậu quả**: Nếu user mua VIP, RevenueCat báo `isPro = true` ngay lập tức, nhưng webhook backend chưa kịp chạy → DB vẫn `isVip = false`. Khi user xóa app hoặc đăng nhập máy khác, họ mất VIP.

## Giải Pháp: "Nối Cầu" Tuyệt Đối

Chúng ta **không bỏ cái nào**, mà **đồng bộ 2 chiều**:

- **RevenueCat**: Quản lý giao dịch, UI mua hàng (nhanh, real-time)
- **Backend PostgreSQL**: Nguồn chân lý chính thức (persistent, cross-device)
- **Cầu nối**: Sau mỗi thay đổi từ RevenueCat → gọi API đồng bộ ngay lập tức

## Luồng Hoạt Động

```
User mua VIP
    ↓
RevenueCat.purchasePackage()
    ↓
customerInfo updated (isPro = true)
    ↓
syncVipStatusToBackend() ← GỌI NGAY
    ↓
Backend API: PUT /api/v1/users/vip-status
    ↓
PostgreSQL: UPDATE users SET isVip = true
    ↓
✅ 2 nguồn đã đồng bộ
```

## Các Điểm Đồng Bộ

### 1. **Sau khi mua gói** (`purchasePlan`)
```typescript
const latestCustomerInfo = await purchaseSelectedPackage(selectedPackage);
if (latestCustomerInfo) {
    setCustomerInfo(latestCustomerInfo);
    await syncVipStatusToBackendIfNeeded(latestCustomerInfo); // ← Đồng bộ ngay
}
```

### 2. **Sau khi restore** (`restorePurchases`)
```typescript
const latestCustomerInfo = await restoreRevenueCatPurchases();
setCustomerInfo(latestCustomerInfo);
await syncVipStatusToBackendIfNeeded(latestCustomerInfo); // ← Đồng bộ ngay
```

### 3. **Sau khi dùng paywall** (`presentPaywall`)
```typescript
if (result === "PURCHASED" || result === "RESTORED") {
    await refreshRevenueCat();
    const latestCustomerInfo = await getCustomerInfo();
    await syncVipStatusToBackendIfNeeded(latestCustomerInfo); // ← Đồng bộ ngay
}
```

### 4. **Khi customerInfo thay đổi** (listener)
```typescript
addCustomerInfoListener((updatedCustomerInfo) => {
    setCustomerInfo(updatedCustomerInfo);
    void syncVipStatusToBackendIfNeeded(updatedCustomerInfo); // ← Đồng bộ tự động
});
```

### 5. **Khi user đăng nhập** (initial sync)
```typescript
await identifyRevenueCatUser(user.$id);
await refreshRevenueCat();
const latestCustomerInfo = await getCustomerInfo();
await syncVipStatusToBackendIfNeeded(latestCustomerInfo); // ← Đồng bộ ban đầu
```

## API Endpoint Mới

### `PUT /api/v1/users/vip-status`

**Request Body:**
```json
{
  "isVip": true,
  "vipExpiryDate": "2027-04-10T22:46:42.199Z",
  "entitlementIdentifier": "MockMate! VIP"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "isVip": true,
    "vipExpiryDate": "2027-04-10T22:46:42.199Z"
  }
}
```

## Tối Ưu: Tránh Đồng Bộ Trùng Lặp

Sử dụng `lastSyncedVipStatusRef` để chỉ đồng bộ khi có thay đổi thực sự:

```typescript
const hasVipStatusChanged =
    lastSyncedVipStatusRef.current.isPro !== newIsPro ||
    lastSyncedVipStatusRef.current.expiryDate !== newExpiryDate ||
    lastSyncedVipStatusRef.current.entitlementId !== newEntitlementId;

if (!hasVipStatusChanged) {
    return; // Skip sync
}
```

## Files Đã Thay Đổi

1. **`core/appwrite.ts`**
   - Thêm `syncVipStatusToBackend()` function
   - Thêm `VipStatusSyncPayload` interface

2. **`hooks/useSyncVipStatus.ts`** (NEW)
   - Hook SWR mutation cho VIP sync

3. **`core/revenuecat-provider.tsx`**
   - Thêm `syncVipStatusToBackendIfNeeded()` callback
   - Gọi sync sau mỗi purchase/restore/paywall
   - Gọi sync khi customerInfo listener trigger
   - Gọi sync khi user đăng nhập

## Xử Lý Lỗi

- Nếu sync thất bại, **không throw error** (background operation)
- Log error để debug
- RevenueCat vẫn là nguồn chân lý tạm thời
- Webhook backend sẽ là fallback nếu sync thất bại

## Testing Checklist

- [ ] User mua VIP → kiểm tra DB có `isVip = true`
- [ ] User restore → kiểm tra DB cập nhật đúng
- [ ] User xóa app, cài lại → vẫn có VIP (từ DB)
- [ ] User đăng nhập máy khác → vẫn có VIP
- [ ] Mất mạng khi mua → webhook backend vẫn cập nhật sau
- [ ] VIP hết hạn → cả RevenueCat và DB đều `false`

## Lưu Ý Backend

Backend cần implement endpoint:

```typescript
// PUT /api/v1/users/vip-status
app.put('/api/v1/users/vip-status', async (c) => {
  const { isVip, vipExpiryDate, entitlementIdentifier } = await c.req.json();
  const userId = c.get('userId'); // From JWT

  await db.users.update({
    where: { id: userId },
    data: {
      isVip,
      vipExpiryDate: vipExpiryDate ? new Date(vipExpiryDate) : null,
      vipEntitlementId: entitlementIdentifier,
    },
  });

  return c.json({ success: true });
});
```

## Kết Luận

✅ RevenueCat = UI nhanh, trải nghiệm tốt
✅ PostgreSQL = Nguồn chân lý chính thức
✅ Sync tự động = Đảm bảo nhất quán
✅ Không mất VIP khi đổi thiết bị
