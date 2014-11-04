app.service('messageService', function($q, $http){
	var messageReceiverId;
	var curMessage;
	this.setReceiverId = function(receiverId){
		messageReceiverId = receiverId;
	};

	this.getReceiverId = function(){
		return messageReceiverId;
	};

	this.setCurMessage = function(message){
		curMessage = message;
	};

	this.getCurMessage = function(){
		return curMessage;
	};

	this.sendMessage = function(id, message){
		var defer = $q.defer();
		$http.post('/message/user/' + id, message).then(function(data){
			var result = data.data;
			defer.resolve(result);
		});
		return defer.promise;
	};

	this.getAllMessages = function(){
		var defer = $q.defer();
		$http.get('/messages').then(function(data){
			var messages = data.data;
			defer.resolve(messages);
		});
		return defer.promise;
	};
});