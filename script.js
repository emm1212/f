
    // بيانات المنتجات
    const products = {
        woman: [
            { id: "w1", name: "كريم ترطيب فائق", price: 6500, emoji: "🧴", desc: "ترطيب 24 ساعة" },
            { id: "w2", name: "أحمر شفاه غير لامع", price: 3200, emoji: "💄", desc: "لون ثابت" },
            { id: "w3", name: "سيروم فيتامين C", price: 9900, emoji: "✨", desc: "لتفتيح البشرة" },
            { id: "w4", name: "ماسك طيني للوجه", price: 4500, emoji: "🎭", desc: "ينظف المسام" },
            { id: "w5", name: "عطر زهري فاخر", price: 12000, emoji: "🌸", desc: "تركيز عالي" },
            { id: "w6", name: "شامبو حيوي لتطويل الشعر", price: 5800, emoji: "💇‍♀️", desc: "زيت الأرجان" }
        ],
        man: [
            { id: "m1", name: "جل استحمام منعش", price: 4200, emoji: "🚿", desc: "رائحة خشبية" },
            { id: "m2", name: "بخاخ معطر للجسم", price: 7500, emoji: "🧴", desc: "ثبات طويل" },
            { id: "m3", name: "كريم لحية وكثافة", price: 6900, emoji: "🧔", desc: "ترطيب وتصفيف" },
            { id: "m4", name: "مزيل عرق طبي", price: 3800, emoji: "🛡️", desc: "خالي من الألومنيوم" },
            { id: "m5", name: "غسول وجه للبشرة الدهنية", price: 5200, emoji: "🧼", desc: "مضاد للبثور" },
            { id: "m6", name: "أدوات حلاقة احترافية", price: 2500, emoji: "🪒", desc: "شفرة حادة" }
        ],
        child: [
            { id: "c1", name: "شامبو أطفال لطيف", price: 3900, emoji: "🧴", desc: "دموع لا تلسع" },
            { id: "c2", name: "كريم حماية من الحفاض", price: 4800, emoji: "🧸", desc: "مضاد للاحمرار" },
            { id: "c3", name: "لوشن معطر للجسم", price: 5200, emoji: "🍼", desc: "رائحة بودرة أطفال" },
            { id: "c4", name: "صابون غليسيرين للأطفال", price: 2500, emoji: "🫧", desc: "طبيعي 100%" },
            { id: "c5", name: "فرشاة أسنان ناعمة جداً", price: 1800, emoji: "🪥", desc: "مناسبة لعمر 2+ سنوات" },
            { id: "c6", name: "ماء ورد طبيعي", price: 3200, emoji: "🌹", desc: "بدون كحول" }
        ]
    };

    let cart = [];

    // تأثير تكبير/تصغير السلة عند التمرير
    let lastScrollTop = 0;
    const cartIcon = document.getElementById('cartIcon');
    
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            cartIcon.classList.add('small');
        } else if (currentScroll < lastScrollTop) {
            cartIcon.classList.remove('small');
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });

    function showToast(productName) {
        const oldToast = document.querySelector('.toast-message');
        if(oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <span class="toast-icon">✅</span>
            <span>تمت إضافة "${productName}" إلى السلة!</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    function showToastMessage(message) {
        const oldToast = document.querySelector('.toast-message');
        if(oldToast) oldToast.remove();
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `<span class="toast-icon">ℹ️</span><span>${message}</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    function addToCart(product, categoryKey) {
        const existingIndex = cart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                emoji: product.emoji
            });
        }
        updateCartUI();
        showToast(product.name);
        
        cartIcon.style.transform = 'scale(1.1)';
        setTimeout(() => { cartIcon.style.transform = ''; }, 200);
    }

    function removeFromCart(id) {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
        }
        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsDiv = document.getElementById('cartItems');
        const cartCountSpan = document.getElementById('cartCount');
        const cartTotalSpan = document.getElementById('cartTotal');

        let totalItems = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p style="text-align:center; color:#999;">🛍️ السلة فارغة 🛍️</p>';
            cartCountSpan.innerText = '0';
            cartTotalSpan.innerText = '💰 الإجمالي: 0 ريال';
            return;
        }

        let html = '';
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.emoji} ${item.name}</div>
                        <div class="cart-item-price">${item.price} ريال × ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">−</button>
                </div>
            `;
        });
        cartItemsDiv.innerHTML = html;
        cartCountSpan.innerText = totalItems;
        cartTotalSpan.innerText = `💰 الإجمالي: ${totalPrice} ريال`;
    }

    function clearCart() {
        cart = [];
        updateCartUI();
        toggleCart(false);
        showToastMessage("🗑️ تم تفريغ السلة");
    }

    function toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    function checkoutWhatsApp() {
        if (cart.length === 0) {
            showToastMessage("⚠️ السلة فارغة! أضف منتجات أولاً");
            return;
        }

        let message = "🛍️ طلب جديد من موقع كوزماتيك المكلا:%0A%0A";
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `• ${item.emoji} ${item.name} - ${item.price} ريال × ${item.quantity} = ${itemTotal} ريال%0A`;
        });
        message += `%0A💰 الإجمالي الكلي: ${total} ريال%0A%0A`;
        message += `📍 التوصيل إلى: المكلا، حضرموت%0A`;
        message += `📞 رقم العميل: (يرجى إضافته للتواصل)`;

        const phone = "967739342521";
        const url = `https://wa.me/${phone}?text=${message}`;
        window.open(url, '_blank');
        
        showToastMessage("📲 تم توجيهك إلى واتساب لإتمام الطلب");
    }

    function renderProducts(category, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        const productList = products[category];
        grid.innerHTML = "";
        productList.forEach(prod => {
            const productDiv = document.createElement("div");
            productDiv.className = "product-item";
            productDiv.innerHTML = `
                <div class="product-img">${prod.emoji}</div>
                <div class="product-name">${prod.name}</div>
                <div class="product-desc" style="font-size:0.7rem; color:#888;">${prod.desc}</div>
                <div class="product-price">${prod.price} ريال</div>
                <button class="add-to-cart" onclick='addToCart(${JSON.stringify(prod)}, "${category}")'>➕ أضف إلى السلة</button>
            `;
            grid.appendChild(productDiv);
        });
    }

    function showCategory(category) {
        document.getElementById('womanProducts').style.display = 'none';
        document.getElementById('manProducts').style.display = 'none';
        document.getElementById('childProducts').style.display = 'none';
        document.getElementById('mainCategories').style.display = 'none';
        if(category === 'woman') {
            document.getElementById('womanProducts').style.display = 'block';
            renderProducts('woman', 'womanGrid');
        } else if(category === 'man') {
            document.getElementById('manProducts').style.display = 'block';
            renderProducts('man', 'manGrid');
        } else if(category === 'child') {
            document.getElementById('childProducts').style.display = 'block';
            renderProducts('child', 'childGrid');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function backToMain() {
        document.getElementById('womanProducts').style.display = 'none';
        document.getElementById('manProducts').style.display = 'none';
        document.getElementById('childProducts').style.display = 'none';
        document.getElementById('mainCategories').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.onload = () => {
        document.getElementById('womanProducts').style.display = 'none';
        document.getElementById('manProducts').style.display = 'none';
        document.getElementById('childProducts').style.display = 'none';
        document.getElementById('mainCategories').style.display = 'block';
        updateCartUI();
    };
