/**
 * Created by DarkoM on 13.12.2016.
 */
app.controller("HeaderController",  [
    "$scope", "DataFactory", "$state", "$rootScope", "$cookies",
    function ($scope, DataFactory, $state, $rootScope, $cookies){
        $scope.searchPhrase = "";
        $scope.search = function (){
            var postsRef = DataFactory.posts();
            postsRef.orderByChild("title").equalTo($scope.searchPhrase).once("value").then(function (snapshot){
                var results = snapshot.val();
                if (results === null)
                    console.log("search results:", "that item is not found.  NOTE: it has to be the same name, this can be optimized with 'contains'");
                else {
                    for(key in results){
                        $state.go("app.learn.generic.topic.post", {postId: key, topicId: results[key].topicId, fieldId: results[key].fieldId});
                    }
                }
            });
        };


        $scope.initLoginForm = function(){
            $scope.loginModel = {};
        };

        $scope.initSignupForm = function () {
            $scope.signupModel = {};
        };

        $scope.login = function(){
            var users = DataFactory.users();
            users.once('value').then(function(snapshot){
                var results = snapshot.val(), success;
                for (key in results){
                    var x = results[key];
                    if (x.email === $scope.loginModel.email && x.password === $scope.loginModel.password){
                        success = angular.extend(x, { id: key });
                        break;
                    }
                }

                if(!!success) {
                    $state.go("app.home");
                    $rootScope.currentUser = success;
                    $cookies.put("currentUser", JSON.stringify(success));
                    //console.log(JSON.parse($cookies.get("currentUser")));
                }
                else
                    alert('error');
            })
        };
        
        $scope.signup = function () {
            DataFactory.users().push($scope.signupModel);
        };
        
        $scope.logout = function () {
            $rootScope.currentUser = null;
            $cookies.remove("currentUser");
            $state.go("app.login");
        };

        // menu
        var loadMenu = function (){
            $scope.fields = [];
            DataFactory.fields().once("value").then(function (snapshot){
                var results = snapshot.val();
                $scope.fields = Object.keys(results).map(function (x){
                    return angular.extend(results[x], { id: x });
                });
                $scope.$apply();
            });
        };
        loadMenu();

        $scope.$on("reloadData", function (){
            loadMenu();
        });

    }
]);