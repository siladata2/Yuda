// silatech/general/product.js - Multiple Products Support
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product catalog
const PRODUCTS = {
  premium: {
    title: '📦 Sila Tech Premium Bot',
    price: 70000,
    description: 'Complete WhatsApp Bot Framework with all features',
    currency: 'TZS',
    image: 'premium.jpg'
  },
  basic: {
    title: '📦 Sila Tech Basic Bot',
    price: 35000,
    description: 'Essential WhatsApp Bot with core features',
    currency: 'TZS',
    image: 'basic.jpg'
  },
  enterprise: {
    title: '🏢 Sila Tech Enterprise Bot',
    price: 150000,
    description: 'Advanced WhatsApp Bot for businesses with custom features',
    currency: 'TZS',
    image: 'enterprise.jpg'
  },
  custom: {
    title: '🎨 Custom Bot Development',
    price: 250000,
    description: 'Custom WhatsApp Bot built to your specifications',
    currency: 'TZS',
    image: 'custom.jpg'
  }
};

export default {
  name: 'product',
  alias: ['prod', 'shop', 'store', 'catalog'],
  description: 'Send product messages with WhatsApp catalog',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    const businessOwnerJid = '120363426725658598@newsletter';
    
    // Help
    if (args.length === 0 || args[0].toLowerCase() === 'help') {
      const productList = Object.entries(PRODUCTS).map(([key, prod]) => {
        return `• ${key}: ${prod.title} - ${prod.currency} ${prod.price.toLocaleString()}`;
      }).join('\n');
      
      const helpText = `📦 *Product Catalog*\n\n` +
                       `*Available Products:*\n${productList}\n\n` +
                       `*Usage:*\n` +
                       `${prefix}product [product_name]\n` +
                       `${prefix}product custom "Your Title" 75000 "Your Description"\n\n` +
                       `*Examples:*\n` +
                       `${prefix}product premium\n` +
                       `${prefix}product custom "My Bot" 50000 "Custom WhatsApp Bot"\n\n` +
                       `💡 Reply to an image to include product photo\n` +
                       `👨‍💻 *Store:* Sila Tech Shop`;
      
      await sock.sendMessage(sender, { text: helpText });
      return;
    }

    try {
      let productData = null;
      let productName = args[0].toLowerCase();
      
      // Check if it's a custom product
      if (productName === 'custom' && args.length >= 3) {
        // Custom product: !product custom "Title" 50000 "Description"
        let customTitle = args[1] || 'Custom Product';
        let customPrice = parseInt(args[2].replace(/,/g, '')) || 50000;
        let customDescription = args.slice(3).join(' ') || 'Custom product from Sila Tech';
        
        productData = {
          title: customTitle,
          price: customPrice,
          description: customDescription,
          currency: 'TZS'
        };
      } else if (PRODUCTS[productName]) {
        // Predefined product
        productData = PRODUCTS[productName];
      } else {
        // Try to find product by partial name
        const foundKey = Object.keys(PRODUCTS).find(key => 
          key.includes(productName) || PRODUCTS[key].title.toLowerCase().includes(productName)
        );
        
        if (foundKey) {
          productData = PRODUCTS[foundKey];
        } else {
          await sock.sendMessage(sender, { 
            text: `❌ Product "${productName}" not found.\nType ${prefix}product help to see available products.` 
          });
          return;
        }
      }
      
      // Get product image
      let imageBuffer = null;
      
      // Check if replying to an image
      if (msg.message?.imageMessage) {
        try {
          imageBuffer = await sock.downloadMediaMessage(msg);
          console.log('📸 Using replied image for product');
        } catch (error) {
          console.log('⚠️ Could not download image:', error.message);
        }
      }
      
      // Try to load product image from assets
      if (!imageBuffer && productData.image) {
        const imagePath = path.join(__dirname, '../../assets/products', productData.image);
        if (fs.existsSync(imagePath)) {
          try {
            imageBuffer = fs.readFileSync(imagePath);
            console.log(`🖼️ Using product image: ${productData.image}`);
          } catch (error) {
            console.log('⚠️ Could not load product image');
          }
        }
      }
      
      // Use placeholder if no image
      if (!imageBuffer) {
        const placeholderUrl = `https://via.placeholder.com/300x300.png?text=Sila+Tech+${encodeURIComponent(productData.title)}`;
        imageBuffer = { url: placeholderUrl };
      }
      
      const priceAmount1000 = productData.price * 1000;
      const salePriceAmount1000 = priceAmount1000 * 0.85; // 15% discount
      
      // Send product message
      await sock.sendMessage(sender, {
        image: imageBuffer,
        body: `👋🏻 *${productData.title}*\n\n🛍️ ${productData.description}`,
        footer: '✨ Sila Tech Shop • Quality Products',
        product: {
          currencyCode: productData.currency || 'TZS',
          description: productData.description,
          priceAmount1000: priceAmount1000,
          productId: randomUUID(),
          productImageCount: 1,
          salePriceAmount1000: salePriceAmount1000,
          signedUrl: 'https://github.com/itsliaaa/baileys',
          title: productData.title,
          url: 'https://github.com/itsliaaa/baileys'
        },
        businessOwnerJid: businessOwnerJid,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: businessOwnerJid,
            newsletterName: 'SILA TECH SHOP',
            serverMessageId: Date.now().toString()
          }
        }
      }, { 
        quoted: msg,
        ephemeralExpiration: 86400
      });
      
      // Send confirmation
      const confirmText = `✅ *Product Sent!*\n\n` +
                          `📦 *${productData.title}*\n` +
                          `💰 *Price:* ${productData.currency || 'TZS'} ${productData.price.toLocaleString()}\n` +
                          `💵 *Sale:* ${productData.currency || 'TZS'} ${(productData.price * 0.85).toLocaleString()}\n` +
                          `📝 *${productData.description}*\n\n` +
                          `🛍️ *Visit our store:*\n` +
                          `🔗 https://github.com/itsliaaa/baileys\n\n` +
                          `👨‍💻 *Sila Tech Shop*`;
      
      await sock.sendMessage(sender, { text: confirmText });
      
    } catch (error) {
      console.error('Product command error:', error);
      await sock.sendMessage(sender, { 
        text: `❌ Error: ${error.message}` 
      });
    }
  }
};