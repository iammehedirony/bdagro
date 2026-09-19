export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  role: "farmer" | "investor";
}

export interface LoanApprovalEmailData {
  farmerName: string;
  farmerEmail: string;
  projectTitle: string;
  loanAmount: number;
}

export interface InvestmentConfirmationEmailData {
  investorName: string;
  investorEmail: string;
  projectTitle: string;
  amount: number;
  expectedROI: number;
}

export interface FarmerNewInvestmentEmailData {
  farmerName: string;
  farmerEmail: string;
  projectTitle: string;
  investorName: string;
  amount: number;
}

export interface PayoutEmailData {
  investorName: string;
  investorEmail: string;
  projectTitle: string;
  amount: number;
}

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bdagro Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #065f46; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Bdagro</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                © 2024 Bdagro. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                If you didn't request this email, please ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function welcomeEmail(data: WelcomeEmailData): string {
  const roleText = data.role === "farmer" ? "কৃষক" : "বিনিয়োগকারী";
  const roleDesc = data.role === "farmer" 
    ? "আপনি এখন আপনার কৃষি প্রকল্পের জন্য বিনিয়োগ পেতে পারবেন।"
    : "আপনি এখন কৃষকদের প্রকল্পে বিনিয়োগ করে রিটার্ন অর্জন করতে পারবেন।";
  
  return baseLayout(`
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">স্বাগতম, ${data.userName}!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      Bdagro-এ আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে। আপনার ভূমিকা: <strong>${roleText}</strong>
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      ${roleDesc}
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #065f46; border-radius: 6px; padding: 12px 24px;">
          <a href="${process.env.FRONTEND_URL || "https://bdagro.com"}/dashboard" 
             style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            ড্যাশবোর্ডে যান
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: <a href="mailto:support@bdagro.com" style="color: #065f46;">support@bdagro.com</a>
    </p>
  `);
}

export function loanApprovalEmail(data: LoanApprovalEmailData): string {
  return baseLayout(`
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">অভিনন্দন! আপনার লোন আবেদন অনুমোদিত হয়েছে</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      প্রিয় ${data.farmerName},
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      আপনার <strong>"${data.projectTitle}"</strong> প্রকল্পের জন্য ${data.loanAmount.toLocaleString()} টাকার লোন আবেদন অনুমোদিত হয়েছে। 
      এখন আপনার প্রজেক্ট বিনিয়োগকারীদের কাছে সরাসরি উপলব্ধ।
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #065f46; border-radius: 6px; padding: 12px 24px;">
          <a href="${process.env.FRONTEND_URL || "https://bdagro.com"}/farmer/projects" 
             style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            প্রজেক্ট দেখুন
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      ধন্যবাদ,<br>Bdagro Team
    </p>
  `);
}

export function investmentConfirmationEmail(data: InvestmentConfirmationEmailData): string {
  return baseLayout(`
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">বিনিয়োগ সফল হয়েছে!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      প্রিয় ${data.investorName},
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      আপনি <strong>"${data.projectTitle}"</strong> প্রকল্পে ${data.amount.toLocaleString()} টাকার বিনিয়োগ সফলভাবে সম্পন্ন করেছেন।
      আপনার প্রত্যাশিত ROI: <strong>${data.expectedROI}%</strong>
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #065f46; border-radius: 6px; padding: 12px 24px;">
          <a href="${process.env.FRONTEND_URL || "https://bdagro.com"}/investor/portfolio" 
             style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            পোর্টফোলিও দেখুন
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      ধন্যবাদ,<br>Bdagro Team
    </p>
  `);
}

export function farmerNewInvestmentEmail(data: FarmerNewInvestmentEmailData): string {
  return baseLayout(`
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">নতুন বিনিয়োগ পেয়েছেন!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      প্রিয় ${data.farmerName},
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      আপনার প্রজেক্ট <strong>"${data.projectTitle}"</strong>-এ ${data.investorName} 
      ${data.amount.toLocaleString()} টাকার বিনিয়োগ করেছেন।
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #065f46; border-radius: 6px; padding: 12px 24px;">
          <a href="${process.env.FRONTEND_URL || "https://bdagro.com"}/farmer/projects" 
             style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            প্রজেক্ট দেখুন
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      ধন্যবাদ,<br>Bdagro Team
    </p>
  `);
}

export function payoutEmail(data: PayoutEmailData): string {
  return baseLayout(`
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 20px;">আপনি রিটার্ন পেয়েছেন!</h2>
    <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
      প্রিয় ${data.investorName},
    </p>
    <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
      প্রজেক্ট <strong>"${data.projectTitle}"</strong>- থেকে আপনি ${data.amount.toLocaleString()} 
      টাকার রিটার্ন (ROI পেমেন্ট) পেয়েছেন। টাকাটি আপনার অ্যাকাউন্টে জমা হয়েছে।
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td style="background-color: #065f46; border-radius: 6px; padding: 12px 24px;">
          <a href="${process.env.FRONTEND_URL || "https://bdagro.com"}/investor/transactions" 
             style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
            ট্রানজেকশন দেখুন
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
      ধন্যবাদ,<br>Bdagro Team
    </p>
  `);
}