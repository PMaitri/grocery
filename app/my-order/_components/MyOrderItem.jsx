import React from 'react';
import Image from 'next/image';

function MyOrderItem({ orderItem }) {
  const product = orderItem.product.data.attributes; // To make the code cleaner

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
        {/* Product Image */}
        <Image
          src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.images.data[0]?.attributes?.url}
          width={80}
          height={80}
          alt="Product Image"
          className='bg-gray-100 p-5 rounded-md border'
        />

        {/* Product Info */}
        <div className='col-span-2'>
          <h2 className='font-semibold'>{product.name}</h2>
          <h3 className='text-gray-600'>Item Price: {product.price}</h3> {/* Adjust price field */}
        </div>

        {/* Quantity and Price */}
        <div className='text-right'>
          <h3>Quantity: {orderItem.quantity}</h3>
          <h3>Total Price: {orderItem.amount}</h3>
        </div>
      </div>
      <hr className='mt-3' />
    </>
  );
}

export default MyOrderItem;
