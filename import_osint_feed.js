const fs = require('fs');
const GhostAdminAPI = require('@tryghost/admin-api');

// ==========================================
// KULLANIM:
// 1. Terminalde `npm install @tryghost/admin-api` komutunu çalıştırın.
// 2. Ghost Admin paneline gidin: Settings > Integrations > Add Custom Integration.
// 3. Oradaki "Admin API Key" ve "API URL" değerlerini kopyalayıp aşağıya yapıştırın.
// 4. `node import_osint_feed.js` yazarak scripti çalıştırın.
// ==========================================

const api = new GhostAdminAPI({
    url: 'http://localhost:2368', // BURAYA GHOST SİTE LİNKİNİZİ YAZIN (örn. https://site.com)
    key: 'YOUT_ADMIN_API_KEY',    // BURAYA ADMIN API KEY'İ YAPIŞTIRIN
    version: 'v5.0'
});

async function importFeed() {
    try {
        const jsonString = fs.readFileSync('feeds_iran_full_20260314_153039.json', 'utf8');
        const data = JSON.parse(jsonString);
        console.log(`[*] ${data.length} adet veri bulundu. İçe aktarım başlıyor...`);

        // Test amaçlı sistemi yormamak için ilk 30 postu yüklüyoruz.
        // Hepsini yüklemek isterseniz 'Math.min(data.length, 30)' kısmını kaldırıp sadece 'data.length' yapabilirsiniz.
        const limit = Math.min(data.length, 30);

        for (let i = 0; i < limit; i++) {
            const item = data[i];
            
            // Etiketleri (Tags) oluşturuyoruz
            let tags = ['sondakika']; // Sistemimizin 3D Haritası için gerekli zorunlu tag
            
            // Eğer başlık veya içerikte İran/Tehran falan geçiyorsa 'iran' tagi ekle
            const contentRaw = (item.title + " " + item.content).toLowerCase();
            if (contentRaw.includes('iran') || contentRaw.includes('tehran')) tags.push('iran');
            if (contentRaw.includes('israel') || contentRaw.includes('zionist')) tags.push('israel');
            if (contentRaw.includes('usa') || contentRaw.includes('america')) tags.push('usa');
            if (contentRaw.includes('russia')) tags.push('russia');
            if (contentRaw.includes('turkey')) tags.push('turkey');
            if (item.categories) tags.push(item.categories); // Orijinal kategoriyi de tag olarak ekle

            try {
                const newPost = await api.posts.add({
                    title: item.title,
                    html: item.full_content || item.description || "İçerik çekilemedi.",
                    status: 'published',
                    published_at: new Date(item.published || Date.now()).toISOString(),
                    tags: tags
                }, {source: 'html'});

                console.log(`[+] Yüklendi: ${newPost.title.substring(0, 50)}...`);
            } catch (postErr) {
                console.error(`[-] Hata (Post Yüklenemedi): ${item.title.substring(0, 50)}`, postErr.message);
            }
        }
        console.log("\n[!] Tüm işlemler başarıyla tamamlandı!");
        
    } catch (err) {
        console.error("[-] JSON Dosya okuma veya API hatası:", err);
    }
}

importFeed();
