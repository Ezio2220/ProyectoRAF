//---------------------------------CONFIGURACION DE LA BASE DE DATOS!!!
var firebaseConfig = {
    apiKey: "AIzaSyB5ZH7s2gs3ufxvoc2cIFSjZ06DAkRN09E",
    authDomain: "proyectoraf-2ad20.firebaseapp.com",
    databaseURL: "https://proyectoraf-2ad20.firebaseio.com",
    projectId: "proyectoraf-2ad20",
    storageBucket: "proyectoraf-2ad20.appspot.com",
    messagingSenderId: "58605597964",
    appId: "1:58605597964:web:6f98febe9265a49ac88529"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function logearse(){
    const name =  document.getElementById("nombre").value;
    const pass = document.getElementById("pass").value;

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(name,pass);

    promise.catch(e =>{ console.log(e); if(e==null){alert("SI");}else{alert("Error"+e.message);console.log(e.message);} } );
    
  }

  function salir(){
      firebase.auth().signOut();
      
  }



function registrar(){
    const name =  document.getElementById("nombre").value;
    const pass = document.getElementById("pass").value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(name,pass);
    promise.catch(e =>{ console.log(e); if(e==null){
        console.log("SI se creo con exito");
        console.log(firebase.auth().currentUser.Email);
    }else{
        console.log(e.message);
        alert("Error"+e.message);
    } 
    } );
}


function comp(){
firebase.auth().onAuthStateChanged(firebaseuser=>{
    var actual = firebase.auth().currentUser;
    /*if(firebaseuser){
        console.log(firebaseuser);
        alert("USUARIO EN LINEA");
        console.log(firebase.auth().currentUser);

    }else{
        console.log("no logeado");//si no esta logeado firebaseuser es null
        alert("no logeado");
    }
   */ if(actual){
        console.log(actual);
        
        console.log("sige activo el usuario "+actual.email +" jajaj "+actual.displayName);
    }else{
        console.log("se jue");
    }
})
}

function raro(){
    var auth = firebase.auth();
    actual= auth.currentUser;
    if(actual!=null){
        if(actual.email == "lolito@2.com"){
            console.log(actual);
            auth.signOut();
            console.log("aca debe cerrar");
            
            const auth2 = firebase.auth();
            var promise = auth2.signInWithEmailAndPassword("franklin@1.com","Claudita");
            console.log(auth2.currentUser);
            console.log(auth2.currentUser.email);
            setTimeout(function(){auth2.currentUser.updateEmail("frank2@1.com");},3000);
            
            alert(auth2.currentUser.email);
            console.log("Esperando");
           
            auth2.signOut();
            var promise2 = auth.signInWithEmailAndPassword("lolito@2.com","lolis2d");
            console.log(auth2.currentUser);
            console.log(firebase.auth().currentUser.email);
            console.log("ultimo");
            

        }
    }
}