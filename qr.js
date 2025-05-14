const download = document.querySelector(".download");
const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share-btn");
const sizes = document.querySelector(".sizes");
const toggleWhatsappBtn = document.querySelector(".toggle-whatsapp-btn");
const generateWhatsappBtn = document.querySelector(".generate-whatsapp-btn");
const whatsappFields = document.querySelector(".whatsapp-fields");
const defaultFields = document.querySelector(".default-fields");
const whatsappNumber = document.querySelector("#whatsapp-number");
const whatsappMessage = document.querySelector("#whatsapp-message");

// Configurações iniciais
const defaultUrl = "https://exemplo.com";
let colorLight = "#ffffff",
    colorDark = "#000000",
    text = defaultUrl,
    size = 400;

const fixedLogo = "./img/logo.png";

// Event listeners
qrText.addEventListener("input", handleQRText);
sizes.addEventListener("change", handleSize);
shareBtn.addEventListener("click", handleShare);
toggleWhatsappBtn.addEventListener("click", toggleWhatsappFields);
generateWhatsappBtn.addEventListener("click", generateWhatsappQR);

function toggleWhatsappFields() {
    whatsappFields.style.display = whatsappFields.style.display === "none" ? "block" : "none";
    defaultFields.style.display = defaultFields.style.display === "none" ? "block" : "none";
    
    if (whatsappFields.style.display === "block") {
        whatsappNumber.focus();
    } else {
        qrText.focus();
    }
}

function generateWhatsappQR() {
    const number = whatsappNumber.value.trim();
    if (!number) {
        alert("Por favor, digite um número de WhatsApp válido com DDD");
        whatsappNumber.focus();
        return;
    }

    // Remove caracteres não numéricos
    const cleanNumber = number.replace(/\D/g, '');
    
    let whatsappUrl = `https://wa.me/${cleanNumber}`;
    
    if (whatsappMessage.value) {
        whatsappUrl += `?text=${encodeURIComponent(whatsappMessage.value)}`;
    }
    
    text = whatsappUrl;
    generateQRCode();
    qrText.value = whatsappUrl; // Atualiza também o campo normal
}

function handleQRText(e) {
    text = e.target.value || defaultUrl;
    generateQRCode();
}

function handleSize(e) {
    size = e.target.value;
    generateQRCode();
}

async function generateQRCode() {
    qrContainer.innerHTML = "";
    
    const tempDiv = document.createElement("div");
    new QRCode(tempDiv, {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark
    });
    
    const combinedUrl = await generateQRWithLogo(tempDiv.querySelector("canvas"));
    
    qrContainer.innerHTML = `<img src="${combinedUrl}" alt="QR Code" style="width:${size}px;height:${size}px">`;
    download.href = combinedUrl;
}

async function generateQRWithLogo(qrCanvas) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        
        // Desenhar QR Code
        ctx.drawImage(qrCanvas, 0, 0, size, size);
        
        // Carregar e adicionar logo
        const logoImg = new Image();
        logoImg.crossOrigin = "Anonymous";
        logoImg.onload = function() {
            const logoSizePx = size * 0.15;
            const x = (size - logoSizePx) / 2;
            const y = (size - logoSizePx) / 2;
            const padding = logoSizePx * 0.1;
            const borderWidth = 2; // Largura da borda preta
            
            // Criar área arredondada para o fundo branco
            ctx.beginPath();
            const borderRadius = 10; // Raio do arredondamento
            const bgWidth = logoSizePx + 2*padding;
            const bgHeight = logoSizePx + 2*padding;
            const bgX = x - padding;
            const bgY = y - padding;
            
            // Desenhar retângulo arredondado para o fundo branco
            ctx.moveTo(bgX + borderRadius, bgY);
            ctx.lineTo(bgX + bgWidth - borderRadius, bgY);
            ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + borderRadius);
            ctx.lineTo(bgX + bgWidth, bgY + bgHeight - borderRadius);
            ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - borderRadius, bgY + bgHeight);
            ctx.lineTo(bgX + borderRadius, bgY + bgHeight);
            ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - borderRadius);
            ctx.lineTo(bgX, bgY + borderRadius);
            ctx.quadraticCurveTo(bgX, bgY, bgX + borderRadius, bgY);
            ctx.closePath();
            
            // Preencher com branco
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            
            // Adicionar borda preta ao redor do fundo branco
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = borderWidth;
            ctx.stroke();
            
            // Criar clipping path arredondado para a logo
            ctx.save();
            ctx.beginPath();
            const logoRadius = borderRadius - borderWidth/2;
            ctx.moveTo(x + logoRadius, y);
            ctx.lineTo(x + logoSizePx - logoRadius, y);
            ctx.quadraticCurveTo(x + logoSizePx, y, x + logoSizePx, y + logoRadius);
            ctx.lineTo(x + logoSizePx, y + logoSizePx - logoRadius);
            ctx.quadraticCurveTo(x + logoSizePx, y + logoSizePx, x + logoSizePx - logoRadius, y + logoSizePx);
            ctx.lineTo(x + logoRadius, y + logoSizePx);
            ctx.quadraticCurveTo(x, y + logoSizePx, x, y + logoSizePx - logoRadius);
            ctx.lineTo(x, y + logoRadius);
            ctx.quadraticCurveTo(x, y, x + logoRadius, y);
            ctx.closePath();
            ctx.clip();
            
            // Desenhar logo
            ctx.drawImage(logoImg, x, y, logoSizePx, logoSizePx);
            ctx.restore();
            
            resolve(canvas.toDataURL("image/png"));
        };
        logoImg.src = fixedLogo;
    });
}

async function handleShare() {
    try {
        const qrImg = qrContainer.querySelector("img");
        if (!qrImg) return;
        
        const blob = await (await fetch(qrImg.src)).blob();
        const file = new File([blob], "QRCode.png", {
            type: blob.type
        });
        
        await navigator.share({
            files: [file],
            title: text
        });
    } catch (error) {
        alert("Seu navegador não suporta compartilhamento.");
    }
}



// Inicialização
generateQRCode();

let deferredPrompt;
        const installButton = document.getElementById('installButton');

        window.addEventListener('beforeinstallprompt', (e) => {
            // Impede o prompt automático
            e.preventDefault();
            // Guarda o evento para usar depois
            deferredPrompt = e;
            // Mostra o botão
            installButton.style.display = 'block';
            
            // Detecta se é mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (!isMobile) {
                installButton.style.display = 'none'; // Esconde em desktop
            }
        });

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Mostra o prompt de instalação
                deferredPrompt.prompt();
                // Espera a resposta do usuário
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('Usuário aceitou a instalação');
                    installButton.style.display = 'none';
                } else {
                    console.log('Usuário recusou a instalação');
                }
                deferredPrompt = null;
            }
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA foi instalado');
            installButton.style.display = 'none';
        });

        // Verifica se já está instalado
        window.addEventListener('load', () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                installButton.style.display = 'none';
            }
        });
