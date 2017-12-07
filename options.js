// Saves options to chrome.storage
function save_options() {
	var affiliate = document.getElementById('affiliate').value;
	var smile = document.getElementById('smile').checked;
	console.log('affiliate = ' + affiliate)
	chrome.storage.sync.set({
		"affiliate": affiliate,
		"smile": smile
	});
}

// Restores text box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		affiliate: '',
		smile: true
	}, function(items) {
		document.getElementById('affiliate').value = items.affiliate;
		document.getElementById('smile').checked = items.smile;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
$('.updateonchange').change(save_options);