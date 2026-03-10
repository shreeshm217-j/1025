# DK Pizza Cafe - HTML/CSS/JavaScript Website

A modern, fully functional pizza restaurant website built with pure HTML, CSS, and JavaScript. No backend or database required - all data is stored in the browser's localStorage.

## Features

### Customer-Facing Features
- **Homepage**: Hero section with ratings, services, about, reviews, and location
- **Menu Page**: Browse menu by categories (Pizzas, Garlic Bread, Burgers, Pasta, Fries & Sides, Beverages)
- **Shopping Cart**: Add items, adjust quantities, view total
- **WhatsApp Ordering**: One-click order generation with formatted message
- **Responsive Design**: Mobile-first, works on all devices
- **Floating WhatsApp Button**: Quick access from any page

### Admin Features
- **Authentication**: Simple login/signup system (localStorage-based)
- **Menu Management**: Add, edit, delete menu items with images
- **Settings Management**: Update opening hours, phone, address, price range
- **Order Tracking**: View all WhatsApp orders placed
- **Dashboard**: Organized tabs for menu, orders, and settings

## Project Structure

```
html-project/
├── index.html              # Homepage
├── menu.html              # Menu page
├── admin-login.html       # Admin login/signup
├── admin-dashboard.html   # Admin dashboard
├── css/
│   └── styles.css         # All styles
└── js/
    ├── data.js            # localStorage data management
    ├── app.js             # Shared utilities (cart, WhatsApp)
    ├── menu.js            # Menu page logic
    └── admin.js           # Admin dashboard logic
```

## How to Use

### For Customers

1. **Browse Website**: Open `index.html` in any browser
2. **View Menu**: Click "View Menu" or navigate to `menu.html`
3. **Add to Cart**: Browse items and click "Add to Cart"
4. **Order on WhatsApp**: 
   - Click cart icon (top-right)
   - Review your order
   - Click "Order on WhatsApp"
   - Message with order details opens in WhatsApp

### For Restaurant Owner

1. **First Time Setup**:
   - Go to `/admin-login.html`
   - Click "Don't have an account? Sign up"
   - Create admin account with email and password
   - Login automatically redirects to dashboard

2. **Manage Menu**:
   - Dashboard → Menu tab
   - Add new items with "Add Item" button
   - Edit existing items
   - Delete items you no longer offer

3. **Update Settings**:
   - Dashboard → Settings tab
   - Update opening hours, phone, address, price range
   - Click "Save Settings"

4. **View Orders**:
   - Dashboard → Orders tab
   - See all WhatsApp orders with timestamps and items

## Data Storage

All data is stored in browser's localStorage:
- **menuItems**: Array of menu items
- **settings**: Cafe settings (hours, phone, address)
- **cart**: Current shopping cart
- **orders**: Order history
- **adminUser**: Admin credentials
- **isAdminLoggedIn**: Login status

### Exporting/Backing Up Data

To backup your menu and settings:
```javascript
// In browser console
console.log(localStorage.getItem('menuItems'));
console.log(localStorage.getItem('settings'));
```

Copy the output and save it. To restore, paste it back into localStorage.

## Customization

### Change WhatsApp Number
Edit the phone number in:
- `js/app.js`: Line with `const phoneNumber = '919956407087'`

### Modify Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary: #D9381E;      /* Main red color */
    --secondary: #F2A900;    /* Gold color */
    --background: #121212;   /* Dark background */
    /* ... other colors */
}
```

### Add/Remove Categories
Edit the category list in:
- `menu.html`: Category filter buttons
- `admin-dashboard.html`: Category dropdown in modal
- `js/data.js`: Sample menu items

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select main branch
5. Your site will be live at `https://username.github.io/repo-name`

### Option 2: Netlify (Free)
1. Drag and drop the `html-project` folder to netlify.com
2. Your site is live instantly

### Option 3: Any Web Host
Upload the entire `html-project` folder to your web hosting via FTP.

## Security Notes

⚠️ **Important**: This is a simple localStorage-based authentication system suitable for small businesses with 1-2 admin users. For production use with multiple administrators, consider:
- Implementing a proper backend with secure authentication
- Using HTTPS for your website
- Not storing sensitive data in localStorage

## Sample Admin Credentials

After creating an account, credentials are stored in browser localStorage. There's no "forgot password" feature - if you forget your password, you'll need to clear localStorage and create a new account.

## Support

For issues or questions, refer to the code comments in each JavaScript file. All functions are well-documented.

## License

Free to use and modify for your restaurant business.
