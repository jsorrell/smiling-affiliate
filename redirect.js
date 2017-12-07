affiliate = ''
useSmile = true

/* Load Options */
function loadOptions() {
	chrome.storage.sync.get({
		affiliate: '',
		smile: true
	}, function(items) {
		affiliate = items.affiliate;
		useSmile = items.smile;
	});
}

loadOptions()

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (namespace != 'sync') {
		return;
	} else {
		if ('affiliate' in changes) {
			affiliate = changes.affiliate.newValue
		}

		if ('smile' in changes) {
			useSmile = changes.smile.newValue
		}
	}
});

/* Register Listener */
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return redirectIfNeeded(details);
}, {
    'urls' : ["<all_urls>"],
    'types': ["main_frame","sub_frame"]
}, ["blocking"]);

function redirectIfNeeded(details) {
	console.log(details)
	console.log(details.url)
	urlMatch = /https:\/\/(www|smile)\.amazon\.(com|ca|co\.uk|at|de|es|fr|it|co\.jp|cn|in])([^?]*)(\??(?:(?:[$\-_.+!*'(),a-zA-Z\d]+\=[$\-_.+!*'(),a-zA-Z\d]+)(?:\&[$\-_.+!*'(),a-zA-Z\d]+\=[$\-_.+!*'(),a-zA-Z\d]+)*)?)$/.exec(details.url)

	if (urlMatch != null) {
		console.log(urlMatch)
		hasParams = urlMatch[4] != null
		parameters = hasParams ? urlMatch[4] : ""
		console.log(hasParams)
		newUrl = (useSmile ? "https://smile.amazon." + urlMatch[2] : "https://" + urlMatch[1] + ".amazon." + urlMatch[2]) + urlMatch[3] + parameters
		// if the tag doesn't exist
		if (!/(?:&|\?)tag=/.test(parameters)) {
			newUrl = newUrl + (hasParams ? "&" : "?") + "tag=" + affiliate
			console.log(newUrl)
			return {redirectUrl : newUrl}
		} else {
			if (newUrl != details.url) {
				// url changed so redirect
				console.log(newUrl)
				return {redirectUrl : newUrl}
			}
			else {
				console.log("path is good")
				return
			}
		}
	}
}

