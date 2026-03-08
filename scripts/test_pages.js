const fs = require('fs');
const pdf = require('pdf-parse');

async function testPdfPages() {
    const dataBuffer = fs.readFileSync('public/materials/WEB-201/Lect (1) - Web 2.pdf');

    // Custom page render to add markers
    let pageCount = 0;
    const options = {
        pagerender: function (pageData) {
            pageCount++;
            return pageData.getTextContent().then(function (textContent) {
                let lastY, text = `---PAGE ${pageCount}--- `;
                for (let item of textContent.items) {
                    if (lastY != item.transform[5]) {
                        text += '\n';
                    }
                    text += item.str;
                    lastY = item.transform[5];
                }
                return text;
            });
        }
    };

    const data = await pdf(dataBuffer, options);
    console.log("Pages found:", pageCount);
    console.log("Partial text:\n", data.text.substring(0, 1000));
}

testPdfPages();
