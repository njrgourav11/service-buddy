export function generateInvoiceHTML(booking: any) {
    const date = new Date(booking.date).toLocaleDateString();
    const amount = booking.amount;
    const taxes = Math.round(amount * 0.18); // Assuming 18% tax included or extra, adjusting based on logic
    // In booking page we did: total = price + taxes. 
    // Let's assume booking.amount is the Total Amount paid.
    // So Base = Total / 1.18
    const baseAmount = Math.round((amount / 1.18) * 100) / 100;
    const taxAmount = Math.round((amount - baseAmount) * 100) / 100;

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            background: #f3f4f6;
            margin: 0;
            padding: 40px;
        }

        .invoice-wrapper {
            background: #fff;
            max-width: 850px;
            margin: 0 auto;
            padding: 40px 50px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .top-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563EB;
        }

        .invoice-badge {
            font-size: 30px;
            color: #111;
            font-weight: 700;
            letter-spacing: 2px;
        }

        .section-title {
            margin-top: 25px;
            font-weight: bold;
            font-size: 18px;
            color: #333;
            margin-bottom: 8px;
        }

        .details p {
            margin: 6px 0;
            font-size: 14px;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
        }

        table thead {
            background: #f5f7fa;
        }

        table th {
            padding: 14px;
            font-size: 14px;
            color: #333;
            font-weight: 600;
            border-bottom: 1px solid #e5e7eb;
        }

        table td {
            padding: 14px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 15px;
            color: #444;
        }

        .summary-box {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }

        .summary {
            width: 260px;
            background: #f9fafb;
            padding: 20px 25px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }

        .summary p {
            display: flex;
            justify-content: space-between;
            margin: 9px 0;
            font-size: 15px;
        }

        .summary .total {
            font-weight: bold;
            font-size: 18px;
            border-top: 1px solid #ddd;
            padding-top: 12px;
            margin-top: 12px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
            line-height: 1.6;
        }
    </style>
</head>
<body>

<div class="invoice-wrapper">

    <div class="top-header">
        <div class="logo">ServiceBuddy</div>
        <div class="invoice-badge">INVOICE</div>
    </div>

    <div class="section-title">Invoice Details</div>

    <div class="details">
        <p><strong>Invoice ID:</strong> ${booking.id.substring(0, 8).toUpperCase()}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Billed To:</strong> ${booking.userName}</p>
        <p><strong>Service Address:</strong> ${booking.address}</p>
    </div>

    <div class="section-title">Billing Summary</div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align:right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${booking.serviceName} (${booking.package})</td>
                <td style="text-align:right;">₹${baseAmount}</td>
            </tr>
            <tr>
                <td>Tax (18% GST)</td>
                <td style="text-align:right;">₹${taxAmount}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary-box">
        <div class="summary">
            <p><span>Subtotal:</span> <span>₹${baseAmount}</span></p>
            <p><span>GST (18%):</span> <span>₹${taxAmount}</span></p>
            <p class="total"><span>Total:</span> <span>₹${amount}</span></p>
        </div>
    </div>

    <div class="footer">
        <p>Thank you for choosing <strong>ServiceBuddy</strong>!</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
    </div>

</div>

</body>
</html>
`;
}
