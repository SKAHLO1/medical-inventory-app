# Medical Inventory Management System

A modern web application for managing medical inventory, suppliers, and stock transactions built with Next.js, React, and MySQL.

## Features

- 📦 **Inventory Management**: Track medical items, quantities, expiry dates, and locations
- 🏥 **Supplier Management**: Manage supplier information and ratings
- 📊 **Transaction Tracking**: Monitor stock in/out movements with detailed logs
- 👥 **User Management**: Role-based access (admin/user) with authentication
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔍 **Search & Filter**: Easily find items, suppliers, and transactions

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (version 8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **npm** or **pnpm** (comes with Node.js)

## Getting Started

### 1. Clone or Download the Project

If you downloaded the ZIP file, extract it to your desired location.

### 2. Install Dependencies

Open your terminal/command prompt and navigate to the project folder:

```bash
cd medical-inventory
```

Install the required packages:

```bash
# Using npm
npm install

# OR using pnpm (recommended)
pnpm install
```

### 3. Set Up the Database

1. **Start your MySQL server** (usually through XAMPP, WAMP, or direct MySQL installation)

2. **Create a new database**:
   ```sql
   CREATE DATABASE medical_inventory;
   ```

3. **Run the setup script**:
   - Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line)
   - Select the `medical_inventory` database
   - Import the `setup_database.sql` file located in the project root

   **Command line method**:
   ```bash
   mysql -u your_username -p medical_inventory < setup_database.sql
   ```

### 4. Configure Database Connection

Create a `.env.local` file in the project root and add your database configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=medical_inventory

# Session Secret (change this to a random string)
SESSION_SECRET=your-secret-key-here
```

**Important**: Replace `your_mysql_username` and `your_mysql_password` with your actual MySQL credentials.

### 5. Run the Application

Start the development server:

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The application will be available at: **http://localhost:3000**

## Default Login Credentials

The database comes with a default admin account:

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Important**: Change this password immediately after first login for security!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
medical-inventory/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── items/         # Inventory items API
│   │   ├── suppliers/     # Suppliers API
│   │   ├── transactions/  # Stock transactions API
│   │   └── users/         # User management API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main dashboard page
├── components/            # Reusable React components
├── lib/                  # Utility functions and database
├── public/               # Static assets
├── setup_database.sql    # Database schema and sample data
└── package.json         # Project dependencies
```

## Troubleshooting

### Database Connection Issues

1. **Check MySQL is running**: Ensure your MySQL server is started
2. **Verify credentials**: Double-check your `.env.local` file
3. **Check database exists**: Make sure you created the `medical_inventory` database
4. **Port conflicts**: MySQL typically runs on port 3306

### Port Already in Use

If port 3000 is busy, Next.js will automatically try port 3001, 3002, etc. You can also specify a custom port:

```bash
npm run dev -- -p 3001
```

### Module Not Found Errors

If you see import errors, try:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Need Help?

- Check the browser console for error messages
- Ensure all prerequisites are properly installed
- Verify your database connection and credentials
- Make sure the database schema was imported correctly

## Features Overview

### Dashboard
- Overview cards showing total items, suppliers, low stock alerts, and inventory value
- Quick access to all major functions

### Inventory Management
- Add, edit, and delete medical items
- Track quantities, minimum stock levels, and expiry dates
- Categorize items and assign suppliers
- Monitor stock levels with low stock alerts

### Supplier Management
- Maintain supplier contact information
- Rate suppliers and track performance
- View supplier-specific product counts

### Transaction Tracking
- Record stock in/out movements
- Maintain audit trail of all inventory changes
- Track who made changes and when

### User Management (Admin Only)
- Create and manage user accounts
- Assign user roles (admin/user)
- Control access permissions

Happy inventory management! 🏥📦
