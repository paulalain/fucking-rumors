fuckingRumorsApp.controller('AddArtistController', ['$rootScope', '$scope', '$http', 
	function ($rootScope, $scope, $http) {

		$scope.waiting = false;
		$scope.displayError = false;
		$scope.error = "";

		$scope.emptyFields = function(){
			$scope.name = "";
			$scope.img = "";
			$scope.website = "";
			$scope.facebook = false;
			$scope.twitter = false;
			$scope.instagram = false;
			$scope.img = "";

			$scope.displayError = false;
			$scope.error = "";
		};

		$scope.$on("emptyFieldsAddRumor", function (event, args) {
			$scope.emptyFields();
		});

		$scope.validateFields = function(){
			if(!$scope.name){
				$scope.error = "Le nom de l'artiste est obligatoire."
				return false;
			}

			if(!$scope.img){
				$scope.error = "Veuillez uploader une image pour l'artiste."
				return false;
			}

			return true;
		};


		$scope.submit = function(){
			if(!$scope.waiting){
				var validate = $scope.validateFields();
				if(validate){
					$http.post('/artistes/ajouter', { 
														name: $scope.name,
														website : $scope.website,
														facebook: $scope.facebook,
														instagram: $scope.instagram,
														twitter: $scope.twitter,
														img: $scope.img
													})
						.success(function(data) {
							$rootScope.$broadcast('toggleAddArtist');
							$rootScope.$broadcast('refreshArtistsList');
							$scope.waiting = false;
						})
						.error(function(data){
							$scope.error = data.error;
							$scope.displayError = true;
							$scope.waiting = false;
						});
				}else{
					$scope.waiting = false;
					$scope.displayError = true;
				}
			}
		};

		$scope.$on('flow::fileSuccess', function (event, $flow, flowFile) {
			console.log(flowFile);
			console.log($flow);
			$scope.img = flowFile.name;
		});

		   function generateID() {
		    var d = new Date().getTime();
		    var uuid = 'xxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (d + Math.random()*16)%16 | 0;
		        d = Math.floor(d/16);
		        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		    });
		    return uuid;
		};

		$scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
			console.log(flowFile);
			console.log($flow);
			flowFile.name = generateID() + flowFile.name;
		});
	}]);