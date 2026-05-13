# Cách Sử Dụng VIP Status Trong App

## 1. Kiểm Tra Trạng Thái VIP

### Từ RevenueCat (Real-time, Local)

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";

const MyComponent = () => {
  const { isPro, proExpiryDate, isLoading } = useRevenueCatContext();

  if (isLoading) {
    return <Text>Đang tải...</Text>;
  }

  return (
    <View>
      {isPro ? (
        <Text>Bạn là VIP! Hết hạn: {proExpiryDate}</Text>
      ) : (
        <Text>Nâng cấp lên VIP để mở khóa tính năng</Text>
      )}
    </View>
  );
};
```

### Từ Backend (Cross-device, Persistent)

```typescript
import { useProfile } from "@/hooks/useProfile";

const MyComponent = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <Text>Đang tải...</Text>;
  }

  return (
    <View>
      {profile?.isVip ? (
        <Text>VIP từ server: {profile.vipExpiryDate}</Text>
      ) : (
        <Text>Không phải VIP</Text>
      )}
    </View>
  );
};
```

## 2. Mua Gói VIP

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";
import { useState } from "react";

const SubscriptionScreen = () => {
  const { purchasePlan, isPurchaseInProgress, yearlyPackage, monthlyPackage } = 
    useRevenueCatContext();
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (plan: "yearly" | "monthly") => {
    try {
      setError(null);
      const customerInfo = await purchasePlan(plan);
      
      if (customerInfo) {
        // ✅ Đã tự động đồng bộ với backend
        Alert.alert("Thành công!", "Bạn đã trở thành VIP!");
      } else {
        // User đã hủy
        console.log("Purchase cancelled");
      }
    } catch (err) {
      setError(err.message);
      Alert.alert("Lỗi", "Không thể mua gói VIP");
    }
  };

  return (
    <View>
      {yearlyPackage && (
        <TouchableOpacity 
          onPress={() => handlePurchase("yearly")}
          disabled={isPurchaseInProgress}
        >
          <Text>Mua gói năm: {yearlyPackage.product.priceString}</Text>
        </TouchableOpacity>
      )}

      {monthlyPackage && (
        <TouchableOpacity 
          onPress={() => handlePurchase("monthly")}
          disabled={isPurchaseInProgress}
        >
          <Text>Mua gói tháng: {monthlyPackage.product.priceString}</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};
```

## 3. Restore Purchases

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";

const SettingsScreen = () => {
  const { restorePurchases, isPurchaseInProgress } = useRevenueCatContext();

  const handleRestore = async () => {
    try {
      const customerInfo = await restorePurchases();
      
      if (customerInfo?.entitlements.active["MockMate! VIP"]) {
        // ✅ Đã tự động đồng bộ với backend
        Alert.alert("Thành công!", "Đã khôi phục gói VIP của bạn!");
      } else {
        Alert.alert("Thông báo", "Không tìm thấy gói VIP nào");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể khôi phục gói VIP");
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleRestore}
      disabled={isPurchaseInProgress}
    >
      <Text>Khôi phục gói đã mua</Text>
    </TouchableOpacity>
  );
};
```

## 4. Hiển Thị Paywall

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";

const FeatureScreen = () => {
  const { isPro, presentPaywall } = useRevenueCatContext();

  const handleFeatureAccess = async () => {
    if (isPro) {
      // User đã là VIP, cho phép truy cập
      navigateToFeature();
      return;
    }

    // Hiển thị paywall
    const result = await presentPaywall();
    
    if (result === "PURCHASED" || result === "RESTORED") {
      // ✅ Đã tự động đồng bộ với backend
      Alert.alert("Chào mừng VIP!", "Bạn đã mở khóa tất cả tính năng");
      navigateToFeature();
    }
  };

  return (
    <TouchableOpacity onPress={handleFeatureAccess}>
      <Text>{isPro ? "Truy cập tính năng" : "Nâng cấp VIP"}</Text>
    </TouchableOpacity>
  );
};
```

## 5. Quản Lý Subscription

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";

const ManageSubscriptionScreen = () => {
  const { 
    isPro, 
    proExpiryDate, 
    proEntitlementIdentifier,
    presentCustomerCenter 
  } = useRevenueCatContext();

  return (
    <View>
      {isPro ? (
        <>
          <Text>Trạng thái: VIP</Text>
          <Text>Gói: {proEntitlementIdentifier}</Text>
          <Text>Hết hạn: {new Date(proExpiryDate).toLocaleDateString()}</Text>
          
          <TouchableOpacity onPress={presentCustomerCenter}>
            <Text>Quản lý subscription</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Bạn chưa có gói VIP</Text>
      )}
    </View>
  );
};
```

## 6. Kết Hợp RevenueCat + Backend

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";
import { useProfile } from "@/hooks/useProfile";

const VIPStatusScreen = () => {
  const { isPro: isProLocal, isLoading: rcLoading } = useRevenueCatContext();
  const { profile, isLoading: profileLoading } = useProfile();

  // Ưu tiên RevenueCat (real-time), fallback về backend
  const isVip = isProLocal || profile?.isVip || false;
  const isLoading = rcLoading || profileLoading;

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Trạng thái VIP: {isVip ? "Có" : "Không"}</Text>
      <Text>Nguồn: {isProLocal ? "RevenueCat" : "Backend"}</Text>
    </View>
  );
};
```

## 7. Protected Route/Feature

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";
import { useRouter } from "expo-router";

const ProtectedFeature = () => {
  const { isPro, isReady } = useRevenueCatContext();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isPro) {
      // Redirect to subscription page
      router.replace("/vip/vipSubscription");
    }
  }, [isPro, isReady]);

  if (!isReady) {
    return <ActivityIndicator />;
  }

  if (!isPro) {
    return null; // Will redirect
  }

  return (
    <View>
      <Text>Tính năng VIP độc quyền</Text>
    </View>
  );
};
```

## 8. Refresh VIP Status Manually

```typescript
import { useRevenueCatContext } from "@/core/revenuecat-provider";
import { useProfile } from "@/hooks/useProfile";

const RefreshButton = () => {
  const { refreshRevenueCat, isLoading: rcLoading } = useRevenueCatContext();
  const { mutateProfile, isLoading: profileLoading } = useProfile();

  const handleRefresh = async () => {
    // Refresh cả 2 nguồn
    await Promise.all([
      refreshRevenueCat(),
      mutateProfile(), // Revalidate SWR cache
    ]);
    
    Alert.alert("Đã làm mới", "Trạng thái VIP đã được cập nhật");
  };

  return (
    <TouchableOpacity 
      onPress={handleRefresh}
      disabled={rcLoading || profileLoading}
    >
      <Text>Làm mới trạng thái VIP</Text>
    </TouchableOpacity>
  );
};
```

## Best Practices

### ✅ Nên làm:

1. **Ưu tiên RevenueCat cho UI real-time**
   ```typescript
   const { isPro } = useRevenueCatContext();
   if (isPro) {
     // Show VIP features immediately
   }
   ```

2. **Dùng backend làm fallback**
   ```typescript
   const isVip = isPro || profile?.isVip || false;
   ```

3. **Kiểm tra `isReady` trước khi dùng**
   ```typescript
   if (!isReady) return <Loading />;
   ```

4. **Handle loading states**
   ```typescript
   if (isPurchaseInProgress) {
     return <ActivityIndicator />;
   }
   ```

### ❌ Không nên:

1. **Không tự gọi sync thủ công** - Đã tự động
   ```typescript
   // ❌ KHÔNG CẦN
   await purchasePlan("yearly");
   await syncVipStatus(); // Đã tự động rồi!
   ```

2. **Không tin backend 100%** - Có thể bị delay
   ```typescript
   // ❌ SAI
   const isVip = profile?.isVip; // Có thể outdated
   
   // ✅ ĐÚNG
   const isVip = isPro || profile?.isVip;
   ```

3. **Không block UI khi sync**
   ```typescript
   // ❌ SAI
   await syncVipStatus();
   showFeature();
   
   // ✅ ĐÚNG
   void syncVipStatus(); // Background sync
   showFeature(); // Show immediately
   ```
