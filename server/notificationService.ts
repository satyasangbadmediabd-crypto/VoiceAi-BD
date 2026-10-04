import { BillingTransaction, loadBillingConfig } from './billingStore';

/**
 * Format payment alert message for Telegram and WhatsApp
 */
export function formatPaymentNotificationText(txn: BillingTransaction): string {
  const formattedTime = new Date(txn.createdAt).toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `🔔 নতুন পেমেন্ট রিকোয়েস্ট (VoiceAI BD)!
━━━━━━━━━━━━━━━━━━
👤 কাস্টমার: ${txn.customerName}
📞 মোবাইল: ${txn.senderNumber}
📧 ইমেইল: ${txn.customerEmail || 'N/A'}
📦 প্যাকেজ: ${txn.planName}
💰 পরিমাণ: ৳ ${txn.amount.toLocaleString('en-BD')} BDT
💳 মাধ্যম: ${txn.paymentMethod}
🔑 TrxID: ${txn.transactionId}
⏰ সময়: ${formattedTime}
${txn.notes ? `📝 নোট: ${txn.notes}\n` : ''}━━━━━━━━━━━━━━━━━━
⚡ দ্রুত বিকাশ/নগদ চেক করে অ্যাডমিন প্যানেল থেকে অনুমোদন (Approve) করুন!`;
}

export function formatTelegramHtml(txn: BillingTransaction): string {
  const formattedTime = new Date(txn.createdAt).toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `🔔 <b>নতুন পেমেন্ট রিকোয়েস্ট (VoiceAI BD)!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>কাস্টমার:</b> ${escapeHtml(txn.customerName)}
📞 <b>প্রেরকের নম্বর:</b> <code>${escapeHtml(txn.senderNumber)}</code>
📧 <b>ইমেইল:</b> ${escapeHtml(txn.customerEmail || 'N/A')}
📦 <b>প্যাকেজ:</b> <b>${escapeHtml(txn.planName)}</b>
💰 <b>পরিশোধিত ফি:</b> <b>৳ ${txn.amount.toLocaleString('en-BD')} BDT</b>
💳 <b>পেমেন্ট মাধ্যম:</b> ${escapeHtml(txn.paymentMethod)}
🔑 <b>TrxID:</b> <code>${escapeHtml(txn.transactionId)}</code>
⏰ <b>জমা দেওয়ার সময়:</b> ${escapeHtml(formattedTime)}
${txn.notes ? `📝 <b>নোট:</b> <i>${escapeHtml(txn.notes)}</i>\n` : ''}━━━━━━━━━━━━━━━━━━
⚡ <i>আপনার বিকাশ/নগদ অ্যাপে টাকা আসা নিশ্চিত করে অ্যাডমিন প্যানেল থেকে অনুমোদন (Approve) করুন।</i>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Send Message to Telegram Chat via Telegram Bot API
 */
export async function sendTelegramMessage(
  token: string,
  chatId: string,
  htmlText: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!token || !chatId) {
      return { success: false, error: 'Telegram Bot Token এবং Chat ID উভয়ই আবশ্যক।' };
    }

    const cleanToken = token.trim();
    const cleanChatId = chatId.trim();
    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `Telegram API ত্রুটি (${response.status})`
      };
    }

    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Telegram সার্ভারে সংযোগ স্থাপন করা যায়নি।'
    };
  }
}

/**
 * Send WhatsApp Notification via Webhook or GreenAPI / CallMeBot
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
  options?: { webhookUrl?: string; apiKey?: string }
): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const webhookUrl = options?.webhookUrl?.trim();
    const apiKey = options?.apiKey?.trim();

    // 1. If custom Webhook (e.g. n8n, Make.com, GreenAPI, Meta Cloud API) is provided
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
          phone: phone.replace(/[^0-9+]/g, ''),
          message,
          event: 'PAYMENT_SUBMITTED',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        return { success: false, error: `WhatsApp Webhook returned status ${response.status}` };
      }
      return { success: true, message: 'Webhook triggered successfully' };
    }

    // 2. CallMeBot API format if apiKey is provided (e.g. CallMeBot free whatsapp bot)
    if (apiKey && phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(message);
      const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMsg}&apikey=${apiKey}`;

      const response = await fetch(callmebotUrl);
      if (!response.ok) {
        return { success: false, error: 'CallMeBot WhatsApp API request failed' };
      }
      return { success: true, message: 'CallMeBot message dispatched' };
    }

    // If no automated gateway configured, WhatsApp link can be opened manually
    return {
      success: true,
      message: 'WhatsApp notification ready (Customer link / Admin notification)'
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'WhatsApp alert delivery failed' };
  }
}

/**
 * Dispatch payment notifications automatically when customer submits a transaction
 */
export async function dispatchPaymentNotifications(txn: BillingTransaction): Promise<{
  telegramDispatched: boolean;
  telegramError?: string;
  whatsappDispatched: boolean;
  whatsappError?: string;
}> {
  const config = loadBillingConfig();
  let telegramDispatched = false;
  let telegramError: string | undefined;
  let whatsappDispatched = false;
  let whatsappError: string | undefined;

  // 1. Dispatch Telegram
  if (config.telegramEnabled && config.telegramBotToken && config.telegramChatId) {
    try {
      const htmlMsg = formatTelegramHtml(txn);
      const res = await sendTelegramMessage(config.telegramBotToken, config.telegramChatId, htmlMsg);
      if (res.success) {
        telegramDispatched = true;
        console.log(`[Telegram] Alert successfully sent for TrxID: ${txn.transactionId}`);
      } else {
        telegramError = res.error;
        console.warn(`[Telegram Alert Failed]:`, res.error);
      }
    } catch (e: any) {
      telegramError = e.message;
      console.error(`[Telegram Error]:`, e);
    }
  }

  // 2. Dispatch WhatsApp Webhook (if configured)
  if (config.whatsappEnabled && (config.whatsappWebhookUrl || config.whatsappApiKey)) {
    try {
      const textMsg = formatPaymentNotificationText(txn);
      const res = await sendWhatsAppMessage(
        config.whatsappNumber || '+8801712345678',
        textMsg,
        {
          webhookUrl: config.whatsappWebhookUrl,
          apiKey: config.whatsappApiKey
        }
      );
      if (res.success) {
        whatsappDispatched = true;
        console.log(`[WhatsApp] Webhook alert sent for TrxID: ${txn.transactionId}`);
      } else {
        whatsappError = res.error;
      }
    } catch (e: any) {
      whatsappError = e.message;
      console.error(`[WhatsApp Error]:`, e);
    }
  }

  return {
    telegramDispatched,
    telegramError,
    whatsappDispatched,
    whatsappError
  };
}
