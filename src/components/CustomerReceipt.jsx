// Thermal POS-style printable receipt for a single customer. Rendered only
// inside the .receipt-print-area portal (see ReceiptPrintButton.jsx) — the
// print.css rules in styles/theme.css keep it off-screen except during
// window.print(), and format it narrow/monospace for 76-80mm thermal paper.
export default function CustomerReceipt({ customer }) {
  if (!customer) return null;

  const {
    fullName,
    Phone,
    folderName,
    PhotoType,
    status,
    numberOfPhotos,
    normalPhotosCount,
    vipPhotosCount,
    vip1PhotosCount,
    vip2PhotosCount,
    vip3PhotosCount,
    amountPaid,
    remainingAmount,
    cashAmount,
    zaadAmount,
    edahabAmount,
    createdAt,
  } = customer;

  return (
    <div className="receipt">
      <div className="receipt-header">
        <h2>LensSuite Studio</h2>
        <p>Rasiidka Macmiilka / Customer Receipt</p>
      </div>
      <hr />
      <div className="receipt-row">
        <span>Name</span>
        <span>{fullName}</span>
      </div>
      {Phone && (
        <div className="receipt-row">
          <span>Phone</span>
          <span>{Phone}</span>
        </div>
      )}
      <div className="receipt-row">
        <span>Folder</span>
        <span>{folderName}</span>
      </div>
      <div className="receipt-row">
        <span>Date</span>
        <span>{createdAt ? new Date(createdAt).toLocaleDateString() : "—"}</span>
      </div>
      <div className="receipt-row">
        <span>Photo Type</span>
        <span>{PhotoType}</span>
      </div>
      <div className="receipt-row">
        <span>Status</span>
        <span>{status}</span>
      </div>
      <hr />
      <div className="receipt-row">
        <span>Total Photos</span>
        <span>{numberOfPhotos || 0}</span>
      </div>
      <div className="receipt-row">
        <span>Normal</span>
        <span>{normalPhotosCount || 0}</span>
      </div>
      <div className="receipt-row">
        <span>VIP</span>
        <span>{vipPhotosCount || 0}</span>
      </div>
      {vip1PhotosCount > 0 && (
        <div className="receipt-row">
          <span>VIP 1</span>
          <span>{vip1PhotosCount}</span>
        </div>
      )}
      {vip2PhotosCount > 0 && (
        <div className="receipt-row">
          <span>VIP 2</span>
          <span>{vip2PhotosCount}</span>
        </div>
      )}
      {vip3PhotosCount > 0 && (
        <div className="receipt-row">
          <span>VIP 3</span>
          <span>{vip3PhotosCount}</span>
        </div>
      )}
      <hr />
      {cashAmount > 0 && (
        <div className="receipt-row">
          <span>Cash</span>
          <span>SLSH {cashAmount}</span>
        </div>
      )}
      {zaadAmount > 0 && (
        <div className="receipt-row">
          <span>Zaad</span>
          <span>SLSH {zaadAmount}</span>
        </div>
      )}
      {edahabAmount > 0 && (
        <div className="receipt-row">
          <span>eDahab</span>
          <span>SLSH {edahabAmount}</span>
        </div>
      )}
      <div className="receipt-row receipt-total">
        <span>Amount Paid</span>
        <span>SLSH {amountPaid || 0}</span>
      </div>
      <div className="receipt-row receipt-balance">
        <span>Remaining</span>
        <span>SLSH {remainingAmount || 0}</span>
      </div>
      <hr />
      <p className="receipt-footer">Mahadsanid! / Thank you!</p>
    </div>
  );
}
