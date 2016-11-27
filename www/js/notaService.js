(function(){
  var module = angular.module('NotaServiceModule', [])
  
  module.factory('NotaService', function($http){
    var notas = angular.fromJson(window.localStorage['notas'] || '[]');
    function persistir(){
    	window.localStorage['notas'] = angular.toJson(notas);
    }
    return {
      list:function(){        
        var resultado;
        $http.get('http://localhost:3000/etiquetas').then(function(response){
        console.log(response.data);        
        console.log(notas);
        for (var i = response.data.length - 1; i >= 0; i--) {
          var nota = {};
          nota.id=response.data[i].id_etiqueta;
          nota.titulo=response.data[i].nombre;
          nota.descripcion=response.data[i].nombre;
          console.log(nota);
          if(notas.length<2){
            notas.push(nota);
          }          
        }
      });
        console.log('resultado. ');
        console.log(resultado);
        return notas;
      },
      get:function(id){
        return angular.copy(notas.filter(function(nota){return nota.id == id;})[0]);
      },
      save:function(nota){
        $http.post('http://localhost:3000/etiquetas',{id:nota.id,nombre:nota.titulo}).then(function(response){
          console.log(response);
          notas.push(nota);
          persistir();
        });
        
      },
      update:function(nota){
        $http.put('http://localhost:3000/etiquetas',{id:nota.id,nombre:nota.titulo}).then(function(response){
          console.log(response);
          for (var i = notas.length - 1; i >= 0; i--) {
          if(notas[i].id == nota.id){
            notas[i] = nota;
            persistir();
            return;
          }        
        }
        }, 
        function(response){
          console.log(response);
        });        
      },
      delete:function(id){
        $http.delete('http://localhost:3000/etiquetas/'+id).then(function(response){
          console.log(response);
          for (var i = notas.length - 1; i >= 0; i--) {
            if(notas[i].id == id){
              notas.splice(i,1);
              persistir();
              return;
            }        
          }
        }, 
        function(response){
          console.log(response);
        });
        
      }
    }
  });
}());