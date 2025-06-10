
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInterceptor';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state;
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    if (!orderDetails) {
      toast.error('No order data found.');
      navigate('/cart');
      return;
    }

    const initiatePayment = async () => {
      try {
        const { data: order } = await axiosInstance.post('http://localhost:3000/payment/create-order', {
          amount: orderDetails.totalPrice,
        });

        const options = {
          key: 'rzp_test_M5fgVxSzV8AOc8',
          amount: order.amount,
          currency: 'INR',
          name: 'Foodie Bites',
          description: 'Food Order Payment',
          order_id: order.id,
          handler: async function (response) {
            try {
              await axiosInstance.post('http://localhost:3000/orders', {
                ...orderDetails,
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'paid',
              });

              setPaymentInfo({
                paymentId: response.razorpay_payment_id,
                amount: orderDetails.totalPrice,
                date: new Date().toLocaleString(),
                customer: orderDetails.name || 'Customer',
                phone: orderDetails.phone,
                items: orderDetails.cart || [],
              });

              toast.success('Payment successful! Order placed.');
              // setTimeout(() => navigate('/orders'), 7000);
            } catch (err) {
              console.error(err);
              toast.error('Order saving failed after payment!');
            }
          },
          prefill: {
            name: orderDetails.name || 'Customer',
            email: 'test@example.com',
            contact: orderDetails.phone,
          },
          theme: {
            color: '#F37254',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        toast.error('Payment initiation failed!');
      }
    };

    initiatePayment();
  }, [orderDetails, navigate]);
const handleDownloadReceipt = async () => {
  const doc = new jsPDF();

  const logo = await toBase64('/logo.png');

  doc.addImage(logo, 'PNG', 15, 10, 30, 20);
  doc.setFontSize(18);
  doc.text('Foodie Bites – Payment Receipt', 60, 20);

  doc.setFontSize(12);
  let y = 40;
  doc.text(`Customer: ${paymentInfo.customer}`, 15, y);
  doc.text(`Contact: ${paymentInfo.phone}`, 15, y + 10);
  doc.text(`Payment ID: ${paymentInfo.paymentId}`, 15, y + 20);
  doc.text(`Date: ${paymentInfo.date}`, 15, y + 30);

  y += 40;

  // Prepare table rows
  const tableBody = paymentInfo.items.map((item) => [
    item.name,
    item.quantity,
    `₹${item.price}`,
    `₹${item.price * item.quantity}`,
  ]);

  doc.autoTable({
    startY: y,
    head: [['Item Name', 'Quantity', 'Price', 'Total']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [243, 114, 84] }, // Foodie Bites orange
    styles: {
      halign: 'center',
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'left' }, // Item name left-aligned
    },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`Total Paid: ₹${paymentInfo.amount}`, 15, finalY);

  doc.save('FoodieBites_Receipt.pdf');
};
// Utility to convert image to base64
// const toBase64 = (url) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     fetch(url)
//       .then(res => res.blob())
//       .then(blob => {
//         reader.readAsDataURL(blob);
//         reader.onloadend = () => resolve(reader.result);
//         reader.onerror = reject;
//       });
//   });
// };

  // // 🧾 Generate enhanced PDF receipt
  // const handleDownloadReceipt = async () => {
  //   const doc = new jsPDF();

  //   // Load logo as Base64
  //   const logo = await toBase64('/logo.png');

  //   doc.addImage(logo, 'PNG', 15, 10, 40, 20);
  //   doc.setFontSize(18);
  //   doc.text('Foodie Bites – Payment Receipt', 60, 20);

  //   doc.setFontSize(12);
  //   let y = 40;
  //   doc.text(`Customer: ${paymentInfo.customer}`, 15, y);
  //   doc.text(`Contact: ${paymentInfo.phone}`, 15, y + 10);
  //   doc.text(`Payment ID: ${paymentInfo.paymentId}`, 15, y + 20);
  //   doc.text(`Date: ${paymentInfo.date}`, 15, y + 30);

  //   y += 45;
  //   doc.setFontSize(14);
  //   doc.text('Order Summary:', 15, y);

  //   doc.setFontSize(12);
  //   y += 10;
  //   paymentInfo.items.forEach((item, index) => {
  //     doc.text(
  //       `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`,
  //       15,
  //       y
  //     );
  //     y += 10;
  //   });

  //   y += 5;
  //   doc.setFontSize(14);
  //   doc.text(`Total Paid: ₹${paymentInfo.amount}`, 15, y);

  //   doc.save('FoodieBites_Receipt.pdf');
  // };

  // // Utility to convert image to base64
  // const toBase64 = (url) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     fetch(url)
  //       .then(res => res.blob())
  //       .then(blob => {
  //         reader.readAsDataURL(blob);
  //         reader.onloadend = () => resolve(reader.result);
  //         reader.onerror = reject;
  //       });
  //   });
  // };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'initial',
    }}>
      {paymentInfo ? (
        <>
          <h2>✅ Payment Successful!</h2>
          <p><strong>Payment ID:</strong> {paymentInfo.paymentId}</p>
          <p><strong>Amount Paid:</strong> ₹{paymentInfo.amount}</p>
          <p><strong>Date:</strong> {paymentInfo.date}</p>
          <button onClick={handleDownloadReceipt} style={{ marginTop: '1rem', padding: '10px 20px' }}>
            Download PDF Receipt
          </button>
           <button
          onClick={() => navigate('/orders')}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            backgroundColor: '#f37254',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          OK
        </button>
         
        </>
      ) : (
        <h3>Redirecting to Razorpay...</h3>
      )}
    </div>
  );
};

export default Payment;
