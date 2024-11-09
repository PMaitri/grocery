"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalApi from '@/app/_utils/GlobalApi';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from 'moment';
import MyOrderItem from './_components/MyOrderItem';

function MyOrder() {
    const jwt = sessionStorage.getItem('jwt'); 
    const user = JSON.parse(sessionStorage.getItem('user'));
    const router = useRouter();
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        if (!jwt) {
            router.replace('/');
        } else {
            fetchMyOrders();
        }
    }, [jwt, router]);

    const fetchMyOrders = async () => {
        try {
            const orders = await GlobalApi.getMyOrder(user.id, jwt);
            console.log(orders);  // For debugging purposes
            setOrderList(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Add the getTrackingStageClass function here
    const getTrackingStageClass = (index, trackingStatus) => {
        const stages = ['order_placed', 'preparing', 'on_the_way', 'delivered'];
        // Determine the current status index
        const currentStatusIndex = stages.indexOf(trackingStatus);
        // Return green for completed stages
        return index <= currentStatusIndex ? 'text-green-500' : 'text-gray-400';
    };

    const trackingStages = ['Order Placed', 'Preparing', 'On the Way', 'Delivered'];

    return (
        <div>
            <h2 className='p-3 bg-primary text-2xl font-bold text-center text-white'>My Order</h2>
            <div className='py-8 mx-7 md:mx-20'>
                <h2 className='text-3xl font-bold text-primary'>Order History</h2>
                <div>
                    {orderList.map((order) => (
                        <Collapsible key={order.id}>
                            <CollapsibleTrigger>
                                <div className='p-2 border bg-slate-100 flex justify-evenly gap-24'>
                                    <h2><span className='font-semibold mr-2'>Order Date:</span> {moment(order.createdAt).format('DD/MMM/YYYY')}</h2>
                                    <h2><span className='font-semibold mr-2'> Total Amount: </span>{order.totalOrderAmount} </h2>
                                    <h2><span className='font-semibold mr-2'> Status: </span>CASH ON DELIVERY  {order.paymentStatus}</h2>
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
                                                        <span className={`text-2xl`}>
                                                            {index <= trackingStages.indexOf(order.trackingStatus) ? '⦿' :'⦿'}
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyOrder;
