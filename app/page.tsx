
"use client"

import { useEffect, useState } from "react"
import { Plus, Search, AlertTriangle, Package, Users, DollarSign, LogOut, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryList } from "@/components/inventory-list"
import { AddItemDialog } from "@/components/add-item-dialog"
import { StockTransactionDialog } from "@/components/stock-transaction-dialog"
import { SuppliersTab } from "@/components/suppliers-tab"
import { LoginForm } from "@/components/login-form"
import { UserManagement } from "@/components/user-management"

export default function InventoryDashboard() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(true)
  const [items, setItems] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false)
  const [isStockTransactionOpen, setIsStockTransactionOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchAllData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch items
        const itemsRes = await fetch("/api/items")
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json()
          setItems(itemsData)
        } else {
          console.error("Failed to fetch items")
        }

        // Fetch suppliers
        const suppliersRes = await fetch("/api/suppliers")
        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json()
          setSuppliers(suppliersData)
        } else {
          console.error("Failed to fetch suppliers")
        }

        // Fetch transactions
        const transactionsRes = await fetch("/api/transactions")
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json()
          setTransactions(transactionsData)
        } else {
          console.error("Failed to fetch transactions")
        }

      } catch (err) {
        console.error("Error fetching data:", err)
        setFetchError("Could not load data from database. Please check your database connection.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [user])

  // Calculate dashboard metrics
  const totalItems = items.length
  const lowStockItems = items.filter((item) => item.quantity <= item.min_stock)
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const totalSuppliers = suppliers.length

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddItem = async (newItem: any) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })
      
      if (response.ok) {
        // Refresh items list
        const res = await fetch("/api/items")
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleAddSupplier = async (newSupplier: any) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSupplier),
      })
      
      if (response.ok) {
        // Refresh suppliers list
        const res = await fetch("/api/suppliers")
        if (res.ok) {
          const data = await res.json()
          setSuppliers(data)
        }
      }
    } catch (error) {
      console.error('Error adding supplier:', error)
    }
  }

  const handleUpdateStock = async (itemId: number, quantity: number, type: string, notes: string) => {
    try {
      // Find the item to get its name
      const item = items.find((i) => i.id === itemId)
      if (!item) return

      // Create transaction record
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: itemId,
          item_name: item.name,
          quantity,
          type,
          notes,
          user: 'Current User'
        }),
      })

      // Update item quantity
      const newQuantity = type === "in" ? item.quantity + quantity : Math.max(0, item.quantity - quantity)
      
      await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity
        }),
      })

      // Refresh data
      const [itemsRes, transactionsRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/transactions")
      ])

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setItems(itemsData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

    } catch (error) {
      console.error('Error updating stock:', error)
    }
  }

  const handleStockAction = (item: any, action: string) => {
    setSelectedItem(item)
    setIsStockTransactionOpen(true)
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center py-12 text-slate-500">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4" />
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center py-12 text-slate-500">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4" />
          Loading inventory data...
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
        <Alert className="bg-red-50 border border-red-200 text-red-700 font-medium max-w-md">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Elegant Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Medical Inventory
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Manage your medical supplies with precision and care</p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user.name}</span>
              {user.level === 'admin' && <span className="ml-1 text-purple-600">(Admin)</span>}
            </span>
            <Button
              onClick={() => setIsAddItemOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Refined Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <Alert className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 font-medium">
              <strong>{lowStockItems.length} items</strong> are running low on stock and need attention.
            </AlertDescription>
          </Alert>
        )}

        {/* Beautiful Dashboard Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-white to-purple-50 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Total Items</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{totalItems}</div>
              <p className="text-xs text-slate-500 mt-1">Active inventory items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-amber-50 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Low Stock Alerts</CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{lowStockItems.length}</div>
              <p className="text-xs text-slate-500 mt-1">Items need restocking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-emerald-50 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Total Value</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Current inventory value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-cyan-50 shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Suppliers</CardTitle>
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Users className="h-4 w-4 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{totalSuppliers}</div>
              <p className="text-xs text-slate-500 mt-1">Active suppliers</p>
            </CardContent>
          </Card>
        </div>

        {/* Elegant Main Content Tabs */}
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className={`grid w-full ${user.level === 'admin' ? 'grid-cols-4' : 'grid-cols-3'} bg-white shadow-lg border border-slate-200`}>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 font-medium"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="suppliers"
              className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 font-medium"
            >
              Suppliers
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 font-medium"
            >
              Transactions
            </TabsTrigger>
            {user.level === 'admin' && (
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 font-medium"
              >
                <UserCog className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Refined Search Bar */}
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, category, or supplier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 h-12 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory List */}
            <InventoryList items={filteredItems} onStockAction={handleStockAction} />
          </TabsContent>

          <TabsContent value="suppliers">
            <SuppliersTab suppliers={suppliers} onAddSupplier={handleAddSupplier} />
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <CardTitle className="text-slate-900 text-xl font-bold">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-600">Track all stock movements and changes</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      No transactions found
                    </div>
                  ) : (
                    transactions.slice(0, 10).map((transaction, index) => (
                      <div
                        key={transaction.id || index}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          transaction.type === "in"
                            ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                            : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              transaction.type === "in" ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{transaction.item_name}</p>
                            <p className="text-sm text-slate-600">
                              {transaction.type === "in" ? "Stock In" : "Stock Out"} • {transaction.user}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900 text-lg">
                            {transaction.type === "in" ? "+" : "-"}
                            {transaction.quantity}
                          </p>
                          <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user.level === 'admin' && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>

        {/* Dialogs */}
        <AddItemDialog
          open={isAddItemOpen}
          onOpenChange={setIsAddItemOpen}
          onAddItem={handleAddItem}
          suppliers={suppliers}
        />

        <StockTransactionDialog
          open={isStockTransactionOpen}
          onOpenChange={setIsStockTransactionOpen}
          item={selectedItem}
          onUpdateStock={handleUpdateStock}
        />
      </div>
    </div>
  )
}
