/* Namespaces definition */
var myapp = {};

/* 
 * Closure for cycleapp.
 */
(function () {
	myapp.utils = {};
	myapp.widget = {};
	myapp.init = {};	

var __s = myapp,
	__utils = myapp.utils,
	__Init = myapp.init,
	__Pusher;

/* Topic */
(function() {
	var topics = {};

	$.Topic = function( id ) {
	    var callbacks,
	        method,
	        topic = id && topics[ id ];
	    if ( !topic ) {
	        callbacks = $.Callbacks();
	        topic = {
	            publish: callbacks.fire,
	            subscribe: callbacks.add,
	            unsubscribe: callbacks.remove
	        };
	        if ( id ) {
	            topics[ id ] = topic;
	        }
	    }
	    return topic;
	};	
})();

/* Utils namespace closure */
(function () {
	String.prototype.startsWith = function(prefix) {
	    return this.indexOf(prefix) === 0;
	}

	String.prototype.endsWith = function(suffix) {
	    return this.match(suffix+"$") == suffix;
	};
	
	var loadTemplate = function(templateName, callback, async) {
        // This loads template
		var result;
		if(async == undefined)
			async = true;
        //$.get('/templates/' + templateName, callback);
		$.ajax({
			url: '/templates/' + templateName, 
			success: function(data) {
				if(async == true && callback)
					callback(data);
				result = data;
			},
			dataType: 'html',
			async: async
		});
		return result;
    },

	_getUrlParameter = function(name) {
		return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
	},
	
	_clearFormElements = function(formId) {
	    $('#'+formId).find(':input').each(function() {
	        switch(this.type) {
	            case 'password':
	            case 'select-multiple':
	            case 'select-one':
	            case 'text':
	            case 'textarea':
	                $(this).val('');
	                break;
	            case 'checkbox':
	            case 'radio':
	                this.checked = false;
	        }
	    });

	};
	
	__utils = myapp.utils = {
		
		getUrlParameter: _getUrlParameter,
		
		getCategoryFromUrl: function() {
			var categories,
				match = document.location.pathname.toString().match('categoria/[/a-z]+').toString();
				
			if(match) {
				categories = match.split('/');
				if(categories && categories.length == 2) {
					return categories[1];
				}
			}
		},
		
		// Treat hash url. Replaces #! by ?_escaped_fragment_= in order to AJAX url's to be indexed by SE
		checkHash: function(callback) {
			if(document.location.hash != '' && currentHash !== document.location.hash) {
				currentHash = document.location.hash;
				// Replace #! by ?_escaped_fragment_=
				currentHash = currentHash.replace('\#\!', '\?\_escaped\_fragment\_\=');
				if(callback) {
					callback(currentHash);
				}
			}
		},
			
		roundNumber: function (rnum, rlength) {
			var newnumber = Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
			return parseFloat(newnumber);
		},
		
	    renderTemplate: function(templateName, data, callback, opt1, async) {
			if(async === false) {
				var result, html;
		 		html = loadTemplate(templateName, null, false);
	            result = Mustache.to_html(html, data);
				return result;
			} else {
				loadTemplate(templateName, function (template) {
		            callback(Mustache.to_html(template, data), opt1);
		        }, async);
			}
	    },
		
		getConfirmDialogHTML: function(header, message, storyId) {
			var html = __utils.renderTemplate("confirm.html", {'header': header, 'message': message, 'storyId': storyId}, null, null, false);
			return html;
		},
		
		openModal: function(html, callback) {
			// Append html to DOM
			$('#modal_placeholder').html(html)
			$("#modal_placeholder").modal({
				overlayClose:true,
				autoResize: true,
				closeHTML: 'fechar',
				onClose: function() {
					$.modal.close();
					document.location = '#';
				}
			});
			$('#simplemodal-container').addClass('round shadow');
			$('#simplemodal-container .close').click(function() {
				$.modal.close();
			});	
			if(callback)
				callback();
		},
		
		closeModal: function() {
			$.modal.close();
		},
		
		validateEmail: function(email) { 
		    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\.+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    return re.test(email);
		},
		
		validateUrl: function(url){
			var re = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
			return re.test(url);
		},
		
		isLoggedIn: function() {
			return _isLoggedIn;
		},
		
		clearForm: _clearFormElements
	};
})();

/* Pusher */
(function () {
	/* Channels (story_change_<storyid>, new_user_story) */
	__Pusher = function() {
		var _listen = function(channel, onReceiveCallback) {
			// LISTEN FOR MESSAGES
		    PUBNUB.subscribe({
		        channel    : channel,      // CONNECT TO THIS CHANNEL.
		        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED OR WHEN PAGE CHANGES.
		        callback   : function(message) { // RECEIVED A MESSAGE.
		            onReceiveCallback(message);
		        },

		        disconnect : function() {        // LOST CONNECTION.   
		        },

		        reconnect  : function() {        // CONNECTION RESTORED.
		        },

		        connect    : function() {        // CONNECTION ESTABLISHED.
		        }
		    });				
		},
		
		_unsubscribe = function(channel) {
			PUBNUB.unsubscribe({channel: channel});
		};
		
		return {
			listen: _listen,
			unsubscribe: _unsubscribe
		}
	}
})(); 

/* Init pages */
(function () {
	var _initAll = function() {
		$('.close-modal').click(function() {
			$('.modal').modal('hide');
		});
	},
	
	_handleClasses = function(isHome) {
		if(isHome) 
			$('body').addClass('home').removeClass('app');
		else
			$('body').addClass('app').removeClass('home');
	};
	
	myapp.init =  {
		homePage: function() {
			_initAll();
			_handleClasses(true);
			$('.crop-small-main, .crop-2-vertical').hover(
				function() {
					$(this).find('.overlay-black').slideDown("slow");
				},
				function() {
					$('.overlay-black').fadeOut("fast", function() {
						// callback
					});
				}
			);
			$('#btn-search-home').click(function() {
				window.location.href="/search";
			});
			$('.view-gallery-link').click(function() {
				window.location.href="/photos/rafael";
			});
		},
		
		signup1: function() {
			_handleClasses(false);
			$('.photographer-tab').css('display','none');
			$('.feedback').css('display','none');
		},
		
		signupConfirmartion: function() {
			_initAll();
			_handleClasses(false);
			$('.btn-confirm-signup').click(function() {
				window.location.href="/photos/rafael";
			});
		},
		
		profilePage: function() {
			_initAll();
			_handleClasses(false);
		},
		
		searchPage: function() {
			_initAll();
			_handleClasses(false);
		}
	}
})();

(function() {

})();

}());
