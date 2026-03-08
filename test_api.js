
async function testChat() {
    try {
        const response = await fetch('http://localhost:3000/api/chat-beeba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: "ازيك يا دحيح؟" })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testChat();
