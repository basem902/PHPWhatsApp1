class WhatsAppBot {
    constructor() {
        this.instanceId = 'instance103032';
        this.token = 'iwerginq0051ef9z';
        this.apiUrl = `https://api.ultramsg.com/${this.instanceId}/`;
    }

    async sendRequest(type, data) {
        const url = `${this.apiUrl}${type}?token=${this.token}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    async processMessage(to, message) {
        switch(message) {
            case '1':
                return await this.sendImage(to);
            case '2':
                return await this.sendVideo(to);
            case '3':
                return await this.sendAudio(to);
            case 'menu':
            default:
                return await this.sendMenu(to);
        }
    }

    async sendMenu(to) {
        const menuText = `*مرحباً بك في البوت*\n\n` +
            `الرجاء اختيار رقم الخدمة المطلوبة:\n\n` +
            `*1* - استلام صورة\n` +
            `*2* - استلام فيديو\n` +
            `*3* - استلام ملف صوتي\n\n` +
            `اكتب *menu* في أي وقت لعرض هذه القائمة`;

        return await this.sendMessage(to, menuText);
    }

    async sendMessage(to, body) {
        const data = {
            to: to,
            body: body
        };
        return await this.sendRequest('messages/chat', data);
    }

    async sendImage(to) {
        const data = {
            to: to,
            image: "https://file-example.s3-accelerate.amazonaws.com/images/test.jpeg",
            caption: "هذه صورة تجريبية" // يمكنك تغيير الصورة والنص
        };
        return await this.sendRequest('messages/image', data);
    }

    async sendVideo(to) {
        const data = {
            to: to,
            video: "https://file-example.s3-accelerate.amazonaws.com/video/test.mp4",
            caption: "هذا فيديو تجريبي" // يمكنك تغيير الفيديو والنص
        };
        return await this.sendRequest('messages/video', data);
    }

    async sendAudio(to) {
        const data = {
            to: to,
            audio: "https://file-example.s3-accelerate.amazonaws.com/audio/2.mp3"
        };
        return await this.sendRequest('messages/audio', data);
    }
}

// إضافة معالج الأحداث للفورم
document.addEventListener('DOMContentLoaded', () => {
    const bot = new WhatsAppBot();
    const form = document.getElementById('messageForm');
    const phoneInput = document.getElementById('phoneInput');
    const messageInput = document.getElementById('messageInput');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = phoneInput.value;
        const message = messageInput.value;
        
        if (phone && message) {
            const response = await bot.processMessage(phone, message);
            if (response && response.sent) {
                addMessage(`تم إرسال الرسالة إلى ${phone}`, 'sent');
            } else {
                addMessage('فشل في إرسال الرسالة', 'error');
            }
            messageInput.value = ''; // مسح حقل الرسالة بعد الإرسال
        }
    });
});

function addMessage(text, type) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
} 