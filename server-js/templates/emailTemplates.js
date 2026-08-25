export const orderConfirmationTemplate = (order, user) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #E53935; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Pizzaro</h1>
    </div>
    <div style="padding: 20px;">
      <h2>Order Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>#${order._id}</strong> has been received and is being prepared.</p>
      
      <h3>Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #eee;">
            <th style="text-align: left; padding: 8px;">Item</th>
            <th style="text-align: right; padding: 8px;">Qty</th>
            <th style="text-align: right; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                ${item.isCustom ? 'Custom Pizza' : (item.pizza ? 'Signature Pizza' : 'Pizza')}
              </td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eee;">Rs. ${item.price || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: right; margin-top: 20px;">
        <h3>Total: Rs. ${order.totalAmount}</h3>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.CLIENT_URL}/orders" style="background-color: #E53935; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Order</a>
      </div>
    </div>
    <div style="background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #777;">
      <p>Thank you for choosing Pizzaro!</p>
      <p>support@pizzaro.com | +1 234 567 890</p>
    </div>
  </div>
`;
export const lowStockAlertTemplate = (inventoryItem) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #F59E0B; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Inventory Alert</h1>
    </div>
    <div style="padding: 20px;">
      <h2>Low Stock Detected</h2>
      <p>The following ingredient has fallen below its required threshold and needs restocking.</p>
      
      <div style="background-color: #FFF8EF; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B; margin: 20px 0;">
        <p><strong>Ingredient:</strong> ${inventoryItem.ingredientId?.name || 'Unknown'}</p>
        <p><strong>Current Stock:</strong> ${inventoryItem.quantity} ${inventoryItem.unit}</p>
        <p><strong>Threshold:</strong> ${inventoryItem.threshold} ${inventoryItem.unit}</p>
        <p style="color: #E53935; font-weight: bold;">Status: LOW</p>
      </div>
      
      <p>Please restock this ingredient to prevent order failures.</p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.ADMIN_URL || process.env.CLIENT_URL}/admin/inventory" style="background-color: #111111; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
      </div>
    </div>
  </div>
`;
