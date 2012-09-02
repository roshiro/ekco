#!/usr/bin/python
# -*- coding: latin-1 -*-

''' PROD or DEV '''
env = 'DEV'

if env == 'PROD':
	FACEBOOK = {
		'appId': '455216557835008',
		'appSecret': '1b3dbb5dd31891bf7aa248af6467643d',
		'redirectUrl': 'http%3A%2F%2Fek-foto.co%2Ffacebookauth'
	}
else:
	FACEBOOK = {
		"appId": "336508579772485",
		"appSecret": "21d07c5cc057490fdc3041fb6f22a2da",
		"redirectUrl": "http%3A%2F%2Fekfotolocal.com%3A8085%2Ffacebookauth"
	}

PUBNUB = {
	"publishKey": "",
	"subscribeKey": "",
	"pubNubSecret": ""
}

SENDGRID = {
	"username": "rafael.oshiro@gmail.com",
	"password": "81282180"
}