var pastTrackers;
var displayedPixels;

var adServices = {
    "google": ["www.googleadservices.com/pagead/conversion_async.js",
        "www.googletagmanager.com/gtm.js",
        "www.googletagmanager.com/gtag/js"
    ],
    "facebook": ["connect.facebook.net/en_US/fbevents.js"],
    "linkedin": ["ads.linkedin.com/collect/"],
    "reddit": ["www.redditstatic.com/ads/pixel.js"]
}

function matchService(scriptSrc) {
    for (const [company, trackers] of Object.entries(adServices)) {
        for (const tracker of trackers) {
            if (scriptSrc.includes(tracker)) {
                return company
            }
        }
    }
    return undefined
}

function getTrackingScripts() {
    var trackingCompanies = []
    var scripts = document.getElementsByTagName('script');
    
    for (const script of scripts) { 
        var match = matchService(script.src)
        if (match != undefined) {
            trackingCompanies.push(match);
        }
    }

    return trackingCompanies;
}

initializeStorage();


function initializeStorage() {
    console.log("Getting past trackers")
    pastTrackers = storage.getItem("pastTrackers")
    displayedPixels = storage.getItem("displayedPixels")
    if (pastTrackers == undefined) {
        pastTrackers = {
            "google": [],
            "facebook": [],
            "linkedin": [],
            "reddit": []
        }
        displayedPixels = {
            "google": [],
            "facebook": [],
            "linkedin": [],
            "reddit": []
        }
        storage.setItem("pastTrackers", pastTrackers)
    } 
    console.log(pastTrackers["facebook"]);
    storeTrackingScripts();
}

var pixSize = 10;

function addSite(siteInfo, company) {
    pastTrackers[company].push(siteInfo);
    
    var companyColors = {
        "google": "#0F9D58",
        "facebook": "#3b5998",
        "linkedin": "0077b5",
        "reddit": "#ff4301"
    }

    var x = Math.round(Math.random() * document.documentElement.clientWidth - pixSize);
    var y = Math.round(Math.random() * document.documentElement.clientHeight - pixSize);
    var color = companyColors[company] // todo: make this randomized
    
    displayedPixels[company].push([x, y, color])
}

function storeTrackingScripts() {
    var siteInfo = {
        "url": window.location.href,
        "title": document.title,
        "site": document.querySelector("meta[property='og:site_name']").getAttribute('content'),
        "image": document.querySelector("meta[property='og:image']").getAttribute('content'),
        "description": document.querySelector("meta[property='og:description']").getAttribute('content')
    }
    console.log(siteInfo)
    for (const company of getTrackingScripts()) {
        addSite(siteInfo, company);
    }
    
    storage.setItem("pastTrackers", pastTrackers)
    storage.setItem("displayedPixels", displayedPixels)

    displayPixels(displayedPixels);
}

// display pixels and make them expandable
function displayPixels(pixels) {
    var overlay = "<div id=\"pixelOverlay\"></div>"

    var head  = document.getElementsByTagName('head')[0];
    var cssElement = "<link rel=\"stylesheet\" type=\"text/css\" href=\"tracking-pixels.css\" media=\"screen\"/>"

    head.innerHTML += cssElement;

    var body  = document.getElementsByTagName('body')[0];
    body.innerHTML = overlay + body.innerHTML;

    var pixelOverlay = document.getElementById("pixelOverlay")

    for (const [company, companyPixels] of pixels) {
        for (var i = 0; i < companyPixels.length; i++) {
           var x = companyPixels[i][0]
           var y = companyPixels[i][1]
           var color = companyPixels[i][2]

           var pixel = pixelOverlay.createElement("div");
           pixel.style.left = x + "px";
           pixel.style.top = y + "px";
           pixel.style.height = pixSize + "px";
           pixel.style.width = pixSize + "px";
           pixel.style.backgroundColor = color;
        }
    }
}

function injectAds() {
    // create pixel falling animation
    // detect if site is reddit, google, facebook, insta
}
