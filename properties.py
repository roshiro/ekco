#!/usr/bin/python
# -*- coding: latin-1 -*-

''' PROD or DEV '''
env = 'DEV'

if env == 'PROD':
	FACEBOOK = {
		'appId': '',
		'appSecret': '',
		'redirectUrl': ''
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