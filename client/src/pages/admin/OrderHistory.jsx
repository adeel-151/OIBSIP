import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { Calendar, ChevronDown, Package, Download } from 'lucide-react';
import SEO from '../../components/SEO';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

const OrderHistory = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      const orders = res.data.data;

      // Group by date (Day by Day)
      const grouped = {};
      orders.forEach((order) => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!grouped[dateStr]) {
          grouped[dateStr] = {
            orders: [],
            totalRevenue: 0
          };
        }
        grouped[dateStr].orders.push(order);
        if (order.paymentStatus === 'COMPLETED' || order.paymentMethod === 'COD') {
          grouped[dateStr].totalRevenue += order.totalAmount;
        }
      });

      setGroupedOrders(grouped);
      // Expand the first day by default
      const firstDate = Object.keys(grouped)[0];
      if (firstDate) {
        setExpandedDates({ [firstDate]: true });
      }
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const generateReport = (date, data) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(`Daily Report: ${date}`, 14, 20);

    doc.setFontSize(14);
    doc.text(`Total Revenue: Rs.${data.totalRevenue}`, 14, 30);
    doc.text(`Total Orders: ${data.orders.length}`, 14, 38);

    const tableColumn = ["Order ID", "Customer", "Time", "Status", "Amount"];
    const tableRows = [];

    data.orders.forEach((order) => {
      tableRows.push([
      order._id.substring(0, 8),
      order.user?.name || 'Guest',
      new Date(order.createdAt).toLocaleTimeString(),
      order.orderStatus,
      `Rs.${order.totalAmount}`]
      );
    });

    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid'
    });

    doc.save(`Report_${date}.pdf`);
  };

  return (
    <div className="pb-10 max-w-5xl mx-auto">
      <SEO title="Order History | Admin" />
      
      <div className="mb-10 flex items-center gap-4">
        <div className="w-16 h-16 bg-primary rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-5xl font-['Chewy'] tracking-wide text-foreground">Order History</h2>
          <p className="font-bold text-muted-foreground mt-1">Day by day breakdown</p>
        </div>
      </div>

      {isLoading ?
      <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-foreground border-t-primary rounded-full animate-spin"></div>
        </div> :

      <div className="space-y-6">
          {Object.keys(groupedOrders).length === 0 ?
        <div className="py-20 text-center bg-card border-4 border-dashed border-foreground/30 rounded-[2rem]">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground mb-2">No history found</h3>
            </div> :

        Object.keys(groupedOrders).map((date) => {
          const data = groupedOrders[date];
          const isExpanded = expandedDates[date];

          return (
            <div key={date} className="bg-card border-4 border-foreground rounded-[2rem] overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
                  {/* Header Row */}
                  <div
                onClick={() => toggleDate(date)}
                className="p-6 flex justify-between items-center cursor-pointer hover:bg-secondary/20 transition-colors">
                
                    <div>
                      <h3 className="text-2xl font-black text-foreground">{date}</h3>
                      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {data.orders.length} Orders
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Revenue</p>
                        <p className="font-['Chewy'] text-3xl tracking-wide text-primary">Rs.{data.totalRevenue}</p>
                      </div>
                      <ChevronDown className={`w-8 h-8 text-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded &&
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t-4 border-foreground bg-secondary/10">
                  
                        <div className="p-6">
                          <div className="flex justify-end mb-4">
                            <button
                        onClick={() => generateReport(date, data)}
                        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl font-bold hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_hsl(var(--primary))]">
                        
                              <Download className="w-4 h-4" /> Export Daily Report
                            </button>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b-4 border-foreground">
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-wider text-sm">ID</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-wider text-sm">Time</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-wider text-sm">Customer</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-wider text-sm">Status</th>
                                  <th className="text-right py-3 px-4 font-black uppercase tracking-wider text-sm">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.orders.map((order, idx) =>
                          <tr key={order._id} className={idx !== data.orders.length - 1 ? "border-b-2 border-foreground/10" : ""}>
                                    <td className="py-4 px-4 font-mono font-bold">#{order._id.substring(0, 8)}</td>
                                    <td className="py-4 px-4 font-bold text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td className="py-4 px-4 font-bold">{order.user?.name || 'Guest'}</td>
                                    <td className="py-4 px-4">
                                      <span className="text-xs font-black px-2 py-1 bg-background border-2 border-foreground rounded-md uppercase">
                                        {order.orderStatus}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 font-['Chewy'] text-xl text-right text-primary">Rs.{order.totalAmount}</td>
                                  </tr>
                          )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                }
                  </AnimatePresence>
                </div>);

        })
        }
        </div>
      }
    </div>);

};

export default OrderHistory;