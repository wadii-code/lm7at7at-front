import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AdminOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus, removeOrder } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('pending');
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery);

                const matchesStatus =
                statusFilter === 'all' || (order.status === statusFilter && order.status !== 'delivered');

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;

    const success = await removeOrder(deleteOrderId);

    if (success) {
      toast.success('Order deleted successfully');
    } else {
      toast.error('Failed to delete order. You may not have the required permissions.');
    }
    setDeleteOrderId(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>
        
        <div className="flex items-center mb-4 space-x-4">
          <input
            type="text"
            placeholder="Search by customer name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            className="border p-2 rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered (View in Delivered Orders)</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Confirmation Time</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Phone Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Address</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Products</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Total Price</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{new Date(order.date).toLocaleTimeString()}</td>
                  <td className="p-3 text-sm text-gray-700">{order.id}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.name}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.phone}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.address}</td>
                  <td className="p-3 text-sm text-gray-700">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td className="p-3 text-sm text-gray-700">DA {order.total.toFixed(2)}</td>
                  <td className="p-3 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`p-1 rounded-md text-white ${
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'confirmed' ? 'bg-blue-500' :
                        order.status === 'shipped' ? 'bg-indigo-500' :
                        order.status === 'delivered' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 text-sm">
                    <Button variant="ghost" size="icon" onClick={() => setDeleteOrderId(order.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteOrderId !== null} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order
              and all its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}