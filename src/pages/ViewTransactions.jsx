import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  date: z.string().nonempty("Date is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["Income", "Expense"]),
  category: z.string().nonempty("Category is required"),
});

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(storedTransactions);
  }, []);

  const handleDelete = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success("Transaction deleted successfully!");
  };

  const handleEdit = (index) => {
    setEditTransaction({ ...transactions[index], index });
  };

  const handleSave = (data) => {
    const updatedTransactions = transactions.map((transaction, i) =>
      i === data.index ? { date: data.date, amount: data.amount, type: data.type, category: data.category } : transaction
    );
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setEditTransaction(null);
    toast.success("Transaction updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl mb-4">View Transactions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(index)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editTransaction && (
        <Dialog open={!!editTransaction} onOpenChange={() => setEditTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            <EditTransactionForm transaction={editTransaction} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const EditTransactionForm = ({ transaction, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: transaction,
  });

  const onSubmit = (data) => {
    onSave({ ...data, index: transaction.index });
  };

  return (
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
      <Button type="submit">Save</Button>
    </form>
  );
};

export default ViewTransactions;