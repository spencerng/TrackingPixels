var pastTrackers;
var displayedPixels;
var pixSize = 10;

var adServices = {
    "google": ["www.googleadservices.com/pagead/conversion_async.js",
        "www.googletagmanager.com/gtm.js",
        "www.googletagmanager.com/gtag/js"
    ],
    "facebook": ["connect.facebook.net/en_US/fbevents.js"],
    "linkedin": ["ads.linkedin.com/collect/"],
    "reddit": ["www.redditstatic.com/ads/pixel.js"],
    "twitter": ["static.ads-twitter.com/uwt.js"]
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

async function clearStorage() {
    pastTrackers = {
        "google": [],
        "facebook": [],
        "linkedin": [],
        "twitter": [],
        "reddit": []
    }
    displayedPixels = {
        "google": [],
        "facebook": [],
        "linkedin": [],
        "twitter": [],
        "reddit": []
    }

    storeTrackingScripts();
}


initializeStorage();


async function initializeStorage() {

    chrome.storage.local.get(["pastTrackers", "displayedPixels"], function (result) {
        if (Object.keys(result).length != 2) {
            clearStorage();
        } else {
            pastTrackers = result["pastTrackers"];
            displayedPixels = result["displayedPixels"];
            storeTrackingScripts();
        }
    });
}

function randInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomPixel(baseRGB) {
    var newRGB = []
    for (var i = 0; i < baseRGB.length; i++) {
        newRGB.push(Math.max(0, Math.min(255, baseRGB[i] + randInt(-10, 10))))
    }
    return newRGB;
}

function addSite(siteInfo, company) {
    pastTrackers[company].push(siteInfo);

    var companyColors = {
        "google": [15, 157, 88],
        "facebook": [59, 89, 152],
        "linkedin": [0, 119, 181],
        "twitter": [29, 161, 242],
        "reddit": [255, 67, 1]
    }

    var x = randInt(20, document.documentElement.clientWidth - pixSize);
    var y = randInt(20, document.documentElement.clientHeight - pixSize);

    var pixelColor = randomPixel(companyColors[company])
    var color = "rgb(" + pixelColor[0] + "," + pixelColor[1] + "," + pixelColor[2] + ")"

    displayedPixels[company].push([x, y, color])
}

async function storeTrackingScripts() {
    var siteInfo = {
        "url": window.location.href,
        "title": document.title
    }

    var site = document.querySelector("meta[property='og:site_name']")
    if (site != null) {
        siteInfo["site"] = site.getAttribute('content');
    }

    var image = document.querySelector("meta[property='og:image']")
    if (image != null) {
        siteInfo["image"] = image.getAttribute('content');
    }

    var description = document.querySelector("meta[property='og:description']")
    if (description != null) {
        siteInfo["description"] = description.getAttribute('content').trim();
    }

    for (const company of getTrackingScripts()) {
        addSite(siteInfo, company);
    }


    chrome.storage.local.set({
        pastTrackers,
        displayedPixels
    });
    displayPixels(displayedPixels, pastTrackers);
    injectAds();
}

// display pixels and make them expandable
function displayPixels(pixels, trackers) {
    var overlay = "<div id=\"pixelOverlay\" style=\"position: fixed; width: 100%; height: 100%; background-color: rgba(0,0,0,0.0); pointer-events: none; z-index: 3\"></div>"

    var body = document.getElementsByTagName('body')[0];
    var originalContent = "<div style=\"pointer-events: auto\">" + body.innerHTML + "</div>"

    body.innerHTML = overlay + body.innerHTML;

    var pixelOverlay = document.getElementById("pixelOverlay")

    for (const [company, companyPixels] of Object.entries(pixels)) {
        for (var i = 0; i < companyPixels.length; i++) {

            var x = companyPixels[i][0]
            var y = companyPixels[i][1]
            var color = companyPixels[i][2]

            var pixel = document.createElement("div");
            pixel.id = company + i
            pixel.classList.add("pixel")
            pixel.style.left = x + "px";
            pixel.style.top = y + "px";
            pixel.style.height = pixSize + "px";
            pixel.style.width = pixSize + "px";
            pixel.style.backgroundColor = color;
            pixel.setAttribute("url", trackers[company][i].url)
            pixel.onclick = function () {
                window.open(this.getAttribute("url"), '_blank');
            }

            pixelOverlay.appendChild(pixel)
        }
    }
}

function truncateURL(url) {
    if (url.length > 55) {
        return url.substring(0, 55) + "..."
    }

    return url
}

function turnToUsername(siteName) {
    return siteName.toLowerCase().replace(/\W/g, '')
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function injectAds() {
    // create pixel falling animation
    // detect if site is reddit, google, facebook, insta
    await sleep(5000)
    if (window.location.href.includes("www.google.com/search?q=")) {
        var firstResult = document.getElementsByClassName("g")[0]

        for (var i = 0; i < displayedPixels["google"].length; i++) {
            $("#google" + i).fadeOut(2000, function() {

                var siteInfo = pastTrackers["google"][i]

                var newResult = firstResult.cloneNode(true)
                firstResult.parentNode.insertBefore(newResult, firstResult.nextSibling)

                newResult.getElementsByClassName("TbwUpd NJjxre")[0].innerText = truncateURL(siteInfo.url)
                newResult.getElementsByClassName("yuRUbf")[0].children[0].href = siteInfo.url

                newResult.getElementsByClassName("LC20lb DKV0Md")[0].innerText = "You may like: " + siteInfo.title
                
                if (siteInfo.description != undefined) {
                    newResult.getElementsByClassName("IsZvec")[0].innerText = siteInfo.description    
                } else {
                    newResult.getElementsByClassName("IsZvec")[0].innerText = ""
                }
                
            })
            await sleep(2100)

        }
    } else if (window.location.href === "https://www.instagram.com/") {
        var firstPost = document.getElementsByClassName("_8Rm4L")[0]

        for (var i = 0; i < displayedPixels["facebook"].length; i++) {
            $("#facebook" + i).fadeOut(2000, function() {
                var siteInfo = pastTrackers["facebook"][i]

                if (siteInfo.image == undefined) {
                    return;
                }

                

                var newPost = firstPost.cloneNode(true)
                firstPost.parentNode.insertBefore(newPost, firstPost.nextSibling)

                newPost.getElementsByClassName("sqdOP yWX7d")[0].innerText = turnToUsername(siteInfo.site)
                newPost.getElementsByClassName("sqdOP yWX7d")[0].href = siteInfo.url;

                var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url=" + siteInfo.url;
                newPost.getElementsByClassName("_2dbep")[0].innerHTML = "<img src=" + favicon + " style=\"height:100%; width:100%; horizontal-align: center; vertical-align: center\"/>"

                newPost.getElementsByClassName("kPFhm")[0].innerHTML = "<img src=" + siteInfo["image"] + " style=\"height:100%; width:100%; horizontal-align: center; vertical-align: center\"/>"
                
                if (siteInfo.description != undefined) {
                    newPost.getElementsByClassName("EtaWk")[0].innerText = "ICYMI: " + siteInfo.description    
                } else {
                    newPost.getElementsByClassName("EtaWk")[0].innerText = ""
                }
                
            })
            await sleep(2100)
        }

    }
}