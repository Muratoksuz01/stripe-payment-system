
import { Router } from "express";
import puppeteer from "puppeteer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs";

import db from "../config/firebase.mjs";           // Admin SDK
import admin from "firebase-admin";                // FieldValue için lazım
import { createResponse } from "../lib/responseModel.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
router.post("/create-invoice", async (req, res) => {
  const { userName, userEmail, userAddress, items, orderId, invoiceNo, paymentMethod, paymentId } = req.body;

  if (!userEmail) {
    return res.status(400).json(createResponse(false, null, null, "userEmail gereklidir"));
  }

  try {
    const pdfUrl = await generatePdf(userName, userEmail, userAddress, items, orderId, invoiceNo);

    // Admin SDK ile referans oluştur
    const userOrdersRef = db.collection("orders").doc(userEmail);

    const newOrder = {
      orderId: orderId || uuidv4(),
      paymentId,
      paymentMethod,
      orderItems: items,
      invoiceUrl: pdfUrl,
    //  createdAt: admin.firestore.FieldValue.serverTimestamp(), // en iyisi!
    };

    // Admin SDK transaction
    await db.runTransaction(async (transaction) => {
      const docSnap = await transaction.get(userOrdersRef);

      if (!docSnap.exists) {
        // İlk defa: document + array oluştur
        transaction.set(userOrdersRef, {
          orders: [newOrder]
        });
      } else {
        // Varsa sadece array'e ekle
        transaction.update(userOrdersRef, {
          orders: admin.firestore.FieldValue.arrayUnion(newOrder)
        });
      }
    });

    console.log(`Sipariş kaydedildi: ${userEmail}`);
    res.json(createResponse(true, null, "Sipariş başarıyla kaydedildi", null));

  } catch (error) {
    console.error("Sipariş kaydedilirken hata:", error);
    res.status(500).json(createResponse(false, null, null, "Sipariş kaydedilemedi"));
  }
});







router.get("/getInvoices", async (req, res) => {
  try {
    const { email, paymentId } = req.query;

    const userDoc = await db.collection("orders").doc(email).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: "User orders not found" });
    }

    const ordersArray = userDoc.data().orders || [];

    if (ordersArray.length === 0) {
      return res.status(404).json({ success: false, error: "No orders for this user" });
    }

    // paymentId ile filtreleme


    res.json({ success: true, orders: ordersArray });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/getInvoice", async (req, res) => {
    const { pdfUrl } = req.query;

    if (!pdfUrl) {
        return res.status(400).json({ success: false, message: "pdfUrl eksik" });
    }

    // Güvenlik için sadece invoice klasörü içinden izin verelim
    const invoicePath = path.join(process.cwd(), "invoices", path.basename(pdfUrl));
    console.log(invoicePath)
    // Dosya var mı kontrol et
    if (!fs.existsSync(invoicePath)) {
        return res.status(404).json({ success: false, message: "Dosya bulunamadı" });
    }

    // PDF dosyasını gönder
    res.sendFile(invoicePath);
});


export default router;

async function generatePdf(userName, userEmail, userAddress, items, orderId, invoiceNo,) {
  const invoiceDate = new Date().toISOString().split("T")[0];
  const totalPrice = items.reduce((acc, item) => acc + item.total, 0);
  const html = renderInvoiceHTML({ userName, userEmail, userAddress, items, orderId, invoiceNo, invoiceDate, totalPrice, });
  const uniqueId = uuidv4();
  const pdfName = `invoice_${uniqueId}.pdf`;
  const pdfPath = path.join(__dirname, "../invoices", pdfName);

  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
  });
  await browser.close();
  return `/invoices/${pdfName}`
  // return "deneme.pdf";
}


function renderInvoiceHTML(data) {
  const { userName, userEmail, userAddress, items, invoiceNo, invoiceDate, orderId, totalPrice } = data;

  const itemsRows = items
    .map(
      (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.productName}</td>
        <td>${item.sku || "-"}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice} TL</td>
        <td>${item.unitPrice * item.quantity} TL</td>
      </tr>
    `
    )
    .join("");

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .inv-box { width: 98%; border: 1px solid #ddd; padding: 20px; }
        .row { display: flex; justify-content: space-between; }
        .head { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        td, th { border: 1px solid #444; padding: 6px; }
        .right { text-align: right; }
      </style>
    </head>
    <body>
      <div class="inv-box">
        <div class="row">
          <div>
            <div class="head">e-Arşiv Fatura</div>
            <div><strong>Belge No:</strong> ${invoiceNo}</div>
            <div><strong>Fatura Tarihi:</strong> ${invoiceDate}</div>
            <div><strong>Sipariş No:</strong> ${orderId}</div>
          </div>
          <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPD6sCJx4r-gw3RbGpfn_6EhIaovnUeaxPSuR6lsGscr3ELC8Xj9gXOTNdEkGsMEw8lK7nRWcrSYUcppFE5g_yCpJDSStQHBrAsYXjy1dU&s=10" width="90"/>
          </div>
        </div>

        <hr/>

        <div>
          <strong>Alıcı:</strong><br/>
          ${userName}<br/>
          ${userEmail}<br/>
          ${userAddress || ""}
        </div>

        <table>
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Ürün</th>
              <th>Kod</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <h3 class="right">Toplam: ${totalPrice} TL</h3>
      </div>
    </body>
  </html>
  `;
}
