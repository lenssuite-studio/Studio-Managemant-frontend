// WhatsApp receipt integration — pure client-side https://wa.me/ links.
// No third-party API, no backend involvement.

import { useSelector } from "react-redux";

// Normalizes a raw phone number into the digits-only, country-code-prefixed
// format wa.me requires (e.g. "0615551234" -> "252615551234").
// Handles Somalia/Somaliland numbers entered as local (0XXXXXXXXX),
// already-international (+252XXXXXXXXX / 252XXXXXXXXX), or with an
// international dialing prefix (00252XXXXXXXXX).
export function formatSomaliPhone(rawPhone) {
  if (!rawPhone) return null;


  let digits = String(rawPhone).replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("252")) {
    // already has the country code
  } else if (digits.startsWith("0")) {
    digits = "252" + digits.slice(1);
  } else {
    digits = "252" + digits;
  }

  // A Somali/Somaliland mobile number is 252 + 9 digits = 12 digits.
  // Allow a little slack (11-13) rather than reject formats we haven't seen.
  if (digits.length < 11 || digits.length > 13) {
    return null;
  }

  return digits;
}


export function buildReceiptMessage(customer) {
   const { userCustomer } = useSelector((state) => state.auth);
  const fullName = customer?.fullName || "Macmiil";
  const username=userCustomer?.username;
  console.log(username)
  
  const folderName = customer?.folderName || "-";
  const totalPhotos = customer?.numberOfPhotos ?? 0;
  const amountPaid = customer?.amountPaid ?? 0;
  const remainingAmount = customer?.remainingAmount ?? 0;
  const Total = amountPaid + remainingAmount;
  const Time = customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString()
    : "-";

  //  return [
  //   `🌟 *LensSuite Studio Receipts* 🌟`,
  //   ``,
  //   `Salaan *${fullName}*, kani waa rasiidkaaga diiwaangelinta:`,
  //   ``,
  //   `📁 *Folder:* ${folderName}`,
  //   `📸 *Sawirrada:* ${totalPhotos}`,
  //   `💰 *Bixiyay:* SLSH ${amountPaid}`,
  //   `⚠️ *Lagu leeyahay:* SLSH ${remainingAmount}`,
  //   ``,
  //   `Ku soo dhawaaw mar walba! 🙏`,
  // ].join("\n");
  // return [
  //   `--- [ 📸 LENSELIUITE STUDIO ] ---`,
  //   ``,
  //   `Khaas ah: ${fullName}`,
  //   `Muuqaalka Rasiidkaaga Shabakada:`,
  //   ``,
  //   `▪ Folder Name: ${folderName}`,
  //   `▪ Total Photos: ${totalPhotos}`,
  //   `▪ Paid Amount: SLSH ${amountPaid}`,
  //   `▪ Balance Due: SLSH ${remainingAmount}`,
  //   ``,
  //   `----------------------------------`,
  //   `Aad ayaad u mahadsan tahay wada-shaqayntaada! 🙏`,
  // ].join("\n");

  return [
    `✨ *LENSSUITE STUDIO* ✨`,
    `----------------------------------`,
    `Sodhawow *${fullName}*! 👋`,
    `Aad ayaad u mahadsan tahay inaad na soo doorbidday.`,
    ``,
    `🧾 *FAAHFAAHINTA RASIIDKA*`,
    // `📁 *Folder-ka:* ${folderName}`,
    `📸 * Total Photos:* ${totalPhotos}`,
    `💳 *Paid Amoun:* $${amountPaid}`,
    `⏳ *Balance Due:* $${remainingAmount}`,
    `💰 *Wadarta Guud (Total):* $${Total}`,
    `----------------------------------`,
    `📅 *Taariikhda:* ${Time}`,
    ``,
    `Wixii faahfaahin ah nala soo xidhiidh.🙏`,
  ].join("\n");
}

// Returns a ready-to-open https://wa.me/ link, or null if the customer has
// no usable phone number.
export function getWhatsappReceiptLink(customer) {
  const phone = formatSomaliPhone(customer?.Phone);
  if (!phone) return null;

  const message = buildReceiptMessage(customer);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
