ad_services = [
	"www.googleadservices.com/pagead/conversion_async.js",
	"//connect.facebook.net/en_US/fbevents.js",
	"https://ct.pinterest.com/v3/?tid=2612729865245&ed%5Bpage_category%5D=ProductPage&pd%5Bem%5D=314e307f8e15083b3301a74efaecda253d188121985933938657963d1ae07909&noscript=1&event=PageVisit&ed%5Bvalue%5D=207.99&ed%5Bcurrency%5D=USD&ed%5Border_quantity%5D=1&ed%5Bline_items%5D%5B0%5D%5Bproduct_name%5D=W004350489&ed%5Bline_items%5D%5B0%5D%5Bproduct_id%5D=W004350489&ed%5Bline_items%5D%5B0%5D%5Bproduct_quantity%5D=1&ed%5Bline_items%5D%5B0%5D%5Bproduct_price%5D=207.99",
	"https://dc.ads.linkedin.com/collect/?pid=970530&fmt=gif",
	"https://ssl.google-analytics.com/ga.js",
	"https://www.googletagmanager.com/gtm.js?id=GTM-KGH7R8V"
]
var gettingStoredStats = browser.storage.local.get();

function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
  }, onError);
}

var scripts = document.getElementsByTagName('script');
for (var i = 0; i < scripts.length; i++) { 
	console.log(scripts[i].src) 
}