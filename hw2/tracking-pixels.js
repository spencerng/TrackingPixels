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
storeTrackingScripts();



function initializeStorage() {
    console.log("Getting past trackers")
    pastTrackers = window.localStorage.getItem("pastTrackers")
    displayedPixels = window.localStorage.getItem("displayedPixels")
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
        window.localStorage.setItem("pastTrackers", pastTrackers)
    }

}

function addSite(siteInfo, company) {
    pastTrackers[company].push(siteInfo);
    window.localStorage.setItem("pastTrackers", pastTrackers)
    // TODO: add pixel display/generation here such that it's stored
    // in displayedPixels
    // Pixel specified by color (based on company name), location s.t. no overlap
}

function storeTrackingScripts() {
    var siteInfo = {
        "url": window.location.href,
        "title": document.title,
        "image": document.querySelector("meta[property='og:image']").getAttribute('content'),
        "description": document.querySelector("meta[property='og:description']").getAttribute('content')
    }
    console.log(siteInfo)
    for (const company of getTrackingScripts()) {
        addSite(siteInfo, company);
    }

    displayPixels(displayedPixels);
}

function displayPixels(pixels) {
    // display pixels and make them expandable
}

function injectAds() {
    // create pixel falling animation
    // detect if site is reddit, google, facebook, insta
}
