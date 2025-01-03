<?php
header('Content-Type: application/json');

// استلام البيانات من UltraMsg
$data = json_decode(file_get_contents('php://input'), true);

// التحقق من وجود البيانات
if (isset($data['data'])) {
    $message = $data['data'];
    $from = $message['from']; // رقم المرسل
    $body = $message['body']; // نص الرسالة

    // إنشاء كائن للتعامل مع الرسائل
    $bot = new WhatsAppBot();
    
    // معالجة الرسالة حسب المحتوى
    switch(trim($body)) {
        case '1':
            $bot->sendImage($from);
            break;
        case '2':
            $bot->sendVideo($from);
            break;
        case '3':
            $bot->sendAudio($from);
            break;
        default:
            $bot->sendMenu($from);
            break;
    }
}

class WhatsAppBot {
    private $instanceId = 'instance103032';
    private $token = 'iwerginq0051ef9z';
    private $apiUrl;

    public function __construct() {
        $this->apiUrl = "https://api.ultramsg.com/{$this->instanceId}/";
    }

    private function sendRequest($endpoint, $data) {
        $url = "{$this->apiUrl}{$endpoint}?token={$this->token}";
        
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);
        
        return json_decode($response, true);
    }

    public function sendMenu($to) {
        $menuText = "*مرحباً بك في البوت*\n\n" .
                   "الرجاء اختيار رقم الخدمة المطلوبة:\n\n" .
                   "*1* - استلام صورة\n" .
                   "*2* - استلام فيديو\n" .
                   "*3* - استلام ملف صوتي\n\n" .
                   "اختر رقم الخدمة المطلوبة";

        return $this->sendMessage($to, $menuText);
    }

    public function sendMessage($to, $body) {
        $data = [
            "to" => $to,
            "body" => $body
        ];
        return $this->sendRequest("messages/chat", $data);
    }

    public function sendImage($to) {
        $data = [
            "to" => $to,
            "image" => "https://file-example.s3-accelerate.amazonaws.com/images/test.jpeg",
            "caption" => "هذه صورة تجريبية"
        ];
        return $this->sendRequest("messages/image", $data);
    }

    public function sendVideo($to) {
        $data = [
            "to" => $to,
            "video" => "https://file-example.s3-accelerate.amazonaws.com/video/test.mp4",
            "caption" => "هذا فيديو تجريبي"
        ];
        return $this->sendRequest("messages/video", $data);
    }

    public function sendAudio($to) {
        $data = [
            "to" => $to,
            "audio" => "https://file-example.s3-accelerate.amazonaws.com/audio/2.mp3"
        ];
        return $this->sendRequest("messages/audio", $data);
    }
}

// إرجاع استجابة للـ webhook
http_response_code(200);
echo json_encode(["status" => "success"]);
?> 