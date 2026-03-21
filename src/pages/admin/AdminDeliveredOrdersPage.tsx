import { useEffect, useMemo, useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminDeliveredOrdersPage() {
  const { orders, fetchDeliveredOrders, removeOrder } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDeliveredOrders();
  }, [fetchDeliveredOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery)
      );
    });
  }, [orders, searchQuery]);

  const handleDelete = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const success = await removeOrder(orderId);
      if (success) {
        toast.success('Order deleted successfully');
      } else {
        toast.error('Failed to delete order');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>
        
        <div className="flex items-center mb-4">
          <input
            type="text"
            placeholder="Search by customer name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md flex-1 max-w-md"
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Confirmation Time</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Order Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Customer Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Phone Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Total Price</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
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
                  <td className="p-3 text-sm text-gray-700">DA {order.total.toFixed(2)}</td>
                  <td className="p-3 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm text-gray-700">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="text-gray-500 text-center py-8">No delivered orders found.</p>
        )}
      </div>
    </div>
  );
}