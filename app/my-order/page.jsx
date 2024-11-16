"use client"; // Ensure this runs on the client side only

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalApi from '@/app/_utils/GlobalApi';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import moment from 'moment';
import MyOrderItem from './_components/MyOrderItem';

function MyOrder() {
    const [mounted, setMounted] = useState(false);
    const jwt = sessionStorage.getItem('jwt');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const router = useRouter();
    const [orderList, setOrderList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setMounted(true); // Set mounted to true once the component is mounted
        if (!jwt || !user) {
            router.replace('/');
        } else {
            fetchMyOrders();
        }
    }, [jwt, user, router]);

    const fetchMyOrders = async () => {
        try {
            const orders = await GlobalApi.getMyOrder(user.id, jwt);
            setOrderList(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError('Failed to load your orders. Please try again later.');
        }
    };

    const getTrackingStageClass = (index, trackingStatus) => {
        const stages = ['order_placed', 'preparing', 'on_the_way', 'delivered'];
        const currentStatusIndex = stages.indexOf(trackingStatus);
        if (index < currentStatusIndex) {
            return 'text-green-500';  // Completed stages
        } else if (index === currentStatusIndex) {
            return 'text-blue-500';   // Current stage
        } else {
            return 'text-gray-400';   // Upcoming stages
        }
    };

    const trackingStages = ['Order Placed', 'Preparing', 'On the Way', 'Delivered'];

    if (!mounted) return null; // Prevent server-side rendering issues by not rendering the page before the client is ready

    return (
        <div>
            <h2 className='p-3 bg-primary text-2xl font-bold text-center text-white'>My Order</h2>
            <div className='py-8 mx-7 md:mx-20'>
                <h2 className='text-3xl font-bold text-primary'>Order History</h2>

                {/* Display error if there's an issue fetching orders */}
                {error && <div className="text-red-500">{error}</div>}

                <div>
                    {orderList.length === 0 ? (
                        <div className="text-center">Loading your orders...</div>
                    ) : (
                        orderList.map((order) => (
                            <Collapsible key={order.id}>
                                <CollapsibleTrigger>
                                    <div className='p-2 border bg-slate-100 flex justify-evenly gap-24'>
                                        <h2><span className='font-semibold mr-2'>Order Date:</span> {moment(order.createdAt).format('DD/MMM/YYYY')}</h2>
                                        <h2><span className='font-semibold mr-2'>Total Amount: </span>{order.totalOrderAmount}</h2>
                                        <h2><span className='font-semibold mr-2'>Status: </span>CASH ON DELIVERY {order.paymentStatus}</h2>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="p-4">
                                        {/* Order items */}
                                        {order.orderItemList.map((item) => (
                                            <MyOrderItem key={item.id} orderItem={item} />
                                        ))}

                                        {/* Tracking progress */}
                                        <div className='mt-5'>
                                            <h3 className='font-semibold text-lg'>Order Tracking:</h3>
                                            <div className='flex justify-around mt-4'>
                                                {trackingStages.map((stage, index) => (
                                                    <div key={stage} className='text-center'>
                                                        <div className={`${getTrackingStageClass(index, order.trackingStatus)}`}>
                                                            <span className='text-2xl'>
                                                                {index <= trackingStages.indexOf(order.trackingStatus) ? '✔' : '○'}
                                                            </span>
                                                        </div>
                                                        <p>{stage}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyOrder;
