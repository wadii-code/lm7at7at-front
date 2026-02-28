import { useMemo, useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/types';

export function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">طلبات الزبائن</h1>
        
        <div className="flex items-center mb-4 space-x-4">
          <input
            type="text"
            placeholder="...ابحث عن طريق اسم الزبون او رقم الهاتف"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
            className="border p-2 rounded-md"
          >
            <option value="all">كل الحالات</option>
            <option value="Pending">قيد الانتظار</option>
            <option value="Confirmed">مؤكد</option>
            <option value="Shipped">تم الشحن</option>
            <option value="Delivered">تم التوصيل</option>
            <option value="Cancelled">ملغى</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">وقت التأكيد</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">رقم الطلب</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">اسم الزبون</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">رقم الهاتف</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">العنوان</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">عدد المنتجات</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">السعر الإجمالي</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">التاريخ</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">الحالة</th>
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
                  <td className="p-3 text-sm text-gray-700">{order.items.length}</td>
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
                      <option value="Pending">قيد الانتظار</option>
                      <option value="Confirmed">مؤكد</option>
                      <option value="Shipped">تم الشحن</option>
                      <option value="Delivered">تم التوصيل</option>
                      <option value="Cancelled">ملغى</option>
                    </select>
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