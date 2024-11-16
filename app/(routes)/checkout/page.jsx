// app/checkout/page.jsx
"use client";
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function Checkout() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [cartItemList, setCartItemList] = useState([]);
  const [totalCartItem, setTotalCartItem] = useState(0);
  const [subtotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(null);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [zip, setZip] = useState();
  const [address, setAddress] = useState();
  const [useCod, setUseCod] = useState(false);

  const router = useRouter();
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/checkout/api'); // API route location
        const data = await res.json();

        if (data.error) {
          router.push('/sign-in');
        } else {
          setUser(data.user);
          setJwt(data.jwt);
          setCartItemList(data.cartItemList || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cartItemList.length > 0) {
      let total = cartItemList.reduce((acc, element) => {
        const amount = element.attributes?.amount || 0;
        const quantity = element.attributes?.quantity || 0;
        return acc + amount * quantity;
      }, 0);

      setSubTotal(total);
      setTotalAmount(total + total * 0.09 + 15);
    }
  }, [cartItemList]);

  const calculateTotalAmount = () => {
    const tax = subtotal * 0.09;
    const delivery = 15;
    return subtotal + tax + delivery;
  };

  const handleRazorpayPayment = () => {
    if (typeof window.Razorpay === 'undefined') {
      toast.error('Razorpay is not loaded. Please try again.');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalAmount * 100,
      currency: 'INR',
      name: 'Kirana',
      description: 'Test Transaction',
      handler: function (response) {
        onApprove({ paymentID: response.razorpay_payment_id });
      },
      prefill: {
        name: username,
        email: email,
        contact: phone,
      },
      notes: {
        address: address,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Payment failed:', response.error);
      toast.error('Payment failed. Please try again.');
    });
    rzp.open();
  };

  const onApprove = async (data) => {
    try {
      const payload = {
        data: {
          paymentId: data.paymentID || "COD",
          totalOrderAmount: Math.round(totalAmount),
          username,
          email,
          phone,
          zip,
          address,
          userId: user.id,
          orderItemList: cartItemList.map(item => ({
            product: item.attributes.products?.data[0].id,
            quantity: item.attributes.quantity,
            amount: item.attributes.amount,
          })),
          paymentStatus: data.paymentID ? "Paid" : "COD",
        }
      };

      const response = await GlobalApi.createOrder(payload, jwt);
      toast('Order placed successfully');
      await Promise.all(
        cartItemList.map(item => GlobalApi.deleteCartItem(item.id, jwt))
      );
      router.replace('/order-confirmation');
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error('Failed to place order');
    }
  };

  return (
    <div>
      <h2 className='p-3 bg-primary text-2xl font-bold text-center text-white'> Checkout </h2>
      {/* Your existing checkout component JSX here */}
    </div>
  );
}

export default Checkout;
