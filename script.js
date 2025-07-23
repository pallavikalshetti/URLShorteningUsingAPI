const inputLongerUrlObject = document.getElementById('inputLongUrl');
const linkForm = document.getElementById('createShortenLinks');

displayShortenURLlist();

function displayShortenURLlist() {
    const shortenUrlList = document.getElementById("shortenUrlList");
    shortenUrlList.innerHTML = "";
    const shortneURLStorage = JSON.parse(localStorage.getItem('urlsFromStorage')) || [];
    for (let i = 0; i < shortneURLStorage.length; i++) {
        const createNewRow = document.createElement("tr");
        createNewRow.style.border = '1px solid black';
        for (let key of ["usrLongUrl", "usrShortUrl"]) {
            const createCol = document.createElement("td");
            createCol.style.border = '1px solid black';
            createCol.textContent = shortneURLStorage[i][key];
            createNewRow.appendChild(createCol);
        } 
        const createActionCol = document.createElement("td");
        createActionCol.innerHTML = `
            <button id="copy-btn${i}" onclick="copyToClipboard(${i})">Copy</button>
        `;
        createNewRow.appendChild(createActionCol);
        shortenUrlList.appendChild(createNewRow);
    }
}

inputLongerUrlObject.addEventListener('input', (event) => {
  if (inputLongerUrlObject.validity.valueMissing) {
      inputLongerUrlObject.setCustomValidity('URL is required');
  }else if(inputLongerUrlObject.validity.tooShort) {
      inputLongerUrlObject.setCustomValidity('URL should be 4-20 characters');
  } else {
      inputLongerUrlObject.setCustomValidity('');
  }
});

linkForm.addEventListener('submit',function(event){
    event.preventDefault();
    const inputLongerUrlValue = document.getElementById('inputLongUrl').value;
    const outputShortUrl = createShortUrl(inputLongerUrlValue);
});

async function createShortUrl(inputLongUrl){
    const usrToken = '5045087cfe0eddc2bdb3bc8cafb9ec87548916e2';
    const usrGroupID = 'Bp7kfHwMqWo';
    const bitlyAPIresponse = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${usrToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "long_url": inputLongUrl, "domain": "bit.ly", "group_guid": usrGroupID })
    });
    
    if (bitlyAPIresponse.ok) {
        const data = await bitlyAPIresponse.json();
        const outputShortUrl = data.link;
        addUrlToLocalStorage(inputLongUrl,outputShortUrl);
    } else {
        const error = await bitlyAPIresponse.json();
        alert('Error: ' + (error.message || 'Unable to shorten URL'));
    }
}

function addUrlToLocalStorage(longUrl, shortUrl){
    const shortneURLStorage = JSON.parse(localStorage.getItem('urlsFromStorage')) || [];
    shortneURLStorage.push({
        usrLongUrl: longUrl,
        usrShortUrl: shortUrl,
    })
    localStorage.setItem('urlsFromStorage', JSON.stringify(shortneURLStorage));
    displayShortenURLlist();
}

function copyToClipboard(id){
    const urlsFromStorage = JSON.parse(localStorage.getItem('urlsFromStorage'));
    const urlsFromStorageItem = urlsFromStorage[id];
    for(i=0;i<urlsFromStorage.length;i++){
        if(i===id){
            navigator.clipboard.writeText(urlsFromStorageItem.usrShortUrl);
            const copyButton = document.getElementById(`copy-btn${id}`);
            copyButton.textContent = "Copied";
            copyButton.style.backgroundColor = "hsl(180, 66%, 49%)";    
        }else{
            const copyButton = document.getElementById(`copy-btn${i}`);
            copyButton.textContent = "Copy";
            copyButton.style.backgroundColor = "#f0f0f0";
            copyButton.style.border = "none";
        }
    }    
}
