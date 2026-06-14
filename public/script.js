async function shortenUrl() {

    const originalUrl =
        document.getElementById("urlInput").value;

    try {

        const response = await fetch("/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                originalUrl
            })
        });

        const data = await response.json();

        /*
        SHOW ERROR
        */

        if (response.status !== 200) {

            document.getElementById("result").innerHTML = `

                <p class="error">
                    ${data.message}
                </p>

            `;

            return;
        }

        /*
        SHOW SHORT URL
        */

        document.getElementById("result").innerHTML = `

            <div class="result-box">

                <p class="success-text">
                    Short URL Generated Successfully 🎉
                </p>

                <a href="${data.shortUrl}" target="_blank">
                    ${data.shortUrl}
                </a>

                <br><br>

                <button onclick="copyUrl('${data.shortUrl}')">
                    Copy URL
                </button>

            </div>

        `;

        /*
        GENERATE QR CODE
        */

        generateQRCode(data.shortUrl);

    } catch (error) {

        console.log(error);

        document.getElementById("result").innerHTML = `

            <p class="error">
                Something went wrong
            </p>

        `;
    }
}

/*
==================================
COPY FUNCTION
==================================
*/

function copyUrl(url) {

    navigator.clipboard.writeText(url);

    alert("URL Copied Successfully!");
}

/*
==================================
QR CODE
==================================
*/

function generateQRCode(url) {

    const canvas =
        document.getElementById("qrCode");

    QRCode.toCanvas(canvas, url, function(error) {

        if (error) {
            console.error(error);
        }
    });
}