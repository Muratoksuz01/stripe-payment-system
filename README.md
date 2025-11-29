



<div class="markdown prose dark:prose-invert w-full break-words dark markdown-new-styling">
<h1 data-start="75" data-end="91">Proje Hakkında</h1>
<p data-start="93" data-end="390">Bu proje, bir kullanıcıdan fork edilerek başlanmış ve sonrasında ek geliştirmelerle işlevsel hale getirilmiştir. Tasarım odaklı değil, daha çok işlevsellik üzerinde durulmuştur. Sistem; ürün listeleme, kullanıcı yönetimi, sipariş oluşturma ve yapay zeka destekli mesajlaşma gibi özellikler içerir.</p>
<hr data-start="392" data-end="395">
<h2 data-start="397" data-end="412">Teknolojiler</h2>
<p data-start="414" data-end="426"><strong data-start="414" data-end="426">Frontend</strong></p>
<ul data-start="427" data-end="483">
<li data-start="427" data-end="441">
<p data-start="429" data-end="441">React (Vite)</p>
</li>
<li data-start="442" data-end="468">
<p data-start="444" data-end="468">Zustand (state yönetimi)</p>
</li>
<li data-start="469" data-end="483">
<p data-start="471" data-end="483">Tailwind CSS</p>
</li>
</ul>
<p data-start="485" data-end="496"><strong data-start="485" data-end="496">Backend</strong></p>
<ul data-start="497" data-end="645">
<li data-start="497" data-end="516">
<p data-start="499" data-end="516">Node.js + Express</p>
</li>
<li data-start="517" data-end="556">
<p data-start="519" data-end="556">Firebase (Authentication + Firestore)</p>
</li>
<li data-start="557" data-end="583">
<p data-start="559" data-end="583">Stripe (Ödeme işlemleri)</p>
</li>
<li data-start="584" data-end="613">
<p data-start="586" data-end="613">Rate Limit (istek koruması)</p>
</li>
<li data-start="614" data-end="645">
<p data-start="616" data-end="645">Ollama (Yerel LLM çalıştırma)</p>
</li>
</ul>
<hr data-start="647" data-end="650">
<h2 data-start="652" data-end="677">Ödeme Sistemi (Stripe)</h2>
<p data-start="679" data-end="835">Projede Stripe ile ödeme işlemleri yapılmaktadır.<br data-start="728" data-end="731">
Kart numarası, CVV ve son kullanma tarihi için Stripe’ın kendi <code data-start="794" data-end="807">CardElement</code> bileşenleri kullanılmıştır.</p>
<p data-start="837" data-end="847">İstenirse:</p>
<ul data-start="848" data-end="958">
<li data-start="848" data-end="893">
<p data-start="850" data-end="893">Stripe’ın hazır ödeme formu kullanılabilir.</p>
</li>
<li data-start="894" data-end="958">
<p data-start="896" data-end="958">Kullanıcı, direkt Stripe Checkout sayfasına yönlendirilebilir.</p>
</li>
</ul>
<p data-start="960" data-end="1006">Detaylar Stripe dokümantasyonunda bulunabilir.</p>
<hr data-start="1008" data-end="1011">
<h2 data-start="1013" data-end="1034">Firebase Kullanımı</h2>
<p data-start="1036" data-end="1062"><strong data-start="1036" data-end="1062">Veritabanı (Firestore)</strong></p>
<ul data-start="1063" data-end="1083">
<li data-start="1063" data-end="1072">
<p data-start="1065" data-end="1072"><code data-start="1065" data-end="1072">users</code></p>
</li>
<li data-start="1073" data-end="1083">
<p data-start="1075" data-end="1083"><code data-start="1075" data-end="1083">orders</code></p>
</li>
</ul>
<p data-start="1085" data-end="1105"><strong data-start="1085" data-end="1105">Kimlik Doğrulama</strong></p>
<ul data-start="1106" data-end="1196">
<li data-start="1106" data-end="1196">
<p data-start="1108" data-end="1196">Giriş ve kayıt işlemleri backend üzerinden Firebase Authentication kullanılarak yapılır.</p>
</li>
</ul>
<p data-start="1198" data-end="1216"><strong data-start="1198" data-end="1216">Sipariş Süreci</strong></p>
<ul data-start="1217" data-end="1322">
<li data-start="1217" data-end="1278">
<p data-start="1219" data-end="1278">Kullanıcı sipariş verdiğinde bilgiler backend’e gönderilir.</p>
</li>
<li data-start="1279" data-end="1322">
<p data-start="1281" data-end="1322">Backend bu verileri Firestore’a kaydeder.</p>
</li>
</ul>
<hr data-start="1324" data-end="1327">
<h2 data-start="1329" data-end="1372">Yapay Zeka Özelliği (Ollama + Gemma3:1b)</h2>
<p data-start="1374" data-end="1433">Projede yerel LLM kullanımı için Ollama entegre edilmiştir.</p>
<p data-start="1435" data-end="1453">Kullanım adımları:</p>
<ol data-start="1454" data-end="1714">
<li data-start="1454" data-end="1484">
<p data-start="1457" data-end="1484">Ollama bilgisayara kurulur.</p>
</li>
<li data-start="1485" data-end="1517">
<p data-start="1488" data-end="1517"><code data-start="1488" data-end="1499">gemma3:1b</code> modeli indirilir.</p>
</li>
<li data-start="1518" data-end="1565">
<p data-start="1521" data-end="1565">Kullanıcıdan gelen mesaj backend’e iletilir.</p>
</li>
<li data-start="1566" data-end="1659">
<p data-start="1569" data-end="1611">Model gelen mesajı sınıflandırır (intent):</p>
<ul data-start="1615" data-end="1659">
<li data-start="1615" data-end="1626">
<p data-start="1617" data-end="1626"><code data-start="1617" data-end="1626">unknown</code></p>
</li>
<li data-start="1630" data-end="1643">
<p data-start="1632" data-end="1643"><code data-start="1632" data-end="1643">getorders</code></p>
</li>
<li data-start="1647" data-end="1659">
<p data-start="1649" data-end="1659"><code data-start="1649" data-end="1659">getorder</code></p>
</li>
</ul>
</li>
<li data-start="1660" data-end="1714">
<p data-start="1663" data-end="1714">Backend intent’e göre ilgili işlemi gerçekleştirir.</p>
</li>
</ol>
<hr data-start="1716" data-end="1719">
<h2 data-start="1721" data-end="1732">Güvenlik</h2>
<ul data-start="1734" data-end="1842">
<li data-start="1734" data-end="1842">
<p data-start="1736" data-end="1842">Backend tarafında rate limit kullanılmıştır.<br data-start="1780" data-end="1783">
Çok fazla istek geldiğinde backend kendini korumaya alır.</p>
</li>
</ul>
<hr data-start="1844" data-end="1847">
<h2 data-start="1849" data-end="1856">Özet</h2>
<ul data-start="1858" data-end="2024">
<li data-start="1858" data-end="1884">
<p data-start="1860" data-end="1884">Frontend: React + Vite</p>
</li>
<li data-start="1885" data-end="1915">
<p data-start="1887" data-end="1915">Backend: Node.js + Express</p>
</li>
<li data-start="1916" data-end="1943">
<p data-start="1918" data-end="1943">Veri yönetimi: Firebase</p>
</li>
<li data-start="1944" data-end="1961">
<p data-start="1946" data-end="1961">Ödeme: Stripe</p>
</li>
<li data-start="1962" data-end="1996">
<p data-start="1964" data-end="1996">Yapay zeka: Ollama + Gemma3:1b</p>
</li>
<li data-start="1997" data-end="2024">
<p data-start="1999" data-end="2024">State yönetimi: Zustand</p>
</li>
</ul>
<p data-start="2026" data-end="2158">Tasarım odaklı değil; temel e-ticaret akışı, kullanıcı işlemleri, ödeme ve yapay zeka desteği üzerine kurulmuş işlevsel bir yapıdır.</p>
