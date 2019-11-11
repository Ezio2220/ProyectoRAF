
  const clave = window.localStorage;
  //"D:/works/0/2019/TSI/ProyectoRAF/";
  const base ="C:/Users/Alejandro/Documents/GitHub/ProyectoRAF/";//"https://ezio2220.github.io/ProyectoRAF/";
function logearse(){
    var user = document.getElementById("nombre").value;
    var pass = document.getElementById("pass").value;
    var obj = new Object();
        var cmp = 0;
        var db = firebase.database().ref("Usuarios"); 
        db.once("value",function(snap){ 
          var aux = snap.val(); 
          for(var documento in aux){  
            if(aux[documento].Nombre == user && aux[documento].pass == pass ){
                obj=aux[documento];
                clave.setItem('active',documento);
                obj["Estado"]=1;
                cmp=1;
            }
          }
          if(cmp==0){
            console.log("usuario y/o contraseña incorrecto");
            alert("usuario y/o contraseña incorrecto");
          }else{
              console.log(obj);
            db.child(clave.getItem('active')).set(obj);
               console.log("exito");
        console.log(clave.getItem('active'));
            
            //alert("DATOS CORRECTOS ACCEDIENDO...");
            setTimeout(function(){window.location.href = base+'index.html';},1000);
          }       
        });
}
function comprobar(){
    if(clave.getItem('active')==null){
        console.log("puede logearse");
        document.getElementById("todo").hidden=false;
       // alert("primero debe acceder!");
        
    }else{
        console.log("YA esta logueado el usuario:");
        console.log(clave.getItem('active'));
        setTimeout(function(){window.location.href = base+'index.html';},1000);
    }
}
