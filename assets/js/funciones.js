var config = {
    apiKey: "AIzaSyB5ZH7s2gs3ufxvoc2cIFSjZ06DAkRN09E",
    authDomain: "proyectoraf-2ad20.firebaseapp.com",
    databaseURL: "https://proyectoraf-2ad20.firebaseio.com",
    projectId: "proyectoraf-2ad20",
    storageBucket: "proyectoraf-2ad20.appspot.com"
    //messagingSenderId: "709281942479"
  };
  firebase.initializeApp(config);
  var db = firebase.database();

  function agregarusuario(nombre,contraseña){
      var data = firebase.database().ref("Usuarios");
      var obj = new Object;
      obj["nombre"]= nombre;
      obj["contraseña"]= contraseña;
      obj["Estado"]= 0;
      
      rep = nombre;
      data.once("Value",function(snap){
        var aux = snap.val();}
        for(aux == nombre){
          alert("ESE USUARIO YA EXISTE!");
          location.reload(true);
        }
      }

?