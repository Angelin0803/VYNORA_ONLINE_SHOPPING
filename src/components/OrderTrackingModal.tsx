import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { Order } from '../types';
import { apiClient } from '../services/apiClient';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onOrderUpdated
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found a better price / changed my mind');
  const [isCancelling, setIsCancelling] = useState(false);

  React.useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  if (!currentOrder) return null;

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const updated = await apiClient.cancelOrder(currentOrder.id, cancelReason);
      if (updated) {
        setCurrentOrder(updated);
        setIsCancelConfirmOpen(false);
        if (onOrderUpdated) onOrderUpdated(updated);
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const isCancelled = currentOrder.status === 'cancelled';
  const isDelivered = currentOrder.status === 'delivered';

  return (
    <div id="order-tracking-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div id="order-tracking-modal-card" className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Order Tracking &bull; {currentOrder.orderNumber}
              </h2>
              <p className="text-[11px] text-slate-500">
                Courier: <strong className="text-slate-700">{currentOrder.courierName}</strong> &bull; Tracking ID: <strong className="text-slate-700">{currentOrder.trackingNumber}</strong>
              </p>
            </div>
          </div>
          <button
            id="btn-close-tracking-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Top Status Announcement */}
          <div className={`p-4 rounded-2xl border ${
            isCancelled
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : isDelivered
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isCancelled ? 'bg-rose-200 text-rose-900' : 'bg-white/20 text-white'
                }`}>
                  Current Status: {currentOrder.status.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base sm:text-lg font-black mt-1">
                  {isCancelled
                    ? 'Order Cancelled & Refund Initiated'
                    : isDelivered
                    ? 'Delivered to Doorstep'
                    : `Expected Delivery: ${currentOrder.estimatedDeliveryDate}`}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  id="btn-print-invoice"
                  onClick={handlePrintInvoice}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Transit Timeline
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-200 ml-3 sm:ml-4">
              {currentOrder.trackingSteps.map((step, idx) => {
                const isCurrent = step.current;
                const isCompleted = step.completed;

                return (
                  <div key={idx} className="relative">
                    {/* Circle icon */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCancelled && step.status === 'cancelled'
                        ? 'bg-rose-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h5 className={`text-xs sm:text-sm font-bold ${
                          isCurrent ? 'text-rose-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {step.title}
                        </h5>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Delivery Partner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Shipping Destination</span>
              </div>
              <p className="text-xs font-bold text-slate-900">{currentOrder.shippingAddress.fullName}</p>
              <p className="text-xs text-slate-600 leading-snug">{currentOrder.shippingAddress.addressLine}</p>
              <p className="text-xs text-slate-500">
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
              </p>
              <p className="text-xs text-slate-400 mt-1">Phone: {currentOrder.shippingAddress.phone}</p>
            </div>

            {/* Courier & Security Verification */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Delivery Partner Verification</span>
              </div>
              <p className="text-xs text-slate-600">
                Courier Service: <strong className="text-slate-900">{currentOrder.courierName}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Air Waybill / Docket: <strong className="text-slate-900">{currentOrder.trackingNumber}</strong>
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" /> Contact Courier Support
                </span>
                <span className="font-bold text-slate-800">1800-420-VYNORA</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Package Contents ({currentOrder.items.length} items)
            </h4>
            <div className="space-y-2">
              {currentOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-sm">{item.product.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                        {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        {` • Qty: ${item.quantity}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation section */}
          {!isCancelled && !isDelivered && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Need to modify or cancel this order?</p>
                <p className="text-[11px] text-slate-500">Free cancellation available before package dispatch.</p>
              </div>

              {!isCancelConfirmOpen ? (
                <button
                  id="btn-open-cancel-order"
                  onClick={() => setIsCancelConfirmOpen(true)}
                  className="px-4 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel Order
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg p-1.5 bg-white"
                  >
                    <option value="Found a better price / changed my mind">Changed mind</option>
                    <option value="Incorrect shipping address selected">Wrong address</option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                  </select>
                  <button
                    id="btn-confirm-cancel-order"
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm'}
                  </button>
                  <button
                    onClick={() => setIsCancelConfirmOpen(false)}
                    className="px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
