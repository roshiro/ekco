/* Namespaces definition */
var tellynn = {};

/* 
 * Closure for cycleapp.
 */
(function () {
	tellynn.utils = {};
	tellynn.loader = {};
	tellynn.widget = {};	
	tellynn.model = {};	
	tellynn.service = {};
	tellynn.service.Pusher = {};
	tellynn.service.Service = {};	
	tellynn.model.Profile = {};
	tellynn.widget.Alert = {};
	tellynn.widget.Profile = {};

var __s = tellynn,
	__utils = tellynn.utils,
	__model = tellynn.model,
	__service = tellynn.service,
	__wid = tellynn.widget,
	__Alert = __wid.Alert,
	__Profile = __wid.Profile,
	__Service = __service.Service,
	__Pusher = __service.Pusher,
	_profile,
	service,
	profileWidget;

// Profile model
(function () {

	__model.Profile = function(params) {
		var name,
			nickname,
			email,
			login_url,
			logout_url,
			// Provider can be: google, facebook
			dataProvider;

		var _set = function(params) {
			if(params) {
				if(params.name)
					name = params.name;
				if(params.nickname)
					nickname = params.nickname;
				if(params.email)
					email = params.email;
				if(params.dataProvider)
					dataProvider = params.dataProvider;
				if(params.login_url)
					login_url = params.login_url;
				if(params.logout_url)
					logout_url = params.logout_url;
			}
		},

		_get = function() {
			var loggedIn = (name ? true : false);
			return {name: name, nickname: nickname, email: email, dataProvider: dataProvider, loggedIn: loggedIn};
		};

		_set(params);

		return {
			set: _set,
			get: _get,
			isLoggedIn: function() {
				return (name !== 'anonymous' && email);
			}
		}
	}

})();

// Profile widget
(function () {

	__Profile = function() {

		var _getProfile = function() {
			$.get('/auth/get_profile', function(json) {
				_profile = json;

				// Publish event 'profile_read'
				$.Topic('profile_read').publish(_profile);
			});

		};

		return {
			// Returns the Profile model if the user is logged in
			getProfile: _getProfile			
		}		
	}

})();

/* Alert widget */
(function () {
	var template = "alert.html";
	
	__wid.Alert = __Alert = {
		/* Shows alert
		 * @params {
		 *    type {String} alert / success / error
		 *	  msg  {String}
		 * }
		 */
		showAlert : function(params) {
			var json = {type: params.type, msg: params.msg},
				elem;
			__utils.renderTemplate(template, json, function(html) {
				elem = $('#alert_placeholder');
				
				$(elem).html(html);
				//$(elem).css('right', (($(window).width() / 2) + 140) + 'px');
				$('#alert_placeholder .alert').addClass(params.type).slideDown(500);

				setTimeout(function() {
					$('#alert_placeholder .alert').slideUp(500, function(){
						//$('#alert_placeholder').empty();	
					});
				}, 4000);
			});			
		}
	};
})();

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
	
	__utils = {
		
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

/* Services */
(function() {
	
	__Service = function() {
	
		var _saveUser = function(user, callback) {
			$.post('/users/new', {'user': JSON.stringify(user)}, function(data) {
				if(data.status === 'success') {
					window.location.href=data.url;
					//__Alert.showAlert({msg: 'Usuário criado com sucesso!', type: 'success'});
				} else {
					__Alert.showAlert({msg: 'Erro ao criar usuário. Tente novamente.', type: 'error'});
				}
			});
		},
		
		_saveStory = function(story, callback) {
			$.post('/stories/new', {'story': JSON.stringify(story)}, function(data) {
				if(data.status === 'success') {
					window.location.href=data.url;
					//__Alert.showAlert({msg: 'História salva com sucesso!', type: 'success'});
				} else {
					__Alert.showAlert({msg: 'Erro ao salvar história. Tente novamente.', type: 'error'});
				}
			});
		},
		
		_saveStoryPart = function(storyPart, callback) {
			$.post('/storypart', {'story_part': JSON.stringify(storyPart)}, function(data) {
				if(data.status === 'success') {
					__Alert.showAlert({msg: 'Continuação salva com sucesso!', type: 'success'});
					if(callback) {
						callback();
					}
				} else {
					__Alert.showAlert({msg: 'Erro ao salvar continuação. Tente novamente.', type: 'error'});
				}
			});	
		},
		
		_savePreferences = function(preferences, callback) {
			$.post('/preferences', {'preferences': JSON.stringify(preferences)}, function(data) {
				if(data.status === 'success') {
					__Alert.showAlert({msg: 'Alterações salvas com sucesso!', type: 'success'});
					if(callback) {
						callback();
					}
				} else {
					__Alert.showAlert({msg: 'Erro ao salvar configuração. Tente novamente.', type: 'error'});
				}
			});		
		},
		
		_deleteStory = function(storyId, callback) {
			$.post('/story/delete', {'story_id': storyId}, function(data) {
				if(data.status === 'success') {
					// Aqui deve fechar o Modal
					__Alert.showAlert({msg: 'História deletada com sucesso!', type: 'success'});
					service.loadUserStories($('#username').val());
					if(callback) {
						callback();
					}
				} else {
					window.parent.SqueezeBox.close();
					__Alert.showAlert({msg: 'Erro ao deletar história. Tente novamente.', type: 'error'});
				}
			});
		},
		
		_loadStories = function(callback) {
			$.get('/stories', {'isJson': "true"}, function(data) {
				if(data.status == 'success') {
					__utils.renderTemplate("stories.html", data, function(html) {
						$('#stories_list_index').empty().append(html);
						// Set the last ID in the lastSequenceLoaded element
						if(data && data.storyParts && data.storyParts.length > 0) {
							$('#lastSequenceLoaded').attr('value', _getHigherId(data.storyParts));
						} else {
							$('#lastSequenceLoaded').attr('value', 0);
						}
					});
				} else {
					__Alert.showAlert({msg: 'Erro ao carregar história. Tente novamente.', type: 'error'});
				}
			}, "json");
		},
		
		_loadStoryParts = function(callback) {
			var storyId = $('#story_id').val();
			$.get('/storypart/get/' + storyId, function(data) {
				if(data.status == 'success') {
					__utils.renderTemplate("storyParts.html", data, function(html) {
						$('#storyparts_list').empty().append(html);
						// Set the last ID in the lastSequenceLoaded element
						if(data && data.storyParts && data.storyParts.length > 0) {
							$('#lastSequenceLoaded').attr('value', _getHigherId(data.storyParts));
						} else {
							$('#lastSequenceLoaded').attr('value', 0);
						}
					});
				} else {
					__Alert.showAlert({msg: 'Erro ao carregar história. Tente novamente.', type: 'error'});
				}
			}, "json");
		},
		
		_loadUserStories = function(username, callback) {
			$.get('/json/user/stories/' + username, function(data) {
				if(!data.stories) {
					data.stories = [];
				}
				if(data.status == 'success' && data.stories) {
					__utils.renderTemplate("userStories.html", data, function(html) {
						$('#user_stories_wrapper').empty().append(html);
						$('.delete-user-story').tooltip().click(function() {
							var storyId = $(this).attr('storyid');
							var htmlConfirm = __utils.getConfirmDialogHTML("Confirmação", "Deseja deletar a história?", storyId);
							$('#confirm_placeholder').html(htmlConfirm).modal();
						});
					});					
				}
			});
		},
		
		_getHigherId = function(storyParts) {
			var lastId = 0;
			for(var i=0; i<storyParts.length; i++) {
				if(parseInt(storyParts[i].id) > lastId) {
					lastId = parseInt(storyParts[i].id);
				}
			}
			
			return lastId;
		},
		
		_storyChanged = function(storyPartId) {
			var storyPart = $('.storyPart_'+storyPartId);
			// If the new story part has not been loaded, show message there's a new story part
			if(storyPart.length == 0) {
				$('#refresh_wrapper').css('display', 'block');
				$('#refresh_wrapper').click(function() {
					_loadStoryParts();
					$(this).css('display', 'none');
				});				
			} 
		},
		
		_login = function(username, password) {
			$.get('/authuser', {username: username, password: password}, function(data) {
				if(data.status == 'success') {
					__Alert.showAlert({msg: 'Usuário e Senha OK', type: 'success'});
					document.location.href = '/user/' + data.user.username;
				} else {
					__Alert.showAlert({msg: 'Usuário e/ou Senha incorretos.', type: 'error'});
				}
			});
		},
		
		_usernameExists = function(username, async, callback) {
			var result;
			$.ajax({
				url: '/json/userexists/'+username, 
				success: function(data) {
					if(callback)
						callback(data.userExist);
					result = data.userExist;
				},
				dataType: 'json',
				async: async
			});
			
			if(!async)
				return result;
		},
		
		_emailExists = function(email, async, callback) {
			var result;
			$.ajax({
				url: '/json/emailexists/'+email, 
				success: function(data) {
					if(callback)
						callback(data.emailExist);
					result = data.emailExist;
				},
				dataType: 'json',
				async: async				
			});
			if(!async)
				return result;
		},
		
		_follow = function(userId) {
			$.post('/follow/'+ userId, function(data) {
				if(data.success == true) {
					var alink = $('a[userid='+userId+']')
						.removeClass('btn-follow')
						.addClass('btn-info')
						.addClass('btn-following');
					alink.find('.text').html('Seguindo');
					alink.find('i').addClass('icon-white');
				}
			});
		},
		
		_unfollow = function(userId) {
			$.post('/unfollow/'+ userId, function(data) {
				if(data.success == true) {
					var alink = $('a[userid='+userId+']')
						.addClass('btn-follow')
						.removeClass('btn-info')
						.removeClass('btn-following')
						.removeClass('btn-danger');
					alink.find('.text').html('Seguir');
					alink.find('i').removeClass('icon-white').addClass('icon-ok-sign');
				}
			});
		},
		
		_loadFollowersList = function(username) {
			$.get('/json/whofollowme/'+username, function(data) {
				__utils.renderTemplate("followersList.html", data, function(html) {
					$('#followers-content').html(html);
					
					// Show ToolTip
					$('.showToolTip').tooltip();
				});
			});
		},
		
		_loadFollowingList = function(username) {
			$.get('/json/whoifollow/'+username, function(data) {
				__utils.renderTemplate("followingList.html", data, function(html) {
					$('#following-content').html(html);
					
					// Show ToolTip
					$('.showToolTip').tooltip();
				});
			});
		},
		
		_searchUser = function(name) {
			$.get('/json/searchuser/'+name, function(data) {
				__utils.renderTemplate("searchUser.html", data, function(html) {
					$('#search-content').html(html);
					
					// Show ToolTip
					$('.showToolTip').tooltip();
				});
			});
		};
		
		return {
			saveUser: _saveUser,
			saveStory: _saveStory,
			saveStoryPart: _saveStoryPart,
			savePreferences: _savePreferences,
			deleteStory: _deleteStory,
			loadStoryParts: _loadStoryParts,
			loadStories: _loadStories,
			storyChanged: _storyChanged,
			loadUserStories: _loadUserStories,
			login: _login,
			usernameExists: _usernameExists,
			emailExists: _emailExists,
			loadFollowersList: _loadFollowersList,
			loadFollowingList: _loadFollowingList,
			follow: _follow,
			unfollow: _unfollow,
			searchUser: _searchUser
		}
		
	}
	
})();

/* Initial Loader */
(function () {
	service = new __Service();

	tellynn.loader = {
		
		initBase : function() {
			$('#search-stories-btn').click(function() {
				var query = $('#search-header').val();
				if(query && query.length > 0) {
					window.location.href = '/search?q=' + query;
				}
			});
			$('#search-header').keypress(function(event) {
				if(event.which == 13) {
					var query = $('#search-header').val();
					if(query && query.length > 0) {
						window.location.href = '/search?q=' + query;
					}
				}
			});
		},
		
		initHome : function() {
			$('#newsletter_form').submit(function(event) {
				event.preventDefault();
				var email = $('#email').val();
				$.post('/newsletter', {'email': JSON.stringify(email)}, function(data) {
					if(data.status == 'success') {
						if(data.response == 'OK') {
							__Alert.showAlert({msg: 'Obrigado, logo você receberá informações sobre o Tellynn.', type: 'success'});
						} else if(data.response == 'INDATABASE') {
							__Alert.showAlert({msg: 'Seu email já está cadastrado.', type: 'warning'});							
						}
					}
				});
			});
			
			// Add form submit event
			$('#create_acc_form').submit(function(event) {
				event.preventDefault();
				var userId = $('#user_id').val() || 0;
				var userUsername = $('#new_user_username').val();
				var userEmail = $('#new_user_email').val();
				var userPassword = $('#new_user_password').val();
				service.saveUser({'id': userId, 'username': userUsername, 'email': userEmail, 'password': userPassword});
			});
			
			$('#login_form').submit(function(event) {
				event.preventDefault();
				var username = $('#login_user_username').val();
				var password = $('#login_user_password').val();
				service.login(username, password);
			});
			
			$('#btn-login-facebook').click(function (){
				$('#serveFacebook').addClass('serveFacebook-fill_active');
				$('#Servefacebook_loader').css('display', '');
			});
			
			// Load stories homepage
			service.loadStories();
			
			// Show ToolTip
			$('.showToolTip').tooltip();
			
	    },
		
		initToolTip : function(){
			$('.showToolTip').tooltip();
		},
		
		initHomeLogged : function() {
			// Show ToolTip
			$('.showToolTip').tooltip();
	    },
	
		initNewStory : function() {
			// Event for New Story button
			$('.button-new-story').click(function() {
				$('#new-story-wrapper').css('display', 'inline-block');
				$(this).css('display', 'none');
			});
			
			$('.cancel-button').click(function() {
				$('#new-story-wrapper').css('display', 'none');
				$('.button-new-story').css('display', 'block');
			});
				
			// Add form submit event
			$('#story_content').keypress(function(event) {
				if(event.which == 13) {
					event.preventDefault();
					var userId = $('#user_id').val() || 0,
						storyContent = $('#story_content').val();
					__utils.clearForm('story_form');
					if(storyContent && storyContent.length > 0) {
						service.saveStory({'user_id': userId, 'content': storyContent});
					}
				}
			});	
			
			// Character counter
			$("#story_content").charCount();
		},
		
		initShowStory : function() {
			var pusher = new __Pusher(),
				storyId = $('#story_id').val();
			
			service.loadStoryParts();
			// Listen to changes
			pusher.listen('story_change_'+storyId, function(message) {
				service.storyChanged(message);
			});
			
			// Add form submit event
			$('#storypart_content').keypress(function(event) {
				if(event.which == 13) {
					event.preventDefault();
					var storyId = $('#story_id').val(),
						content = $('#storypart_content').val();
					__utils.clearForm('storypart_form');
					if(content && content.length > 0) {
						// Stop listening to changes
						pusher.unsubscribe('story_change_'+storyId);
						service.saveStoryPart({'story_id': storyId, 'content': content}, function(data) {
							service.loadStoryParts();
							// Re-start listening to changes
							pusher.listen('story_change_'+storyId, function(message) {
								service.storyChanged(message);
							});
						});
					}
				}
			});	
			
			// Share buttons
			$('#share-btn-open').click(function() {
				if($('#share-btn-open').html() == 'Compartilhar'){
					$('#share-btn-open').html('Não Compartilhar');
					$('#share-icons').removeClass('hidden');
				}else{
					$('#share-btn-open').html('Compartilhar');
					$('#share-icons').addClass('hidden');
				}
			});
			
			// Character counter
			$("#storypart_content").charCount();
			
			// Show ToolTip
			$('.showToolTip').tooltip();
		},
		
		initStoryParts : function() {
			// Show ToolTip
			$('.showToolTip').tooltip();
		},
		
		initShowStories : function() {
		},
		
		initShowUser : function() {
			// Get user's stories
			service.loadUserStories($('#username').val());
			
			// Show ToolTip
			$('.showToolTip').tooltip();
		},
		
		initSearchUser : function() {
			// Add form submit event
			$('#find_friends').keypress(function(event) {
				if(event.which == 13) {
					event.preventDefault();
					var name = $('#find_friends').val();
					__utils.clearForm('search_users_form');
					if(name && name.length > 0) {
						service.searchUser(name);
					}
				}
			});	
			
			$('.ul_users_list').delegate('.btn-follow', 'click', function() {
				service.follow($(this).attr('userid'));
			});
			
			$('.ul_users_list').delegate('.btn-following', 'click', function() {
				service.unfollow($(this).attr('userid'));
			});
			
			$('.ul_users_list').delegate('.btn-following', 'mouseover',function() {
				var alink = $(this);
				alink.find('i').removeClass('icon-ok-sign').addClass('icon-remove-sign');
				alink.find('.text').html('Não seguir');
				alink.removeClass('btn-info').addClass('btn-danger');
			});
			$('.ul_users_list').delegate('.btn-following', 'mouseout',function() {
				var alink = $(this);
				alink.find('i').removeClass('icon-remove-sign').addClass('icon-ok-sign');
				alink.find('.text').html('Seguindo');
				alink.addClass('btn-info').removeClass('btn-danger');
			});
		},
		
		initPreferences : function() {
			// Add form submit event
			$('#user_preferences').submit(function(event) {
				event.preventDefault();
				var name = $('#name').val();
				var location = $('#location').val();
				var website = $('#website').val();
				var about = $('#about').val();
				
				service.savePreferences({'name': name, 'location': location, 'website': website, 'about': about});
			});
			
			// Character counter
			$("#about").charCount({allowed: 180});
		},	
	
		initFacebookForm : function() {
			// Verify if username is already taken
			var username = $('#new_user_username').val(),
				checkUsernameExist = function () {
					var exists = service.usernameExists($('#new_user_username').val(), false);
					if(exists == true) {
						$('#username_group').addClass('error');
						$('#username_group .help-block').css('display', 'block');
					} else {
						$('#username_group').removeClass('error');
						$('#username_group .help-block').css('display', 'none');
					}
					return exists;
				},
				checkEmailExist = function() {
					var email = $('#new_user_email').val(),
						exists = true;
						
					if(email) {
						exists = service.emailExists(email, false);
						if(exists == true) {
							$('#email_group').addClass('error');
							$('#email_group .help-block').css('display', 'block');							
						} else {
							$('#email_group').removeClass('error');
							$('#email_group .help-block').css('display', 'none');
						}
					}
					return exists;
				};
			
			if(username) {
				checkUsernameExist();
			}
			// Check if username is available on blur or on keypress
			$('#new_user_username').blur(function() {
				checkUsernameExist();
			});
			
			$('#new_user_email').blur(function() {
				checkEmailExist();
			});			
			
			$('#facebook_form').submit(function(event) {
				event.preventDefault();
				$('#submit_btn_new_user').addClass('disabled');
				var userId = $('#user_id').val() || 0,
					userFaceID = $('#new_user_faceid').val(),
					userName = $('#new_user_name').val(),
					userUsername = $('#new_user_username').val(),
					userEmail = $('#new_user_email').val(),
					usernameExist = checkUsernameExist(),
					emailExist = checkEmailExist();
				if(!usernameExist && !emailExist) {
					service.saveUser({'id': userId, 'faceid': userFaceID, 'name': userName, 'username': userUsername, 'email': userEmail, 'password': ''});					
				}
			});
		},
		
		initFollowers: function(username) {
			service.loadFollowersList(username);
		},
		
		initFollowing: function(username) {
			service.loadFollowingList(username);
		},
		
		initConfirm: function() {
			$('#confirm').click(function() {
				var StoryId = $('#storyId').val();
				service.deleteStory(StoryId);
			});
		}
	}	

})();

}());
