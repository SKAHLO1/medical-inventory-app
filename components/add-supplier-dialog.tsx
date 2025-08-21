"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategorySelector } from "@/components/category-selector"

interface AddSupplierDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddSupplier: (supplier: any) => void
}

export function AddSupplierDialog({ open, onOpenChange, onAddSupplier }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    rating: "",
    products_count: "",
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddSupplier({
      ...formData,
      rating: Number.parseFloat(formData.rating),
      products_count: Number.parseInt(formData.products_count),
    })
    setFormData({
      name: "",
      category: "",
      phone: "",
      email: "",
      address: "",
      rating: "",
      products_count: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Add New Supplier</DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the supplier details to add them to your database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Supplier Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter supplier name"
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 font-medium">Category</Label>
              <CategorySelector
                type="supplier"
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
                placeholder="Select category"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="contact@supplier.com"
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-700 font-medium">
              Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Enter full address"
              required
              className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-slate-700 font-medium">
                Rating (1-5) *
              </Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                placeholder="4.5"
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="products_count" className="text-slate-700 font-medium">
                Products Count *
              </Label>
              <Input
                id="products_count"
                type="number"
                value={formData.products_count}
                onChange={(e) => setFormData((prev) => ({ ...prev, products_count: e.target.value }))}
                placeholder="25"
                required
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
            >
              Add Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}