const fs = require('fs');

async function testChatWithImage() {
    try {
        // Read the image file the user uploaded
        const imagePath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\4b110761-61d6-4b29-a956-ed5d4679fbea\\uploaded_media_1772711151562.png';
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = 'image/png';

        const payload = {
            message: "إيه اللي في الصورة دي يا دحيح؟",
            attachments: [
                {
                    data: base64Image,
                    mimeType: mimeType
                }
            ]
        };

        const response = await fetch('http://localhost:3000/api/chat-beeba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Chat Response:", data);
    } catch (error) {
        console.error("Error testing image chat:", error);
    }
}

testChatWithImage();
