(function(){
  var PUSHBOTS_APPLICATION_ID = '583b3ea04a9efaaba68b4567';
  var GOOGLE_SENDER_ID = '916147483913';

  var app = angular.module('starter', ['ionic','NotaServiceModule'])
    
  app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider.state('notaLista',{url:'/nota/lista',templateUrl:'vistas/nota/lista.html'});
    $stateProvider.state('notaFormEdicion',{url:'/nota/form/edicion/:id',templateUrl:'vistas/nota/form.html',controller:'NotaFormEdicionController'});
    $stateProvider.state('notaFormNuevo',{url:'/nota/form/nuevo',templateUrl:'vistas/nota/form.html',controller:'NotaFormNuevoController'});
    $urlRouterProvider.otherwise('/nota/lista');

  });
  app.controller('NotaListaController',function($scope,$state,NotaService,$ionicPopup,$timeout){
    $scope.notas = NotaService.list();
    $scope.eliminar = function (id,titulo) {
      var confirmPopup = $ionicPopup.confirm({
        title:'Eliminar Nota',
        template:'¿Confirma Eliminar: '+titulo+'?'
      });
      confirmPopup.then(function(res){
        if(res){
          NotaService.delete(id);
          $state.go('notaLista');    
        }
      });
      
    };    
  });
  app.controller('NotaFormEdicionController',function($scope,$state,NotaService){
    $scope.id = $state.params.id;
    $scope.nota = NotaService.get($scope.id);
    $scope.guardar = function(){
      NotaService.update($scope.nota);
      $state.go('notaLista');
    };    
  });
  app.controller('NotaFormNuevoController',function($scope,$state,NotaService){
    $scope.id = $state.params.id;
    $scope.nota = {id:(new Date()).getTime().toString()};
    $scope.guardar = function(){
      NotaService.save($scope.nota);
      $state.go('notaLista');
    }
  });

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
   
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        cordova.plugins.Keyboard.disableScroll(true);

        window.plugins.PushbotsPlugin.initialize(PUSHBOTS_APPLICATION_ID, {"android":{"sender_id":GOOGLE_SENDER_ID}});
        // Should be called once app receive the notification only while the application is open or in background
window.plugins.PushbotsPlugin.on("notification:received", function(data){
  console.log("received:" + JSON.stringify(data));
  
  //Silent notifications Only [iOS only]
  //Send CompletionHandler signal with PushBots notification Id
  window.plugins.PushbotsPlugin.done(data.pb_n_id);
});

// Should be called once the notification is clicked
window.plugins.PushbotsPlugin.on("notification:clicked", function(data){
  console.log("clicked:" + JSON.stringify(data));
});
// Should be called once the device is registered successfully with Apple or Google servers
window.plugins.PushbotsPlugin.on("registered", function(token){
  console.log(token);
});

//Get device token
window.plugins.PushbotsPlugin.getRegistrationId(function(token){
    console.log("Registration Id:" + token);
});
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
})}());
