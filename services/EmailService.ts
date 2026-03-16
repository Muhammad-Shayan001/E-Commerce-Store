import { Order, User } from '../types.js';

class EmailService {
  private static logEmail(to: string, subject: string, body: string) {
    console.log(
      `%c[EMAIL SENT TO: ${to}]%c\nSubject: ${subject}\n\n${body}`,
      "color: #0ea5e9; font-weight: bold; background: #0ea5e922; padding: 4px 8px; border-radius: 4px;",
      "color: inherit; font-family: monospace;"
    );
  }

  static sendOrderConfirmation(user: User | { name: string, email: string }, order: Order) {
    const itemsList = order.items
      .map(item => `- ${item.name} (x${item.quantity}): $${(item.discountPrice || item.price).toFixed(2)}`)
      .join('\n');

    const template = `
      Hello ${user.name},
      
      Thank you for choosing LUXECOMMERCE. Your order ${order.id} has been confirmed!
      
      --- ORDER SUMMARY ---
      Total: $${order.total.toFixed(2)}
      Status: ${order.status.toUpperCase()}
      Items:
      ${itemsList}
      
      Shipping to:
      ${order.shippingAddress}
      
      Your items are being prepared for shipment. You will receive another update once they are on the way.
      
      Best regards,
      The LuxeCommerce Team
    `;

    this.logEmail(user.email, `Order Confirmed: ${order.id}`, template);
  }

  static sendStatusUpdate(userEmail: string, orderId: string, newStatus: string) {
    const statusMessages: Record<string, string> = {
      shipped: "Great news! Your order has been dispatched and is currently on its way to you.",
      delivered: "Your premium tech has arrived! We hope you enjoy your new purchase.",
      cancelled: "We regret to inform you that your order has been cancelled. If you have questions, please contact support."
    };

    const template = `
      Hello,
      
      Your order ${orderId} has been updated to: ${newStatus.toUpperCase()}.
      
      Message: ${statusMessages[newStatus] || "Your order status has changed."}
      
      Track your order status anytime in your profile dashboard.
      
      Best regards,
      The LuxeCommerce Team
    `;

    this.logEmail(userEmail, `Order Update: ${orderId}`, template);
  }
}

export default EmailService;