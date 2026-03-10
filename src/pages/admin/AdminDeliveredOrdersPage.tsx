import { useMemo } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDeliveredOrdersPage() {
  const { orders, removeOrder } = useOrderStore();

  const deliveredOrders = useMemo(() => {
    return orders.filter((order) => order.status === 'delivered');
  }, [orders]);

  const handleDeleteOrder = (orderId: string) => {
    removeOrder(orderId);
    toast.success('Order deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Delivered Orders</h1>

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
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">{new Date(order.date).toLocaleTimeString()}</td>
                  <td className="p-3 text-sm text-gray-700">{order.id}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.name}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.phone}</td>
                  <td className="p-3 text-sm text-gray-700">{order.customer.address}</td>
                  <td className="p-3 text-sm text-gray-700">{order.items.length}</td>
                  <td className="p-3 text-sm text-gray-700">DA {order.total.toFixed(2)}</td>
                  <td className="p-3 text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-3 text-sm">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}