import cron from 'node-cron';
import Inventory from '../models/Inventory.js';
import sendEmail from '../utils/sendEmail.js';
import { lowStockAlertTemplate } from '../templates/emailTemplates.js';
import User from '../models/User.js';

const checkLowStock = async () => {
  try {
    console.log('Running scheduled job: checkLowStock...');

    // Find items where quantity is below threshold and no alert has been sent yet
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$quantity', '$threshold'] },
      lowStockAlertSent: false
    }).populate('ingredientId');

    if (lowStockItems.length === 0) {
      console.log('No new low stock items found.');
      return;
    }

    // Get admin users to notify
    const admins = await User.find({ role: 'ADMIN' });
    const adminEmails = admins.map((admin) => admin.email).filter(Boolean);

    if (adminEmails.length === 0) {
      console.log('No admins found to notify about low stock.');
      return;
    }

    for (const item of lowStockItems) {
      if (process.env.SMTP_HOST) {
        try {
          await sendEmail({
            email: adminEmails.join(','),
            subject: `Pizzaro Alert - Low Stock: ${item.ingredientId?.name}`,
            html: lowStockAlertTemplate(item)
          });

          // Mark alert as sent
          item.lowStockAlertSent = true;
          await item.save();
          console.log(`Low stock alert sent for ${item.ingredientId?.name}`);
        } catch (emailError) {
          console.error(`Failed to send low stock alert for ${item.ingredientId?.name}:`, emailError);
        }
      } else {
        console.log(`[MOCK EMAIL] Low Stock Alert generated for ${item.ingredientId?.name}`);
        item.lowStockAlertSent = true;
        await item.save();
      }
    }
  } catch (error) {
    console.error('Error in checkLowStock job:', error);
  }
};

// Initialize jobs
const initJobs = () => {
  // Run every hour at the top of the hour
  cron.schedule('0 * * * *', checkLowStock);
  console.log('Inventory cron jobs initialized.');
};

export default {
  initJobs,
  checkLowStock
};