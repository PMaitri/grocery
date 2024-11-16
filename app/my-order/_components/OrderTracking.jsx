import React from 'react';

const OrderTracking = ({ trackingStatus }) => {
  const stages = [
    { key: 'order_placed', label: 'Order Placed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'on_the_way', label: 'On the Way' },
    { key: 'delivered', label: 'Delivered' }
  ];

  // Function to check if a stage is completed
  const isStageCompleted = (stageKey) => {
    const stageOrder = stages.findIndex(stage => stage.key === stageKey);
    const currentOrder = stages.findIndex(stage => stage.key === trackingStatus);
    return stageOrder <= currentOrder;
  };

  return (
    <div className="flex items-center">
      {stages.map((stage, index) => (
        <div key={stage.key} className="flex items-center">
          {/* Display filled dot based on completion */}
          <div className={`w-6 h-6 rounded-full ${isStageCompleted(stage.key) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          
          {/* Display stage label */}
          <span className={`ml-2 ${isStageCompleted(stage.key) ? 'text-green-500' : 'text-gray-400'}`}>
            {stage.label}
          </span>

          {/* Dotted line between stages */}
          {index < stages.length - 1 && (
            <div className={`mx-2 w-10 border-b border-dotted ${isStageCompleted(stage.key) ? 'border-green-500' : 'border-gray-400'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderTracking;
