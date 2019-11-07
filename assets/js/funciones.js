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
//---------------------------------------------funcion para agilizar la toma de datos
function obtener(id){
  return document.getElementById(id).value;
}
//-------------------------------------------MOSTRAR TABLA
function mostrar(id){
  document.getElementById(id).style.display= "block";
}
//------------------------------------------------insertar  a cualquier tabla
function insertarglobal(tbl,arreglo,v=0){
var base = firebase.database().ref(tbl);
var obj = new Object;
console.log("insertando");
for(var i=0;i<arreglo.length;i++){
 
  if(v==1 && arreglo[i]=="detalle"){
    console.log("una venta agregandose");
    var n = document.getElementById("dettable").rows.length;
    var det = "";
    var detax ;
    for(var j =1;j<n;j++){
      console.log("producto N "+j);
      detax = document.getElementById("d"+j).options.selectedIndex;
      det+= document.getElementById("d"+j).options.item(detax).text;
      //alert(detax+" "+document.getElementById("d"+j).options.item(detax).text);
      det+=" *"+obtener("c"+j)+" : $"+obtener("s"+j);
      det+=";";
    }
    obj[arreglo[i]]=det;
    console.log("se acabo la venta");
  }else{
    obj[arreglo[i]]=obtener(arreglo[i]);
  }
  
}
base.once("value",function(snap){
 var aux = snap.val();
  var n = 1;
  id=tbl.substring(0,4);
  for(var documento in aux){ 
    n++;
}
if(n>=10000){
  id+="0"+n;
}else if(n>=1000){
  id+="00"+n;
}else if(n>=100){
  id+="000"+n;
}
else if(n>=10){
  id+="0000"+n;
}
else{
  id+="00000"+n;
}
base.child(id).set(obj);
nowuiDashboard.showNotification('top','center',"<b>REGISTRO EXITOSO!</b>","success");
setTimeout(function(){location.reload()},3000);
});

}

//----------------------------funcion para agregar usuarios----------------------------
function insertardatos(n1,n2,n3){
    var nombre = obtener(n1);
    var contraseña = obtener(n2);//se obtienen los datos del formulariio
    var tipo = obtener(n3);
    if(nombre.length==0 || contraseña.length==0 ){
         //se verifica primero que todos los campos esten llenos
        nowuiDashboard.showNotification('top','center',"<b>rellene todos los campos!</b>","warning");
    }else{
      //alert(nombre +" "+ contraseña +" "+ tipo);
      var obj = new Object;//se cre un objeto que representara un usuario
      obj["Nombre"]= nombre;
      obj["pass"]=contraseña;//con su nombre contraseña y tipo ademas de un esatdo que serviara para saber si esta logeado o no
      obj["tipo"]=tipo;
      obj["Estado"]=0;
      console.log(obj);//se imprimie en consola  modo de pruebas no es necesario hacerlo
      
      var bd = firebase.database().ref("Usuarios");//se inicia una instancia de la base de datos pero haciendo referencia a la tabla usuarios
      var id ;//se crea una variable para la id
      bd.once("value",function(snap){ //se crea una consulta siempre se hace con el archivo que creaste la instancia en este caso bd
        //seguido de .once porque solo una consulta es no varias y como queremos nada mas revisar valores ponemos ("value", )y segudo de una funcion para tomar una captura de la instancia de la base de datos
        //por eso ponemos la palabra snap aunk puede ser cualquier palabra dentro de la funcion
        var aux = snap.val();//creamos una variable en este caso aux que tome los valores de la fotografia de los datos de la bd
        var n = 1;//creamos un contador para saber cuantos usuarios hay antes del que se ingresara
        for(var documento in aux){ //hacemos un for que por cada usuario en la fotografia se recorrera lo siguiente
          //OJO documento tomara los elementos dentro de usuarios osea solo los ID que representa
          console.log(documento+ " "+documento.substring(0,2));//datos de prueba en consola (opcional todos los que digan console.log)
          if(tipo=="Limitado"){ //aqui verificamos si es limitado o admin para contar solo los limitados o solo los admin
            id = "LT";//si es limitado los primeros digitos del id son LT
            if(documento.substring(0,2)=="LT"){//verificamos si el elemenot actual de la fotografia es un limitado osea que comienze su id con LT
              console.log("si"+n);//opcional
              n++;//si el elemento actual es limitado entonces aumenta el contador de usuarios del mismo tipo que estamos insertando
            }
          }else{//------------------lo mismo pero para admin
            id = "AD";
            if(documento.substring(0,2)=="AD"){
              n++;
            }
          }
          //verificamos si dentro de la fotografia (aux) en el id que estamos viendo ahorita (documento) su parte del nombre es igual a la del elemento que vamos a insertar
          if(aux[documento].Nombre==obj["nombre"]){
            //si son iguales osea si ya hay un nombre igual al de elemento que pondremos 
            nowuiDashboard.showNotification('top','center',"<b>ESE USUARIO YA EXISTE!</b>","danger");
            return 0;//y se detendra la funcion
          }
      }
      //todo aqui abajo es para agregar una cantidad de 0 antes del n (representa el numero de usuario limitado o admin que sera el que se acaba de registrar)
      if(n>=10000){
        id+="0"+n;
      }else if(n>=1000){
        id+="00"+n;
      }else if(n>=100){
        id+="000"+n;//si 3 digitos entonces 3 ceros y asi suscesivamente
      }
      else if(n>=10){
        id+="0000"+n;//si es 2 digitos entonces 4 ceros
      }
      else{
        id+="00000"+n;//si es de un digito el entonces 5 ceros antes
      }
      bd.child(id).set(obj);//se duce que en la instancia de la base de datos actual (vease linea N°34)
      //.child() crea un subdato que este sera el id que ya creamos y dentro de el se pondra (.set) el objeto que cotiene los datos del usuario

     /* alert("Registrado");//se indica que se registro 
      location.reload(true);//recargamos la pagina*/
      nowuiDashboard.showNotification('top','center',"<b>REGISTRO EXITOSO!</b>","success");
      setTimeout(function(){location.reload()},3000);
      });
     // var bd = firebase.database().ref("Usuarios/"+id);
     // bd.set(obj);
    }
}
//-----------------------------------------------------------------------------------dibujar tabla
function filltablav2(arreglo,tp,id,tbl,n = 0,user=0){
  var tbody;
  tbody="<tr>";
  if(n>0){
    tbody+="<td>"+n+"</td>";
  }
  for(var i=0;i<arreglo.length;i++){
    tbody+="<td class='text-center'>"+arreglo[i]+"</td>";
  }
  if(tp){
    if(user==1 && arreglo[0] == clave.getItem('active')){
      tbody+="<td class='td-actions text-center'><b>USUARIO ACTUAL</b></td>";
    }else{
      tbody+="<td class='td-actions text-center'>"+
    "<button id='"+id+"' data-toggle='modal' data-target='#Edt"+id+"' onclick=\"modaledit('"+tbl+"',this.id);\"  type='button' rel='tooltip' class='btn btn-success btn-sm btn-icon'>"+
        "<i class='now-ui-icons ui-2_settings-90'></i> </button>"+
    "<button id='"+id+"' onclick=\"borrar('"+tbl+"',this.id);\" type='button' rel='tooltip' class='btn btn-danger btn-sm btn-icon'>"+
    "<i class='now-ui-icons ui-1_simple-remove'></i> </button>"+"</td>";
    }
    
  }
  tbody+="</tr>";
  return tbody;
}
//-----------------------------------------------------------------------acciones de botones

//----------------------------------------------ACTUALIZAR
function update(tbl,id){
  var base=  firebase.database().ref(tbl+"/"+id);

  switch(tbl){
    case "Usuarios":{
      var obj = new Object;
      obj["Nombre"]= obtener("nombre1");
      obj["pass"]=obtener("pass1");
      obj["tipo"]=obtener("tipo1");
      obj["Estado"]=0;
      break;
    }
    case "Vendedores":{
      var obj = new Object;
      obj["DUI"]=obtener("DUI1");
      obj["NIT"]=obtener("NIT1");
      obj["direccion"]=obtener("direccion1");
      obj["nombre"]=obtener("nombre1");
      obj["usuario"]=obtener("usuario1");
      break;
    }
    case "Productos":{
      var obj = new Object;                   //aqui es solo de poner las cosas en el orden que estan en la bd
      obj["cantidad"]=obtener("cantidad1");     //y luego obtenerlas del modal el modal tiene los mismos nombres
      obj["marca"]=obtener("marca1");                 //que los campos a agregar solo que con un 1 al final
      obj["nombre"]=obtener("nombre1");
      obj["precio"]=obtener("precio1");
      break;
    }
    case "Clientes":{
      var obj = new Object;
      obj["DUI"]=obtener("DUI1");
      obj["NIT"]=obtener("NIT1");
      obj["direccion"]=obtener("direccion1");
      obj["nombre"]=obtener("nombre1");
      obj["telefono"]=obtener("telefono1");
      break;
    }
    case "Proveedores":{
      var obj = new Object;
      obj["detalle"]=obtener("detalle1");
      obj["nombre"]=obtener("nombre1");
      obj["telefono"]=obtener("telefono1");
      break;
    }
    case "Ventas":{
      var onj = new Object;
      obj["cliente"]=obtener("cliente1");
      obj["detalle"]=obtener("detalle1");
      obj["fecha"]=obtener("fecha1");
      obj["tipopago"]=obtener("tipopago1");
      obj["total"]=obtener("total1");
      obj["vendedor"]=obtener("vendedor1");
      break;
    }
  }
  //alert(id);
  base.set(obj);
  nowuiDashboard.showNotification('top','center',"<b>REGISTRO Actualizado!</b>","info");
  setTimeout(function(){location.reload()},3000);

}
function modaledit(tbl,id){
/*
  var usuarios = ['text','text','text','hidden'];
  var vendedores = ["text","text","text","text","text"];
  var productos =["text","text","number","number"];
  var proveedores=["text","text","number"];
  var ventas = ["date","text","text","text","text","number","number"]  ;
  var clientes= ["text","text","number","text","text"];
*/
  var modal = 
 " <div class='modal fade' id='Edt"+id+"' tabindex='-1' role='dialog' aria-labelledby='Edt"+id+"Label' aria-hidden='true'>"+
 " <div class='modal-dialog' role='document'>"+
"    <div class='modal-content'>"+
"      <div class='modal-header'>"+
"        <h5 class='modal-title' id='Edt"+id+"Label'>Editar "+tbl+"</h5>"+
"        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
"          <span aria-hidden='true'>&times;</span>"+
"        </button>"+
"      </div>"+
"      <div class='modal-body'>";
var data= "";
switch(tbl){
  case "Usuarios":{   //aca solo copias el formulario que usas para editar el mismo solo cambias los id poniendoles un 1 al final para diferenciarlos
      data="<form>"+
     " <div class='row'>"+
       " <div class='col'>"+
          "<input id='nombre1' type='text' class='form-control' placeholder='Nombre'>"+
       " </div>"+
       " <div class='col'>"+
          "<input id='pass1' type='password' class='form-control' placeholder='Contraseña'>"+
        "</div>"+
      "</div><div class='row'><div class='col'>"+
      "<select style='width:auto;margin-left:40%;' id='tipo1' class='form-control' placeholder='Tipo'>"+
     " <option value='Admin'>Admin</option>"+
      "<option selected value='Limitado'>Limitado</option>"+
    "</select></div></div>"+
    "</form>";
    break;
  }
  case "Vendedores":{
    data= "<form>"+
                "<div class='row'>"+
                    "<div class='col-md-3 px-1'>"+
                      "<div class='form-group'>"+
                        "<label>Nombre</label>"+
                        "<input id='nombre1' type='text' class='form-control' placeholder='Ronal Aleman' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-4 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Direccion</label>"+
                        "<input id='direccion1' type='email' class='form-control' placeholder='San Miguel'>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-6 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label>DUI</label>"+
                        "<input id='DUI1' type='text' class='form-control' placeholder='38789230-0' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-12'>"+
                      "<div class='form-group'>"+
                        "<label>NIT</label>"+
                        "<input id='NIT1' type='text' class='form-control' placeholder='8039-011194-101-0' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-6 pr-1'>"+
                      "<div class='form-group'>"+
                        "<label>Usuarios</label>"+
                        "<input id='usuario1' type='text' class='form-control' placeholder='User' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                "</form>";
    break;
  }
  case "Productos":{
    data= "<form>"+
                  "<div class='row'>"+
                  "<div class='col-md-3 px-1'>"+
                      "<div class='form-group'>"+
                        "<label>Nombre De Producto</label>"+
                        "<input id='nombre1' type='text' class='form-control' placeholder='Impresora' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-4 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Marca</label>"+
                        "<input id='marca1' type='email' class='form-control' placeholder='Cannon'>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-6 pr-1'>"+
                      "<div class='form-group'>"+
                        "<label>Cantidad</label>"+
                        "<input id='cantidad1' type='text' class='form-control' placeholder='10' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-6 pr-1'>"+
                      "<div class='form-group'>"+
                        "<label>Precio</label>"+
                        "<input id='precio1' type='text' class='form-control' placeholder='$10' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                "</form>";
    break;
  }
  case "Clientes":{
    data="                <form>"+
                  "<div class='row'>"+
                    "<div class='col-md-3 px-1'>"+
                      "<div class='form-group'>"+
                       " <label>Nombre</label>"+
                        "<input id='nombre1'  type='text' class='form-control' placeholder='Ronal Aleman' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-4 pl-1'>"+
"                      <div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Direccion</label>"+
                        "<input id='direccion1'  type='email' class='form-control' placeholder='San Miguel'>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-6 pr-1'>"+
"                      <div class='form-group'>"+
                        "<label>Telefono</label>"+
                        "<input id='telefono1' type='number' class='form-control' placeholder='75657484' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-6 pl-1'>"+
"                      <div class='form-group'>"+
                        "<label>DUI</label>"+
                        "<input id='DUI1' type='text' class='form-control' placeholder='38789230-0' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-12'>"+
                      "<div class='form-group'>"+
                        "<label>NIT</label>"+
                        "<input id='NIT1' type='text' class='form-control' placeholder='8039-011194-101-0' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                "</form>";
    break;
  }
  case "Proveedores":{
             data="<form>"+
                  "<div class='row'>"+
                    "<div class='col-md-3 px-1'>"+
                      "<div class='form-group'>"+
                        "<label>Nombre</label>"+
                        "<input id='nombre1' type='text' class='form-control' placeholder='Impresora' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-4 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Detalles</label>"+
                        "<input id='detalle1' type='email' class='form-control' placeholder='Cannon'>"+
                      "</div>"+
                      "<div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Telefono</label>"+
                        "<input id='telefono1' type='email' class='form-control' placeholder='78748400'>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                "</form>";
    break;
  }
  case "Ventas":{
          data="<form>"+
                  "<div class='row'>"+
                    "<div class='col-md-4 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label for='exampleInputEmail1'>Fecha</label>"+
                        "<input id='fecha1' type='email' class='form-control' placeholder='3 Nov 2019'>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-6 pr-1'>"+
                      "<div class='form-group'>"+
                        "<label>Detalle</label>"+
                        "<input id='detalle1' type='text' class='form-control' placeholder='Detalles' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-6 pl-1'>"+
                      "<div class='form-group'>"+
                        "<label>Subtotal</label>"+
                        "<input id='subtotal1' type='text' class='form-control' placeholder='$' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='row'>"+
                    "<div class='col-md-12'>"+
                      "<div class='form-group'>"+
                        "<label>Total</label>"+
                        "<input id='total1' type='text' class='form-control' placeholder='$' value=''>"+
                      "</div>"+
                      "<div class='form-group'>"+
                        "<label>Tipo De Pago</label>"+
                        "<input id='tipopago1' type='text' class='form-control' placeholder='Efectivo' value=''>"+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                  "<div class='form-group'>"+
                      "<label>Cliente</label>"+
                      "<input id='cliente1' type='text' class='form-control' placeholder='Franklin Fuentes' value=''>"+
                  "</div>"+
                  "<div class='form-group'>"+
                      "<label>Vendedor</label>"+
                      "<input id='vendedor1' type='text' class='form-control' placeholder='Juan Lopez' value=''>"+
                  "</div>"+
                "</form>";
    break;
  }
}
modal+=data;
modal+=
        "        <br>"+
"      </div>"+
"      <div class='modal-footer'>"+
"        <button type='button' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>"+
"        <button type='button' id='"+id+"' onclick=\"update('"+tbl+"',this.id);\" class='btn btn-primary'>Actualizar Datos</button>"+
"      </div>"+
"    </div>"+
"  </div>"+
"</div>";
console.log(modal);
fillparte("editar",modal);


}
//------------------------------------------------ELIMINAR
function borrar(tbl,id){
  var base = firebase.database().ref(tbl+"/"+id);
 var mensaje = "elemento con el id: <b> "+id+" </b> ha sido <b>ELIMINADO</b>"; 
 base.remove();
  nowuiDashboard.showNotification('top','center',mensaje,"danger");
  setTimeout(function(){location.reload()},3000);
}
//---------------------------------------------insertar en el html
function fillparte(id,datos){ //funcion para rellenar partes de un html atravez de su id
  document.getElementById(id).innerHTML += datos; //.innerhtml inserta datos con codigo html directamente
}
//---------------------------------------------consultar usuarios
function consultar(){   ///funcion para consultar datos
  var db = firebase.database().ref("Usuarios"); //se crea instancia de la base datos centrandonos en usuarios
  db.once("value",function(snap){ //se consulta usando .once y crendo funcion snap
    var aux = snap.val(); //se crea un auxiliar que tomara los datos de ese snap
    var tabla = "";   //se crea la variable donde se guardara la tabla entera
    var tmp;
    for(var documento in aux){  //se hace un for por cada id dentro de usuarios osea por cada usuario
      tmp =Object.values(aux[documento]);
      tmp[0]= documento;
      console.log(tmp);
     /*  tabla+= filltabla(documento,aux[documento].Nombre, //a la variable tabla se agregara cada vez el id (Documento) seguido de sus demas elementos de cada id (usuario) existente en Usuarios
        aux[documento].pass,aux[documento].tipo);*/
        tabla += filltablav2(tmp,1,documento,"Usuarios",0,1);
    }
    fillparte("datos",tabla);//finalmente se inserta en el html con la funcion creada
  });
}
//---------------------------------------------------consultar de cualquier tabla menos usuarios.
function consultarglobal(tbl,id,num = false){
//tbl el nombre de la tabla que se tomara, id 1 si quiere mostrar el id en la consulta 0 si no quiere mostrarlo en la consulta.
var db = firebase.database().ref(tbl); //se crea instancia de la base datos centrandonos en usuarios
db.once("value",function(snap){ //se consulta usando .once y crendo funcion snap
  var aux = snap.val(); //se crea un auxiliar que tomara los datos de ese snap
  var tabla = "";   //se crea la variable donde se guardara la tabla entera
  var tmp,tmpax;
  var cont=0;
  for(var documento in aux){  //se hace un for por cada id dentro de usuarios osea por cada usuario
    cont++;
    tmp =Object.values(aux[documento]); 
    tmpax = tmp;
    if(id){
      tmpax.push(documento);
    }
    for(var i=0;i<tmpax.length;i++){//para reordenar las cosas
     if(id){
       if(i==0){
         tmp[0]=documento;
       }else{
         tmp[i]=tmpax[i-1];
       }
     }else{
       tmp[i]=tmpax[i];
     }
    }
    console.log(tmp);
   /*  tabla+= filltabla(documento,aux[documento].Nombre, //a la variable tabla se agregara cada vez el id (Documento) seguido de sus demas elementos de cada id (usuario) existente en Usuarios
      aux[documento].pass,aux[documento].tipo);*/
      if(num){
        tabla += filltablav2(tmp,1,documento,tbl,cont);
      }else{
         tabla += filltablav2(tmp,1,documento,tbl);
      }
     
  }
  fillparte("datos",tabla);//finalmente se inserta en el html con la funcion creada
});
}
//---------------------------------------------------------funcion para consultar desde una lista desplegable
function cargardatos(id,tbl,campo,multiple=0,vend=0,v=0){
var lista = document.getElementById(id);
console.log(lista.length);
if(lista.length>0){
 /* for(var i=lista.length;i>0;i--){
  lista.remove(i-1);
  }*/
console.log("ya se cargaron");
}else{
  if(multiple){
    lista.multiple= true;
  }
var data ;
var c;
var camp;
var db = firebase.database().ref(tbl); 

db.once("value",function(snap){ 
  var aux = snap.val(); 
  if(vend){//esto lo puse en vendedor para que no deje darle un usuario que ya tenga otro vendedor.
    var db2 = firebase.database().ref("Vendedores");
      var rep = 0;
      db2.once('value',function(snapito){
        var ax = snapito.val();
        
        for(var j in aux){
          rep=0;
          for(var dc in ax){
          
          console.log("comparando");
          console.log(ax[dc].usuario+" "+j)
          if(ax[dc].usuario==j){
            console.log("estan iguales");
            rep=1;
          }
          }
          if(rep==0){
          console.log("se salvo");
          data= document.createElement("option");  
          c = aux[j];
          camp = c[campo];
          data.text=camp;
          data.value=documento;
          lista.add(data);
          console.log(camp);
        }

        }
        
        
        
      });
  }else{
  for(var documento in aux){
    
    data= document.createElement("option");  
    c = aux[documento];
    camp = c[campo];
    data.text=camp;
    data.value=documento;
    if(v>0){
      console.log("es una venta");
      data.text = camp+" "+c["marca"];
      
      /*
    c = aux[documento];
    camp = c[campo];
    data.text=camp;
    data.value=documento;
    lista.add(data);
    console.log(camp);*/
    }
    lista.add(data);
    console.log(camp);
    

  }
}
  });
}

}
//-----------------------------------------------------------------aux ventas
function selector(id){
var n =  parseInt(id.substring(1));
var pro = obtener("d"+n);
console.log(pro);
var cant = document.getElementById("c"+n);
var pre = document.getElementById("p"+n);
var sub = document.getElementById("s"+n);
var db = firebase.database().ref("Productos/"+pro);
db.once("value",function(snap){
    console.log("casi");
    var ax = snap.val();
    console.log(ax);
    cant.max = ax["cantidad"];
    if(id.substring(0,1)!='c'){
      cant.value=1;
    }else{
      if(cant.value>cant.max){
        cant.value=cant.max;
      }
    }
    pre.value = parseFloat(ax["precio"]);
    sub.value = parseInt(cant.value) * parseFloat(pre.value);
    console.log("Se calculo");
    total();
});

}
function agregardetalle(){
  var tabla = document.getElementById("dettable");
  var n = tabla.rows.length;
  var content = document.getElementById("detdata");
  var add = "<tr>"+
  "<td><select onchange='selector(this.id);' aria-placeholder='seleccione los productos de la venta' class='form-control' onmouseover=\"cargardatos(this.id,'Productos','nombre',0,0,1);\" name='detalle' id='d"+n+"'>"+
"    </select>"+
  "</td>"+
  "<td>"+
    "<input onchange='selector(this.id);' class='form-control' value='1' id='c"+n+"' type='number' min='1'>"+
  "</td>"+
  "<td><input class='form-control' id='p"+n+"' readonly type='number' placeholder='$' ></td>"+
  "<td><input class='form-control' id='s"+n+"' readonly type='number' placeholder='$' ></td>"+
"</tr>";
content.innerHTML +=add;
}
function total(){
  var tabla = document.getElementById("dettable");
  var n = tabla.rows.length;
  var suma=0;
  for(var i=1;i<n;i++){
    suma+= parseFloat(obtener("s"+i));
  }
  document.getElementById("total").value = suma;
}
//----------------------------------------------------------------------------SESIONES--------------------------------------
const clave = window.localStorage;
//"D:/works/0/2019/TSI/ProyectoRAF/";
const base ="D:/works/0/2019/TSI/ProyectoRAF/";//"https://ezio2220.github.io/ProyectoRAF/";

function salir(){
  console.log(clave.getItem('active'));
  var db = firebase.database().ref("Usuarios/"+clave.getItem('active'));
  var obj = new Object();
  obj["Estado"]=0;
  console.log(obj);
  db.update(obj);

  clave.removeItem('active');
  console.log("eliminado");
  nowuiDashboard.showNotification('top','center',"<b>Cerrando Sesion..</b>","warning");
  setTimeout(function(){window.location.href = base+'login/index.html';},1000);
}
function comprobar(){
  //mientras se hacen pruebas..
  document.getElementById("todo").hidden=false;
  document.head.innerHTML= document.head.innerHTML+"<style> .adm{ display:table;} </style>"
  /*
  if(clave.getItem('active')==null){
    nowuiDashboard.showNotification('top','center',"<b>Debe iniciar sesion!</b>","danger");
      setTimeout(function(){window.location.href = base+'login/index.html';},1000);
  }else{
      var db = firebase.database().ref("Usuarios");
      db.once('value',function(snap){
        var aux = snap.val();
        for(var data in aux){
          if(data==clave.getItem('active')){
            if(aux[data].Estado==0){
              clave.removeItem('active');
              nowuiDashboard.showNotification('top','center',"<b>Se Cerro la Sesion en otro Dispositivo!</b>","danger");
              setTimeout(function(){location.reload()},1500);
            }
          }
        }
      });

      document.getElementById("todo").hidden=false;
      console.log("logeado con:"); 
      var user = clave.getItem('active');
      console.log(user);
      if(user.substring(0,2)=="AD"){
        nowuiDashboard.showNotification('top','center',"<b>Bienvenido ADMIN!</b>","success");
       // document.getElementsByClassName("adm")
        document.head.innerHTML= document.head.innerHTML+"<style> .adm{ display:table;} </style>"
      }else{
        nowuiDashboard.showNotification('top','center',"<b>Bienvenido!</b>","success");
      }
     
  }*/
}