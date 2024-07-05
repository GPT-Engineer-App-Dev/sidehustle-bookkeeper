import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  date: z.string().nonempty("Date is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["Income", "Expense"]),
  category: z.string().nonempty("Category is required"),
});

const AddTransaction = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(data);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    toast.success("Transaction added successfully!");
    navigate("/view-transactions");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Add New Transaction</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium">Date</label>
          <Input type="date" id="date" {...register("date")} />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
          <Input type="number" id="amount" step="0.01" {...register("amount", { valueAsNumber: true })} />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium">Type</label>
          <Select {...register("type")}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <Select {...register("category")}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nike">Nike</SelectItem>
              <SelectItem value="Adidas">Adidas</SelectItem>
              <SelectItem value="Puma">Puma</SelectItem>
              <SelectItem value="Reebok">Reebok</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>
        <Button type="submit">Add Transaction</Button>
      </form>
    </div>
  );
};

export default AddTransaction;