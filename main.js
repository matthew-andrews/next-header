'use strict';

var reqwest = require('reqwest');
var Delegate = require('dom-delegate');
var header = document.querySelector('.o-header');
var defaultPanel = header.getAttribute('data-default-panel');
var delegate = new Delegate(header);
var bodyDelegate = new Delegate();

delegate.on('click', '.o-header-button-js', function(event) {
	event.preventDefault();
	event.stopPropagation();

	// HACK
	var targetPanel = event.target.getAttribute('data-target-panel')
		|| event.target.parentNode.getAttribute('data-target-panel')
		|| defaultPanel;
	var currentPanel = header.getAttribute('data-panel');
	if (currentPanel !== targetPanel && targetPanel !== defaultPanel) {
		bodyDelegate.root(document.body);
		header.setAttribute('data-panel', targetPanel);
	} else {
		bodyDelegate.root();
		if (defaultPanel) {
			header.setAttribute('data-panel', defaultPanel);
		} else {
			header.removeAttribute('data-panel');
		}
	}
});

delegate.on('click', function(event) {
	event.stopPropagation();
});

bodyDelegate.on('click', function(event) {
	event.preventDefault();
	event.stopPropagation();
	if (defaultPanel) {
		header.setAttribute('data-panel', defaultPanel);
	} else {
		header.removeAttribute('data-panel');
	}
});

reqwest('http://next-companies-et-al.herokuapp.com/v1/ubernav.json', function(resp) {
	var data = resp.data;
	header.querySelector('.o-header__secondary--menu-js').innerHTML = '<ul class="uber-index">'
		+ data.map(function(item) {
		return '<li class="uber-index__title" data-o-grid-colspan="6 M6 L3 XL3">'
			+ '<a href="' + item.nextUrl + '">' + item.title + '</a>'
			+ '<ul class="uber-index__children">'
			+ item.navigationItems.map(function(child) {
				return '<li class="uber-index__child"><a href="' + child.nextUrl + '">' + child.title + '</a></li>';
			}).join('')
			+ '</ul>'
			+ '</li>';
		}).join('');
		+ '</ul>';
});

// TODO: Make this with real data
var stuffTypes = {
	favourites: 'Favourites',
	forlaters: 'Saved For Later'
};
var stuff = {
	favourites: [{
		"type": "favourite",
		"resourceType": "stream",
		"created": "1413364682107",
		"uuidv3": "sections:China",
		"displayText": "China",
		"id": "activity:1e7983cd0afa3cbf01e463d2c883f3e1a718cf13"
	}],
	forlaters: [{
		"type": "forlater",
		"resourceType": "article",
		"created": "1413535332073",
		"uuidv3": "71244458-55c9-11e4-a3c9-00144feab7de",
		"displayText": "BoE’s Haldane favours a delay in interest rate rises",
		"id": "activity:fc7c53b8c939e9cb117ad2c90750a9bc3846728a"
	}]
};
header.querySelector('.o-header__secondary--myft-js').innerHTML = '<ul class="uber-index">'
	+ Object.keys(stuff).map(function(key) {
		return '<li class="uber-index__title" data-o-grid-colspan="6 M6 L6 XL6">'
			+ stuffTypes[key]
			+ '<ul class="uber-index__children">'
			+ stuff[key].map(function(child) {
				return '<li class="uber-index__child"><a href="' + child.uuidv3 + '">' + child.displayText + '</a></li>';
			}).join('')
			+ '</ul>'
			+ '</li>';
		}).join('');
		+ '</ul>';
