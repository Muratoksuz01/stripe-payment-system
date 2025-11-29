import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/generate", async (req, res) => {
    try {
        const { prompt, email } = req.body;

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gemma3:1b",
                prompt: `
                        Lütfen sadece JSON formatında cevap ver. JSON dışında hiçbir çıktı, yorum veya metin üretme. JSON formatı şu şekilde olmalı:
                {
                "instant": "unknown" | "getorder" | "getorders",
                "id": string | null
                }
                Örnek:
                { "instant": "getorder", "id": "3423" }
                Kullanıcının girdiği talimatı bu JSON formatına uygun şekilde işleyin:
        ${prompt}
        `,
                stream: false
            }),
        });

        const data = await response.json();

        // 1. Kod bloklarını temizle
        let cleaned = data.response.replace(/```json|```/g, "").trim();

        // 2. JSON.parse ile JS objesine çevir
        let parsed;
        try {
            parsed = JSON.parse(cleaned);
            console.log(parsed.instant); // "getorders"
            console.log(parsed.id);      // "1453"
        } catch (err) {
            console.error("JSON parse hatası:", err);
        }
        let message = await action(parsed.instant, parsed.id, email)
        res.json({
            success: true,
            data: message
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
});
const action = async (instant, id, email) => {

    try {
        let message = "";
        switch (instant) {

            case "getorders":
                const invoicesRespons = await fetch(`http://localhost:8000/getInvoices?email=${email}`);
                const invoicesDat = await invoicesRespons.json();
                console.log("gelen veri :", invoicesDat);

                if (!invoicesDat.success) {
                    message = `Siparişler bulunamadı: ${invoicesDat.error}`;
                } else {
                    // Tüm siparişleri listele
                     invoicesDat.orders.map(order => {
                        const itemsText = order.orderItems.map(item =>
                            `${item.productName} x${item.quantity} = ${(item.unitPrice * item.quantity).toFixed(2)} TL`
                        ).join("\n");

                        const total = order.orderItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

                        message = `Sipariş Detayları (ID: ${order.orderId}):
                        Ödeme Yöntemi: ${order.paymentMethod}
                        Toplam: ${total.toFixed(2)} TL
                        Ürünler:
                        ${itemsText}
                        Fatura Linki: ${order.invoiceUrl}`;
                    }).join("\n\n"); // Siparişler arası boş satır
                }
                break;
            case "getorder":
                // Burada senin invoice.getInvoice veya getInvoices kullanılabilir
                // Örnek: getInvoices
                const invoicesResponse = await fetch(`http://localhost:8000/getInvoices?email=${email}`);
                const invoicesData = await invoicesResponse.json();

                if (!invoicesData.success) {
                    message = `Siparişler bulunamadı: ${invoicesData.error}`;
                } else {
                    if (!id) {
                        message = "kutfen id yi daha acık bir sekilde giriniz"
                        break
                    }
                    console.log("gelen id:", id)
                    console.log("gelen id type:", typeof id)
                    const order = invoicesData.orders.find(o => o.orderId == id);
                    if (!order) {
                        message = `ID ${id} ile bir sipariş bulunamadı.`;
                    } else {
                        const itemsText = order.orderItems.map(i => `${i.productName} x${i.quantity} (${i.total} TL)`).join("\n");
                        message = `Sipariş Detayları (ID: ${order.orderId}):\nÖdeme Yöntemi: ${order.paymentMethod}\nToplam: ${order.orderItems.reduce((a, b) => a + b.total, 0)} TL\nÜrünler:\n${itemsText}\nFatura Linki: ${order.invoiceUrl}`;
                    }
                }
                break;

            case "unknown":
                message = "bu işlem gecersiz isteginizi daha net acıklyaın "
                break;
            default:
                message = "Bilinmeyen işlem türü.";
        }
        return message;



    } catch (err) {
        console.error(err);
        return "catch blogu "

    }
}
export default router;
