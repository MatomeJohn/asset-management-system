# Quick Reference Guide - Asset Management System

## 🚀 Quick Start

### Run Both Servers
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev
# Open http://localhost:3000

# Terminal 2 - Backend  
cd backend
npm run dev
# API available at http://localhost:5000
```

### Login Credentials (Sample)
```
Email: admin@example.com
Password: password123
Role: ADMIN
```

---

## 📱 Responsive Breakpoints

```tsx
// Mobile-first approach
<div className="block md:flex lg:hidden">
//  ↓        ↓           ↓
// xs        md+         lg+
```

| Class | Screen | Usage |
|-------|--------|-------|
| `hidden md:block` | Hide mobile, show tablet+ | Sidebar |
| `block lg:hidden` | Show mobile/tablet, hide desktop | Hamburger |
| `text-sm md:text-base` | Small mobile, normal desktop | Font size |
| `p-4 md:p-8` | Padding mobile, tablet, desktop | Spacing |

---

## 🎨 Component Quick Copy

### Button
```tsx
<Button 
  variant="primary" 
  size="md" 
  onClick={handleClick}
  fullWidth
>
  Click Me
</Button>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="user@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
/>
```

### Select
```tsx
<Select
  label="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  options={[
    { value: 'IT', label: 'IT Assets' },
    { value: 'FURNITURE', label: 'Furniture' },
  ]}
/>
```

### Modal
```tsx
<Modal
  isOpen={isOpen}
  title="Add Asset"
  onClose={() => setIsOpen(false)}
  footer={<Button onClick={handleSave}>Save</Button>}
>
  {/* Form content */}
</Modal>
```

### Card
```tsx
<Card title="Dashboard" className="p-6">
  <p>Content here</p>
</Card>
```

---

## 🎯 Common Patterns

### Responsive Grid
```tsx
// 1 col mobile → 2 col tablet → 4 col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

### Responsive Form
```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input label="First Name" />
    <Input label="Last Name" />
  </div>
  <Input label="Email" fullWidth />
  <Button fullWidth>Submit</Button>
</form>
```

### Mobile Navigation
```tsx
const [mobileOpen, setMobileOpen] = useState(false)

<button 
  className="lg:hidden"
  onClick={() => setMobileOpen(!mobileOpen)}
>
  {mobileOpen ? <MdClose /> : <MdMenu />}
</button>

{mobileOpen && (
  <div className="lg:hidden">
    {/* Mobile menu items */}
  </div>
)}
```

### Responsive Table
```tsx
<div className="overflow-x-auto">
  <Table 
    headers={['Name', 'Email', 'Role']}
    data={users}
  />
</div>
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | name, email, password |
| POST | `/api/auth/login` | email, password |
| GET | `/api/auth/verify` | token in header |

### Assets
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/assets` | Get all assets |
| POST | `/api/assets` | Create asset |
| PATCH | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |
| PATCH | `/api/assets/:id/assign` | Assign to user |

### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Dashboard
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/dashboard/stats` | Get statistics |

---

## 🏪 State Management (Zustand)

### Auth Store
```tsx
import { useAuthStore } from '@/store'

const { user, token, login, logout, setUser } = useAuthStore()
```

### Asset Store
```tsx
import { useAssetStore } from '@/store'

const { assets, addAsset, deleteAsset, updateAsset } = useAssetStore()
```

### User Store
```tsx
// Access via API hooks
const { users, createUser, updateUser, deleteUser } = useUserStore()
```

---

## 🔧 Custom Hooks

### useAuth
```tsx
const { login, register, logout } = useAuth()

await login(email, password)
```

### useAssets
```tsx
const { 
  assets, 
  createAsset, 
  updateAsset, 
  deleteAsset,
  filterAssets 
} = useAssets()
```

### useMaintenance
```tsx
const { maintenanceItems } = useMaintenance()
```

---

## 📋 File Locations

| Purpose | Location |
|---------|----------|
| Pages | `frontend/src/pages/index.tsx` |
| UI Components | `frontend/src/components/ui.tsx` |
| Stores | `frontend/src/store/index.ts` |
| Hooks | `frontend/src/hooks/index.ts` |
| Types | `frontend/src/types/index.ts` |
| Utils | `frontend/src/utils/index.ts` |
| Routes | `backend/src/routes/index.ts` |
| Services | `backend/src/services/index.ts` |
| Middleware | `backend/src/middleware/index.ts` |

---

## 🎨 Tailwind Classes Cheatsheet

### Text Sizes
- `text-xs` - 12px
- `text-sm` - 14px (mobile default)
- `text-base` - 16px
- `text-lg` - 18px
- `text-xl` - 20px

### Colors
- `text-gray-700` - Dark gray text
- `bg-blue-600` - Blue background
- `border-red-500` - Red border
- `hover:bg-blue-700` - Hover state

### Spacing
- `p-4` - Padding 16px
- `m-2` - Margin 8px
- `gap-4` - Gap 16px between items
- `space-y-4` - Vertical spacing

### Responsive
- `hidden md:block` - Hide mobile, show tablet+
- `block lg:hidden` - Show mobile/tablet, hide desktop
- `p-4 md:p-8` - Responsive padding

### Shadows
- `shadow-sm` - Small shadow
- `shadow-md` - Medium shadow
- `shadow-lg` - Large shadow
- `hover:shadow-xl` - Extra large on hover

---

## 🐛 Debug Tips

### Check Responsive Size
```javascript
// In browser console
window.innerWidth  // Current viewport width
```

### Inspect Store
```jsx
import { useAuthStore } from '@/store'

// In component
const store = useAuthStore()
console.log(store)
```

### API Testing
```bash
# Test API with curl
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/assets

# Or use DevTools Network tab
# 1. Open DevTools (F12)
# 2. Go to Network tab
# 3. Perform action
# 4. Click request to see details
```

---

## 📱 Mobile Testing

### Chrome DevTools
1. Press `F12`
2. Click device icon or `Ctrl+Shift+M`
3. Select device preset
4. Test navigation and interactions

### Common Sizes
- iPhone SE: 375px
- iPhone 12/13: 390px
- iPhone 14 Pro Max: 430px
- Samsung Galaxy: 360px
- iPad: 768px

---

## 🚨 Common Issues & Fixes

### Issue: Hamburger menu not showing
**Solution**: Check `lg:hidden` class and screen size < 1024px

### Issue: Form input too small on mobile
**Solution**: Use `min-h-[44px]` for touch targets

### Issue: Table overflowing mobile
**Solution**: Wrap in `<div className="overflow-x-auto">`

### Issue: Modal doesn't fit
**Solution**: Use responsive height: `max-h-[95vh] sm:max-h-[90vh]`

### Issue: Text too small on mobile
**Solution**: Responsive font: `text-sm md:text-base`

---

## 📚 Documentation Links

- **Mobile Guide**: [MOBILE_RESPONSIVE_GUIDE.md](./MOBILE_RESPONSIVE_GUIDE.md)
- **Implementation**: [RESPONSIVE_IMPLEMENTATION.md](./RESPONSIVE_IMPLEMENTATION.md)
- **Testing**: [TESTING_RESPONSIVE_DESIGN.md](./TESTING_RESPONSIVE_DESIGN.md)
- **Project Summary**: [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md)

---

## ✅ Deployment Checklist

Before deploying:
- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile tested on real device
- [ ] Performance optimized
- [ ] Environment variables set
- [ ] Database migrated
- [ ] API endpoints verified
- [ ] CORS configured

---

## 🎯 Key Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+M` | Toggle responsive mode |
| `Ctrl+K` | Search DevTools |
| `Ctrl+Shift+Delete` | Clear cache |
| `Ctrl+L` | Focus address bar |

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files
- ✅ Keep secrets in environment variables
- ✅ Hash passwords before storing
- ✅ Use HTTPS in production
- ✅ Validate input on backend
- ✅ Use CORS wisely
- ✅ Implement rate limiting

---

## 📞 Quick Troubleshooting

**App won't start?**
```bash
npm install
npm run dev
```

**Port already in use?**
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

**Database issues?**
```bash
npx prisma migrate reset
npx prisma db push
```

**Hot reload not working?**
- Check terminal for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page
- Restart dev server

---

## 🎓 Developer Tips

1. **Always test responsive**: Use DevTools responsive mode
2. **Mobile first**: Style mobile, then add tablet/desktop
3. **Touch targets**: Minimum 44px for all interactive elements
4. **Accessibility**: Test with keyboard navigation
5. **Performance**: Check Network tab for slow requests
6. **Storage**: Use localStorage for client-side data
7. **Debugging**: Use console.log and DevTools
8. **Comments**: Document complex logic

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: ✅ Ready for Production
