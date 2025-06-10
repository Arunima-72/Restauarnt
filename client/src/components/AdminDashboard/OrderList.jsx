
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '../../axiosInterceptor';
import { Box, Typography } from '@mui/material';
// import './AdminOrdersList.css'; // Optional: for custom styles

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders();
    fetchDeliveryUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:3000/orders');
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        toast.error('Invalid orders format');
      }
    } catch (err) {
      toast.error('Failed to fetch orders');
      console.error(err);
    }
  };

  const fetchDeliveryUsers = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:3000/users?role=delivery');
      setDeliveryUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch delivery boys');
      console.error(err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`http://localhost:3000/orders/${orderId}/update-status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Error updating status');
      console.error(err);
    }
  };

  const assignDeliveryBoy = async (orderId, deliveryId) => {
    try {
      await axiosInstance.put(`http://localhost:3000/orders/${orderId}/assign`, { deliveryId });
      toast.success('Delivery assigned');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to assign delivery');
      console.error(err);
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = Array.isArray(orders)
    ? orders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <Box sx={{ p: 3 }}  style={{backgroundImage:"url('/images/reshome2.jpg')"}}>
     
    <div className="container mt-5">
      <h2 className="mb-4 text-center" style={{color:"orange"}}>🧾 All Orders</h2>

      <div className="table-responsive">
        <table className="table table-hover table-bordered shadow-sm">
          <thead >
            <tr>
              <th style={{color:"orange"}}>Order ID</th>
              <th style={{color:"orange"}}>User</th>
              <th style={{color:"orange"}}>Items</th>
              <th style={{color:"orange"}}>Total</th>
              <th style={{color:"orange"}}>Status</th>
              <th style={{color:"orange"}}>Payment</th>
              <th style={{color:"orange"}}>Assign Delivery</th>
              <th style={{color:"orange"}}>Delivery</th>
              <th style={{color:"orange"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user?.name || 'N/A'}<br></br>
                     📞 {order.phone || 'N/A'}<br />
                     🏠 {order.deliveryLocation?.address || 'N/A'}
                  </td>
                  <td>
                    <ul className="list-unstyled">
                      {order.items?.map((item, index) => (
                        <li key={index}>
                          {item.foodItem?.name || 'Unknown'} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.status}</td>
                  <td>{order.paymentMethod} ({order.paymentStatus})</td>
                  <td>
                    {(order.paymentStatus === 'paid' || order.paymentMethod === 'cash on delivery') ? (
                      <select
                        className="form-select"
                        onChange={(e) => assignDeliveryBoy(order._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select</option>
                        {deliveryUsers
                          .filter(user => user.available)
                          .map(delivery => (
                            <option key={delivery._id} value={delivery._id}>
                              {delivery.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span className="text-muted">Not eligible</span>
                    )}
                  </td>
                  <td>{order.deliveryPerson?.name || '-'}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="placed">Placed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                       <option value="assigned">Assigned</option>
                     
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
    </Box>
  );
};

export default AdminOrdersList;
