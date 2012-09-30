/* Namespaces definition */
var myapp = {};
var user;
var activePortfolio;
/* 
 * Closure for cycleapp.
 */
(function () {
	myapp.utils = {};
	myapp.widget = {};
	myapp.init = {};	
	myapp.handler = {};

var __s = myapp,
	__utils = myapp.utils,
	__Init = myapp.init,
	__Services = myapp.services,
	__Pusher,
	_faceUserId,
	_loggedInUser;

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
		
		adjustHeight: function(){
			var browserHeight = parseInt($(window).height()),
				currentBodyHeight = parseInt($('body').css('height'));

			console.debug('Browser: ' + browserHeight + ' Current Height: ' + currentBodyHeight);

			if(currentBodyHeight < browserHeight) {
				$('body').css('height', browserHeight + 'px');	
				$('#content').css('height', (browserHeight-80)+'px');
			}
		},
		
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

(function() {
	
	__Services = myapp.services = {
		loadUser: function() {
			$.get('/getuser', function(data) {
				if(data.status == "success" && data.user) {
					_loggedInUser = data.user;
					window.user = _loggedInUser;
				}
			});
		}
	}
	
})();

(function() {
	
	var _createPreview = function(filename) {
		var timestamp = new Date().getTime(),
			elem = "<div class='img-preview-wrapper row span6 img-wrapper-id-"+timestamp + " "+ filename +"'>"+
						"<div class='span1'><img id="+timestamp+" class='img-preview' src='' /></div>"+
						"<div class='span3'>"+
							"<i class='icon-file'></i> "+filename+
							"<div class='progress progress-striped active'>"+
								"<div class='bar' style='width: 0%;'></div>"+
							"</div>"+
						"</div>"+
						"<div class='label_status'></div>"+
						"<div class='span1'><button imgid='"+timestamp+"' filename='"+filename+"' class='btn btn-link btn-delete'><i class='icon-trash'></i></button></div>"
					"</div>";

		return {
			id: timestamp,
			elem: elem
		}
	};
	
	myapp.handler = {
		loadFile: function() {
			var input = $('#input-files-field')[0],
				reader = new FileReader(),
				file,
				filename,
				size,
				type;
				
			if (input.files && input.files[0]) {
				for(var i=0; i<input.files.length; i++) {
					reader = new FileReader(),
					file = input.files[i],
					filename = file.name,
					size = file.size,
					type = file.type;

					reader.onload = (function(theFile) {
						return function (e) {
							var obj = _createPreview(theFile.name),
								img;

							$('#img-list').append(obj.elem);

							img = $("#" + obj.id);
							img.attr('src', e.target.result);
							img.attr('type', theFile.type);
							setTimeout(function() {
								if(parseInt(img.css('width')) > 100) {
									img.css('width', '100px');
								} else if(parseInt(img.attr('height')) > 100) {
									img.css('height', '100px');
								}					
							}, 500);

						};
					})(file);
					reader.readAsDataURL(file);
				}
		    }	
		}
	}
	
})();

/* Init pages */
(function () {
	var _initAll = function() {
	},
	
	_handleClasses = function(isHome) {
		if(isHome) 
			$('body').addClass('home').removeClass('app');
		else
			$('body').addClass('app').removeClass('home');
	},
	
	_dataURItoBlob = function(dataURI, type) {
	    var binary = atob(dataURI.split(',')[1]);
	    var array = [];
	    for(var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	    }
	    return new Blob([new Uint8Array(array)], {type: type});
	}
	
	_uploadFiles = function(imgId, files, portfolioId, url, type) {
		var file = _dataURItoBlob(files[0], type),
	    	xhr = new XMLHttpRequest(),
			formData = new FormData();
	    //xhr.file = file; // not necessary if you create scopes like this
		formData.append('file', file);
		formData.append('portfolio_id', portfolioId);
		
	    xhr.addEventListener('progress', (function(imgId) {
			return function(e) {
		        var done = e.position || e.loaded, total = e.totalSize || e.total,
					percentage = (Math.floor(done/total*1000)/10);
				
				$('.img-wrapper-id-'+imgId+' .bar').css('width', percentage+'%');
		        console.log('xhr progress: ' + percentage + '%');
		    }})(imgId)
		, false);
	
	    if ( xhr.upload ) {
	        xhr.upload.onprogress = (function(imgId) {
				return function(e) {
		            var done = e.position || e.loaded, 
						total = e.totalSize || e.total,
						percentage = (Math.floor(done/total*1000)/10);
						
					$('.img-wrapper-id-'+imgId+' .bar').css('width', percentage+'%');
		            console.log(imgId + ' xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
		    	};
			})(imgId);
	    }
	    xhr.onreadystatechange = (function(imgId) {
			return function(e) {
				if ( 4 == this.readyState ) {
					var obj = JSON.parse(xhr.responseText);
					setTimeout(function() {
						$('.img-wrapper-id-'+imgId+' .progress').removeClass('progress-striped active');
						$('.img-wrapper-id-'+imgId+' .img-preview').addClass('completed');
						$('.img-wrapper-id-'+imgId+' .label_status').html('Completo');
					}, 1000);
				}
		    };
		})(imgId);
		
		$('button[imgid='+imgId+']').remove();
	    xhr.open('post', url, true);
		xhr.send(formData);
	},
	
	_getUploadURL = function(username) {
		var result;
		$.ajax({
			url: '/getuploadurl/'+username,
			type: 'GET',
			dataType: 'json',
			async: false,
			success: function(data) {
				result = data.url;
			}
		});
		return result;
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
			$('.controls-header').css('display','none');
		},
		
		signupConfirmartion: function() {
			_initAll();
			_handleClasses(false);
			$('.btn-confirm-signup').click(function() {
				window.location.href="/photos/rafael";
			});
		},
		
		portfolio: function() {
			_handleClasses(false);
			
			$($('#portfolio-carousel .carousel-inner .item')[0]).addClass('active');
			$('.btn-back').click(function() {
				var username = $(this).attr('username');
				document.location.href="/photos/"+username;
			});
		},
		
		about: function() {
			_handleClasses(false);
		},
		
		contact: function() {
			_handleClasses(false);
		},
		
		portfolioedit: function(portfolio_id) {
			_handleClasses(false);
			
			// Retrieve HTML for add photos
			$.ajax({
				url: '/partial/addphotos', 
				type:'GET',
				async: false,
				success: function(content) {
					$('#partial-add-photos').html(content);
				}
			});
			
			// Get Portfolio JSON
			$.get('/portfolio/get/json/' + portfolio_id, function(data) {
				if(data.status == 'success') {
					window.activePortfolio = JSON.parse(data.portfolio)[0];
				}
			}, "json");
			
			$('.btn-add-photos').click(function() {
				$('#img-list').empty();
				$('#portfolioModal').modal();
				$('#portfolio-name-label').html(window.activePortfolio.name);
			})
			
			$('.btn-back').click(function() {
				var username = $(this).attr('username');
				document.location.href="/photos/"+username;
			});
			$('.btn-delete').click(function() {
				var photo = $(this).attr('photoid'),
					portfolioId = $(this).attr('portfolioid');
				$.post('/photos/delete/'+portfolioId+'/'+photo, function(data) {
					if(data && data.status == 'success') {
						$("li[photo='"+photo+"']").fadeOut();
					} else {
						alert('Erro ao tentar excluir foto');
					}
				});
			});			
			$.get('/partial/addphotos', function(content) {
				$('#partial-add-photos').html(content);
				$('#portfolioModal').on('hidden', function() {
					document.location.reload(true);
				});					
			});	
		},

		profilePage: function() {
			_initAll();
			_handleClasses(false);
			
			$.ajax({
				url: '/partial/addphotos', 
				type:'GET',
				async: false,
				success: function(content) {
					$('#partial-add-photos').html(content);
				}
			});
			
			$('#btn-new-portfolio').click(function(event) {
				event.stopPropagation();
				activePortfolio = undefined;
				$('#input-portfolio-name').attr('value', "");
				$("#portfolioName").modal();
			});
			
			$('.portfolio-wrapper').delegate("button", "click", function() {
				var isSee = $(this).hasClass('btn-see'),
					isDelete = $(this).hasClass('btn-delete'),
					isEdit = $(this).hasClass('btn-edit'),
					portfolioId = $(this).attr('portfolioid');
					
				if(isSee) {
					document.location.href="/portfolio/" + portfolioId;
				} else if(isDelete) {
					$.post('/portfolio/delete/'+portfolioId, function(data) {
						if(data && data.status == 'success') {
							$('div[portfolioid='+portfolioId+']').fadeOut('slow', function() {
								$(this).remove();
							});
						}
					});
				} else if(isEdit) {
					document.location.href="/portfolio/edit/" + portfolioId;
				}
			});
			
			$('#portfolioModal').on('hidden', function() {
				var content;
				$.ajax({
					url: '/partial/portfolio/' + activePortfolio.id,
					type: 'GET',
					async: false,
					dataType: 'text',
					success: function(html) {
						content = html;
						$('.portfolio-wrapper').append(content);
					}
				});
			});
			
			$('.btn-contact-me').click(function(event) {
				event.stopPropagation();
				$("#contactModal").modal();
				$('#contactModal .name').html(_loggedInUser.name);
				$('#contactModal .email').html(_loggedInUser.email);
				$('#contactModal .address').html(_loggedInUser.address);
				$('#contactModal .phone').html(_loggedInUser.phone);
			});
		},
		
		searchPage: function() {
			_initAll();
			_handleClasses(false);
		}
	}
})();

(function() {

	//_faceUserId = FB.getUserID();
	__Services.loadUser();

	$('body').delegate(".close-modal", "click", function() {
		$('.modal').modal('hide');
	});

	$('#edit-profile-link').click(function(event) {
		event.stopPropagation();
		$("#edit-profile").modal();
		$('#inputName').attr('value', _loggedInUser.name);
		$('#inputAbout').attr('value', _loggedInUser.about);
		$('#inputPhone').attr('value', _loggedInUser.phone);
		$('#inputAddress').attr('value', _loggedInUser.address);
		$('#inputWebsite').attr('value', _loggedInUser.website);
	});

	$.get('/partial/editprofile', function(content) {
		$('#partial-edit-profile').html(content);
		
		setTimeout(function() {
			$('#input-files-field').change(function() {
				myapp.handler.loadFile();
			});
			
			$('#btn-save-porfolioname').click(function() {
				var name = $('#input-portfolio-name').attr('value');
				$.post('/portfolio/new', {'name': name}, function(data) {
					if(data.status == "success") {
						activePortfolio = JSON.parse(data.portfolio)[0];
						$('.modal').modal('hide');
						$('#img-list').empty();
						$('#portfolioModal').modal();
						$('#portfolio-name-label').html(activePortfolio.name);
					} else {
						alert('Erro, por favor tente novamente.');
					}
				});
			});
			
			$('#img-list').delegate("button", "click", function() {
				if($(this).hasClass('btn-delete')) {
					var imgId = $(this).attr('imgid'),
						filename = $(this).attr('filename'),
						files = $('#input-files-field')[0].files;

					$('.img-wrapper-id-'+imgId).remove();
					for(var i=0; i<files.length; i++) {
						if(files[i].name == filename) {

						}
					}
				}
			});

			$('.btn-upload').click(function() {
				var imgElem = $('#img-list .img-preview:not(.completed)');

				for(var i=0; i<imgElem.length; i++) {
					var	actionUrl = _getUploadURL(user.username),
						files = [imgElem[i].src],
						imgId = $(imgElem[i]).attr('id'),
						mimetype = $(imgElem[i]).attr('type');

					if(files && files.length > 0) {
						_uploadFiles(imgId, files, activePortfolio.id, actionUrl, mimetype);	
					} else {
						alert('Selecione alguma foto para upload');
					}					
				}					
			});
			
		}, 2000);
		
		$('#save-profile').click(function() {
			var name = $('#inputName').attr('value'),
				about = $('#inputAbout').attr('value'),
				phone = $('#inputPhone').attr('value'),
				address = $('#inputAddress').attr('value'),
				website = $('#inputWebsite').attr('value');

			if(!name || name == "" || !about || about == "") {
				$('.alert-error').css('display', 'block');
			} else {
				_loggedInUser.name = name;
				_loggedInUser.about = about;
				_loggedInUser.phone = phone;
				_loggedInUser.address = address;
				_loggedInUser.website = website;

				$.post('/user/update', {'user': JSON.stringify(_loggedInUser)}, function(data) {
					$('.modal').modal('hide');						
					user = _loggedInUser = data.user;
					$('#user-name').html(user.name);
					$('#user-about').html(user.about);
					if(user.website) {
						var elems = "<a id='user-website' href='"+user.webite+"' target='_blank'>"+user.website+"</a>";
						$('.website').empty().append(elems);
					} else {
						$('#user-website').remove();
					}
				});
			}         
		});		
	});


	//__utils.adjustHeight();

	//$.Topic('window-resized').subscribe(__utils.adjustHeight);

	/*$(window).resize(function() {
		setTimeout(function(){
			$.Topic('window-resized').publish();
		}, 500);
	});*/


})();

}());
