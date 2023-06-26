
async function onPaymentClick(payment, invoiceData, prefix) {
  const paymentObj = JSON.parse(payment)
  const invoiceObj = JSON.parse(invoiceData)

  const url = `${prefix}/pl:payment/gateway/updateInvoice`

  const body = {
    selectedPaymentId: paymentObj._id,
    invoiceData: invoiceObj,
    paymentKind: paymentObj.kind
  }

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  const qrData = data.invoice.qrData;
  const image = document.getElementById('qr-code');
  image.src = qrData;

  const title = document.getElementById('paymentKind');
  title.innerHTML = paymentObj.title;
}
