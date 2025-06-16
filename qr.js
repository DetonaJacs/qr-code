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
const defaultUrl = "https://qr-code-silk-alpha.vercel.app/";
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
    if (!qrImg) {
      alert("Por favor, gere um QR Code primeiro");
      return;
    }

    // Obter a imagem como blob
    const response = await fetch(qrImg.src);
    const blob = await response.blob();

    // Criar arquivo para compartilhamento
    const file = new File([blob], "QRCode-WhatsApp.png", {
      type: blob.type
    });

    // Criar mensagem com o link gerado
    const shareMessage = `Confira este QR Code: ${text}\n\nGerado em: ${window.location.href}`;

    // Verificar se é WhatsApp Web
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isWhatsAppWeb = window.location.href.includes('web.whatsapp.com');

    if (isMobile || isWhatsAppWeb) {
      // Se for mobile ou WhatsApp Web, compartilhar via link do WhatsApp
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else if (navigator.canShare?.({ files: [file] })) {
      // Se for navegador com suporte a compartilhamento de arquivos
      await navigator.share({
        files: [file],
        title: "QR Code WhatsApp - Gerado Online",
        text: shareMessage,
        url: window.location.href
      });
    } else {
      // Fallback para copiar o link
      await navigator.clipboard.writeText(shareMessage);
      alert("Link copiado para a área de transferência:\n" + shareMessage);
    }
  } catch (error) {
    console.error("Erro ao tentar compartilhar:", error);
    // Fallback simples se tudo falhar
    alert(`Compartilhe este link:\n${text}`);
  }
}


// Inicialização
generateQRCode();

document.addEventListener('DOMContentLoaded', function() {
const installButton = document.getElementById('installButton');

let deferredPrompt;  

  window.addEventListener('beforeinstallprompt', (e) => {  
    e.preventDefault();  
    deferredPrompt = e;  
      
    if (installButton) {  
      installButton.style.display = 'block';  
    }  
  });  

  if (installButton) {  
    installButton.addEventListener('click', async () => {  
      if (deferredPrompt) {  
        deferredPrompt.prompt();  
        const { outcome } = await deferredPrompt.userChoice;  
        if (outcome === 'accepted') {  
          installButton.style.display = 'none';  
        }  
      }  
    });  
  }  

  // Verificar se já está instalado  
  if (window.matchMedia('(display-mode: standalone)').matches && installButton) {  
    installButton.style.display = 'none';  
  }  

  // Registrar Service Worker  
  if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('/sw.js')  
      .then(registration => {  
        console.log('ServiceWorker registrado:', registration.scope);  
      })  
      .catch(err => {  
        console.log('Falha no ServiceWorker:', err);  
      });  
  }  
});
