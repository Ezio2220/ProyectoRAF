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
//---------------------------------------------insertar en el html
function fillparte(id,datos){ //funcion para rellenar partes de un html atravez de su id
  document.getElementById(id).innerHTML += datos; //.innerhtml inserta datos con codigo html directamente
}
//-------------------------------------------MOSTRAR TABLA
function mostrar(id){
  document.getElementById(id).style.display= "block";
}
//------------------------------------------------------------------------------------Actualizar Existencias
function existencias(id,val){
  var database = firebase.database().ref("Productos/"+id);
  var obj2 = new Object();
  var n1,n2;
 // alert("editando "+id+" con "+val);
  n2 = parseFloat(val);
  database.once("value",function(snap2){
    var ax2 = snap2.val();
    obj2 = ax2;
    n1=parseFloat(obj2["cantidad"]);
    obj2["cantidad"]= n1-n2;
    database.set(obj2);

  });
}
//##################################################################################################################################################################
//------------------------------------------------insertar  a cualquier tabla
function insertarglobal(tbl,arreglo,v=0){
  var base;

  if(tbl=="paquete"){
    base = firebase.database().ref("Productos");
  }else{
    if(tbl=="Foto"){
      base = firebase.database().ref("Ventas");
    }else{
      base = firebase.database().ref(tbl);
    }
    
  }
  var vacio=false;
  if(tbl=="Ventas" || tbl=="Foto"){

  }else{
    
for(var k=0;k<arreglo.length;k++){
  if(obtener(arreglo[k]).length==0 ){
    vacio=true;
    return  nowuiDashboard.showNotification('top','center',"<b>rellene todos los campos!</b>","warning");
  }
}
  }


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
      if(tbl=="Ventas"){
       // alert("actualizar existencias");
        existencias(document.getElementById("d"+j).value,obtener("c"+j));
      }
    }
    obj[arreglo[i]]=det;
    console.log("se acabo la venta");
  }else if(arreglo[i]=="cliente" || arreglo[i]=="vendedor"){
    var det="";
    var detax;
    detax = document.getElementById(arreglo[i]).options.selectedIndex;
      det= document.getElementById(arreglo[i]).options.item(detax).text;
      obj[arreglo[i]]=det;
  }else if (arreglo[i]=="detalle" && tbl!="paquete"){
    var sel = document.getElementById(arreglo[i]).selectedOptions;
    var det="";
    for(var j=0;j<sel.length;j++){
      det+=sel[i].label;
      if(j!=sel.length-1){
        det+=",";
      }
    }
    obj[arreglo[i]]=det;
  }else{
    obj[arreglo[i]]=obtener(arreglo[i]);
  }
  
}
base.once("value",function(snap){
 var aux = snap.val();
  var n = 1;
  if(tbl=="paquete"){
    id="Paqu";
  }else{
    if(tbl=="Foto"){
      id="Foto";
    }else{
      id=tbl.substring(0,4);
    }
      
  }

  for(var documento in aux){ 
    if(tbl=="paquete"){
      if(documento.substring(0,4)=="Paqu"){
        n++;
      }
    }else{
      if(tbl=="Foto"){
        if(documento.substring(0,4)=="Foto"){
          n++;
        }
      }else if(tbl=="Productos"){
        if(documento.substring(0,4)=="Prod"){
          n++;
        }
      }else if(tbl=="Ventas"){
        if(documento.substring(0,4)=="Vent"){
          n++;
        }
      }
      else{
        n++;
      }
    }
    
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
if(tbl=="Ventas"){
  imp(id,1);
}else if(tbl=="Foto"){
  imp(id,1,1);
}
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
          if(aux[documento].Nombre==obj["Nombre"]){
            console.log((aux[documento].Nombre+"--"+obj["Nombre"]));
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
  var base;
  if(tbl=="paquete"){
    base=  firebase.database().ref("Productos/"+id);
  }else if(tbl=="Foto"){
    console.log("fotox1");
    base=  firebase.database().ref("Ventas/"+id);
  }else{
    base=  firebase.database().ref(tbl+"/"+id);
  }
  

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
    case "paquete":{
      var obj = new Object;                   
      obj["detalle"]=obtener("detalle1");                 
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
      var sel = document.getElementById("detalle1").selectedOptions;
      var det="";
      for(var j=0;j<sel.length;j++){
        det+=sel[0].label;
        if(j!=sel.length-1){
          det+=",";
        }
      }
      obj["detalle"]=det;

      obj["nombre"]=obtener("nombre1");
      obj["telefono"]=obtener("telefono1");
      break;
    }
    case "Ventas":{
      var obj = new Object;
      var det = "";      var detax ;
      detax = document.getElementById("cliente1").options.selectedIndex;
      det = document.getElementById("cliente1").options.item(detax).text;
      obj["cliente"]=det;
      det="";
      var n = document.getElementById("dettable1").rows.length;
      
      for(var j =1;j<n;j++){
        console.log("producto N 5"+j);
        detax = document.getElementById("d5"+j).options.selectedIndex;
        det+= document.getElementById("d5"+j).options.item(detax).text;
        //alert(detax+" "+document.getElementById("d"+j).options.item(detax).text);
        det+=" *"+obtener("c5"+j)+" : $"+obtener("s5"+j);
        det+=";";
      }
      obj["detalle"]=det;
      obj["fecha"]=obtener("fecha1");
      obj["tipopago"]=obtener("tipopago1");
      obj["total"]=obtener("total1");
      det="";
      detax = document.getElementById("vendedor1").options.selectedIndex;
      det = document.getElementById("vendedor1").options.item(detax).text;
      obj["vendedor"]=det;
      break;
    }
    case "Foto":{
      console.log("fotox1");
      var obj = new Object;
      var det = "";      var detax ;
      detax = document.getElementById("cliente1").options.selectedIndex;
      det = document.getElementById("cliente1").options.item(detax).text;
      obj["cliente"]=det;
      det="";
      var n = document.getElementById("dettable1").rows.length;
      for(var j =1;j<n;j++){
        console.log("producto N 5"+j);
        detax = document.getElementById("d5"+j).options.selectedIndex;
        det+= document.getElementById("d5"+j).options.item(detax).text;
        //alert(detax+" "+document.getElementById("d"+j).options.item(detax).text);
        det+=" *"+obtener("c5"+j)+" : $"+obtener("s5"+j);
        det+=";";
      }
      obj["detalle"]=det;
      obj["fecha"]=obtener("fecha1");
      obj["tipopago"]=obtener("tipopago1");
      obj["total"]=obtener("total1");
      det="";
      detax = document.getElementById("vendedor1").options.selectedIndex;
      det = document.getElementById("vendedor1").options.item(detax).text;
      obj["vendedor"]=det;
      console.log(obj);
      break;
    }
  }
  //alert(id);
  base.set(obj);
  nowuiDashboard.showNotification('top','center',"<b>REGISTRO Actualizado!</b>","info");
  setTimeout(function(){location.reload()},3000);

}
function vaciarmodal(){
  fillparte("editar","s");
}
function modaledit(tbl,id){
  
  var modal = 
 " <div class='modal fade' id='Edt"+id+"' tabindex='-1' role='dialog' aria-labelledby='Edt"+id+"Label' aria-hidden='true'>"+
 " <div class='modal-dialog' role='document'>"+
"    <div class='modal-content'>"+
"      <div class='modal-header'>"+
"        <h5 class='modal-title' id='Edt"+id+"Label'>Editar "+tbl+"</h5>";
if(tbl=="Ventas" || tbl=="Foto" || tbl=="Proveedores"){
  modal+=
"        <button type='button' onclick='location.reload();' class='close' data-dismiss='modal' aria-label='Close'>"+
"          <span aria-hidden='true'>&times;</span>"+
"        </button>"+
"      </div>"+
"      <div class='modal-body'>";
}else{
  modal+=
"        <button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
"          <span aria-hidden='true'>&times;</span>"+
"        </button>"+
"      </div>"+
"      <div class='modal-body'>";
}

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
                        "<select onmouseover=\"cargardatos(this.id,'Usuarios','Nombre',0,1);\" class='form-control'  name='usuario' id='usuario1'></select>"+
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
                        "<input id='cantidad1' type='number' class='form-control' placeholder='10' value=''>"+
                      "</div>"+
                    "</div>"+
                    "<div class='col-md-6 pr-1'>"+
                      "<div class='form-group'>"+
                        "<label>Precio</label>"+
                        "<input id='precio1' type='number' class='form-control' placeholder='$10' value=''>"+
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
             data="<form><div class='row'><div class='col-md-3 px-1'>"+
"<div class='form-group'> <label>Nombre</label>"+
"<input id='nombre1' type='text' class='form-control' placeholder='Impresora' value=''>"+
"</div></div><div class='col-md-6 pl-1'><div class='form-group'>"+
"<label for='exampleInputEmail1'>Detalles</label>"+
"<select onmouseover=\"cargardatos(this.id,'Productos','nombre',1,0);\" class='form-control'  name='proveedor' id='detalle1'></select>"+
"</div> </div><div class='col-md-3 px-1'><div class='form-group'>"+
"<label for='exampleInputEmail1'>Telefono</label>"+
"<input id='telefono1' type='email' class='form-control' placeholder='78748400'>"+
"</div></div> </div></form>";

    break;
  }
  case "Ventas":{
          data="<form>"+
        "  <div class='row'>"+
        "    <div class='col-md-4 pl-1'>"+
        "      <div class='form-group'>"+
        "        <label for='exampleInputEmail1'>Fecha</label>"+
        "        <input id='fecha1' type='date' class='form-control' placeholder='3 Nov 2019'>"+
        "      </div>"+
        "    </div>"+
        "    <div class='col'>"+
        "          <input onclick='agregardetalle(0,1);' id='add1' style='margin-left: 40%;' type='button' class='btn btn-success' value='Agregar otro producto'>"+
        "      </div>"+
        "  </div>"+
        "  <div class='row'>"+
        "    <div class='col'>"+
        "      <div class='form-group'>"+
         "       <label>Detalle</label>"+
         "       <table id='dettable1' class='table'>"+
         "           <thead>"+
         "               <tr>"+
         "                   <th class='text-center'>Producto</th>"+
         "                   <th class='text-center'>Cantidad</th>"+
         "                   <th class='text-center'>Precio</th>"+
         "                   <th class='text-center'>Subtotal</th>"+
         "               </tr>"+
         "           </thead>"+
         "           <tbody id='detdata1'>"+
        "                <tr>"+
         "                 <td><select onchange='selector(this.id,0,1);' aria-placeholder='seleccione los productos de la venta' class='form-control' onmouseover=\"cargardatos(this.id,'Productos','nombre',0,0,1);\" name='detalle' id='d51'>"+
         "                   </select>"+
         "                 </td>"+
         "                 <td>"+
         "                   <input onchange='selector(this.id,0,1);' class='form-control' value='1' id='c51' type='number' min='1'>"+
         "                 </td>"+
         "                 <td>"+
         "                     <input class='form-control' id='p51' readonly type='number' placeholder='$' >"+
         "                 </td>"+
         "                 <td>"+
         "                     <input class='form-control' id='s51' readonly type='number' placeholder='$' >"+
         "                 </td>"+
         "               </tr>"+
         "           </tbody>"+
         "       </table>"+
         "     </div>"+
         "   </div>"+
         " </div>"+
         " <div class='row'>"+
            "<div class='col-md-12'>"+
              "<div class='form-group'>"+
                "<label>Total</label>"+
                "<input id='total1' readonly type='number' class='form-control' placeholder='$' value=''>"+
              "</div>"+
              "<div class='form-group'>"+
                "<label>Tipo De Pago</label>"+
                "<input id='tipopago1' type='text' class='form-control' placeholder='Efectivo' value=''>"+
              "</div>"+
            "</div>"+
          "</div>"+
          "<div class='form-group'>"+
              "<label>Cliente</label>"+
              "<select onmouseover=\"cargardatos(this.id,'Clientes','nombre',0,0);\" class='form-control'  name='cliente' id='cliente1'></select>"+
          "</div>"+
          "<div class='form-group'>"+
              "<label>Vendedor</label>"+
              "<select onmouseover=\"cargardatos(this.id,'Vendedores','nombre',0,0);\" class='form-control'  name='vendedor' id='vendedor1'></select>"+
          "</div>"+
        "</form>:";
    break;
  }
  case "paquete":{
    data = "                <form>"+
    "<div class='row'>"+
      "<div class='col-md-6'>"+
        "<div class='form-group'>"+
          "<label>Nombre</label>"+
          "<input id='nombre1'  type='text' class='form-control' placeholder='graduacion' value=''><!-- CADA INPUT debe tener un id que haga referencia al nombre de dato, este nombre de id debe ser igual del que tendra el dato en la bd-->"+
        "</div>"+
      "</div>"+
      "<div class='col-md-6'>"+
        "<div class='form-group'>"+
          "<label for='detalle'>Detalle</label>"+
          "<input id='detalle1'  type='text' class='form-control' placeholder='2 fotos tamaño cedula, 2 cuadros tamaño 30x50'>"+
        "</div>"+
      "</div>"+
      "<div class='col-md-6'>"+
        "<div class='form-group'>"+
          "<label>Precio</label>"+
          "<input id='precio1' type='number' class='form-control' placeholder='$' value=''>"+
        "</div>"+
    "</div>"+
  "</div>"+
  "</form>";
    break;
  }
  case "Foto":{
    data="<form>"+
    "  <div class='row'>"+
    "    <div class='col-md-4 pl-1'>"+
    "      <div class='form-group'>"+
    "        <label for='exampleInputEmail1'>Fecha</label>"+
    "        <input id='fecha1' type='date' class='form-control' placeholder='3 Nov 2019'>"+
    "      </div>"+
    "    </div>"+
    "    <div class='col'>"+
    "          <input onclick='agregardetalle(1,1);' id='add1' style='margin-left: 40%;' type='button' class='btn btn-success' value='Agregar otro producto'>"+
    "      </div>"+
    "  </div>"+
    "  <div class='row'>"+
    "    <div class='col'>"+
    "      <div class='form-group'>"+
     "       <label>Detalle</label>"+
     "       <table id='dettable1' class='table'>"+
     "           <thead>"+
     "               <tr>"+
     "                   <th class='text-center'>Paquete</th>"+
     "                   <th class='text-center'>Cantidad</th>"+
     "                   <th class='text-center'>Precio</th>"+
     "                   <th class='text-center'>Subtotal</th>"+
     "               </tr>"+
     "           </thead>"+
     "           <tbody id='detdata1'>"+
    "                <tr>"+
     "                 <td><select onchange='selector(this.id,1,1);' aria-placeholder='seleccione los productos de la venta' class='form-control' onmouseover=\"cargardatos(this.id,'Foto','nombre',0,0,1);\" name='detalle' id='d51'>"+
     "                   </select>"+
     "                 </td>"+
     "                 <td>"+
     "                   <input onchange='selector(this.id,1,1);' class='form-control' value='1' id='c51' type='number' min='1'>"+
     "                 </td>"+
     "                 <td>"+
     "                     <input class='form-control' id='p51' readonly type='number' placeholder='$' >"+
     "                 </td>"+
     "                 <td>"+
     "                     <input class='form-control' id='s51' readonly type='number' placeholder='$' >"+
     "                 </td>"+
     "               </tr>"+
     "           </tbody>"+
     "       </table>"+
     "     </div>"+
     "   </div>"+
     " </div>"+
     " <div class='row'>"+
        "<div class='col-md-12'>"+
          "<div class='form-group'>"+
            "<label>Total</label>"+
            "<input id='total1' readonly type='number' class='form-control' placeholder='$' value=''>"+
          "</div>"+
          "<div class='form-group'>"+
            "<label>Tipo De Pago</label>"+
            "<input id='tipopago1' type='text' class='form-control' placeholder='Efectivo' value=''>"+
          "</div>"+
        "</div>"+
      "</div>"+
      "<div class='form-group'>"+
          "<label>Cliente</label>"+
          "<select onmouseover=\"cargardatos(this.id,'Clientes','nombre',0,0);\" class='form-control'  name='cliente' id='cliente1'></select>"+
      "</div>"+
      "<div class='form-group'>"+
          "<label>Vendedor</label>"+
          "<select onmouseover=\"cargardatos(this.id,'Vendedores','nombre',0,0);\" class='form-control'  name='vendedor' id='vendedor1'></select>"+
      "</div>"+
    "</form>:";
    break;
  }
}
modal+=data;
if(tbl=="Ventas" || tbl=="Foto" || tbl=="Proveedores"){
  modal+=
  "        <br>"+
"      </div>"+
"      <div class='modal-footer'>"+
"        <button type='button' onclick='location.reload();' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>"+
"        <button type='button'  id='"+id+"' onclick=\"update('"+tbl+"',this.id);\" class='btn btn-primary'>Actualizar Datos</button>"+
"      </div>"+
"    </div>"+
"  </div>"+
"</div>";
}else{
  modal+=
        "        <br>"+
"      </div>"+
"      <div class='modal-footer'>"+
"        <button type='button'  class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>"+
"        <button type='button'  id='"+id+"' onclick=\"update('"+tbl+"',this.id);\" class='btn btn-primary'>Actualizar Datos</button>"+
"      </div>"+
"    </div>"+
"  </div>"+
"</div>";
}

console.log(modal);
fillparte("editar",modal);


}
//------------------------------------------------ELIMINAR
function borrar(tbl,id){
  var base;
  if(tbl=="paquete"){
    base = firebase.database().ref("Productos/"+id);
  }else if(tbl=="Foto"){
    base = firebase.database().ref("Ventas/"+id);
  }else{
    base = firebase.database().ref(tbl+"/"+id);
  }

 var mensaje = "elemento con el id: <b> "+id+" </b> ha sido <b>ELIMINADO</b>"; 
 base.remove();
  nowuiDashboard.showNotification('top','center',mensaje,"danger");
  setTimeout(function(){location.reload()},3000);
}

//---------------------------------------------consultar usuarios
function consultar(buscar="none"){   ///funcion para consultar datos
 document.getElementById("datos").innerHTML = " ";
  var db = firebase.database().ref("Usuarios"); //se crea instancia de la base datos centrandonos en usuarios
  
  if(buscar!="none" && obtener("criterio").length > 0){
    db = db.orderByChild(buscar).equalTo(obtener("criterio"));
  }
  db.once("value",function(snap){ //se consulta usando .once y crendo funcion snap
    var aux = snap.val(); //se crea un auxiliar que tomara los datos de ese snap
    var tabla = "";   //se crea la variable donde se guardara la tabla entera
    var tmp;
    for(var documento in aux){  //se hace un for por cada id dentro de usuarios osea por cada usuario
      var dato = aux[documento];
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
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//------------------------------------------------------------------------------------------consultar de cualquier tabla menos usuarios.
function consultarglobal(tbl,id,num = false,buscar="none"){
//tbl el nombre de la tabla que se tomara, id 1 si quiere mostrar el id en la consulta 0 si no quiere mostrarlo en la consulta.
console.log("ACA no hay nada");
document.getElementById("datos").innerHTML = " ";
var db;
if(tbl=="paquete"){
  db = firebase.database().ref("Productos");
}else{
  console.log("algo aunksea3");
  if(tbl=="Foto"){
    console.log("algo aunksea2");
    db = firebase.database().ref("Ventas"); 
    //console.log("algo aunksea22");
  }else{
    db = firebase.database().ref(tbl); //se crea instancia de la base datos centrandonos en usuarios
  }
  
}
if(buscar!="none" && obtener("criterio").length > 0){
  db = db.orderByChild(buscar).equalTo(obtener("criterio"));
}

db.once("value",function(snap){ //se consulta usando .once y crendo funcion snap
  var aux = snap.val(); //se crea un auxiliar que tomara los datos de ese snap
  var tabla = "";   //se crea la variable donde se guardara la tabla entera
  var tmp,tmpax;
  var cont=0;
  for(var documento in aux){  //se hace un for por cada id dentro de usuarios osea por cada usuario
    console.log("--"+documento);
    if(tbl=="paquete"){
      if(documento.substring(0,4)=="Paqu"){
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

           if(num){
             tabla += filltablav2(tmp,1,documento,tbl,cont);
           }else{
              tabla += filltablav2(tmp,1,documento,tbl);
           }
      }
    }else{
      
      if(tbl=="Foto"){
        console.log("algo aunksea");
        if(documento.substring(0,4)=="Foto"){
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
      }else if(tbl=="Productos"){
        if(documento.substring(0,4)=="Prod"){
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

             if(num){
               tabla += filltablav2(tmp,1,documento,tbl,cont);
             }else{
                tabla += filltablav2(tmp,1,documento,tbl);
             }
        }
      }else if(tbl=="Ventas"){
        if(documento.substring(0,4)=="Vent"){
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

             if(num){
               tabla += filltablav2(tmp,1,documento,tbl,cont);
             }else{
                tabla += filltablav2(tmp,1,documento,tbl);
             }
        }
      }else{
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
  //document.getElementById(id)=lista.innerHTML;
  console.log(lista.options);
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
var db ;
if(tbl=="Foto"){
  db= firebase.database().ref("Productos"); 
}else{
  db= firebase.database().ref(tbl); 
}

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
          data.value=j;
          lista.add(data);
          console.log(camp);
        }

        }
        
        
        
      });
  }else{
  for(var documento in aux){
    if(tbl=="Foto"){
      if(documento.substring(0,4)=="Paqu"){
        data= document.createElement("option");  
        c = aux[documento];
        camp = c[campo];
        data.text=camp;
        data.value=documento;
        if(v>0){
          console.log("es una venta");
          data.text = "Paquete "+ camp;
        }
        lista.add(data);
        console.log(camp);
      }
    }else{
      if(tbl=="Productos"){
        if(documento.substring(0,4)=="Prod"){
          data= document.createElement("option");  
          c = aux[documento];
          camp = c[campo];
          if( parseInt(c["cantidad"])==0 && multiple == 0){
            data.disabled=true;
          }
          data.text=camp;
          data.value=documento;
          if(v>0 || multiple){
            console.log("es una venta");
            data.text = camp+" "+c["marca"];
          }
          lista.add(data);
          console.log(camp);
        }
      }else{
        data= document.createElement("option");  
        c = aux[documento];
        camp = c[campo];
        data.text=camp;
        data.value=documento;
        if(v>0){
          console.log("es una venta");
          data.text = camp+" "+c["marca"];
        }
        lista.add(data);
        console.log(camp);
      }

    }

  }
}
  });
}

}
//-----------------------------------------------------------------aux ventas
function selector(id,Foto=0,edt=0){
var n =  parseInt(id.substring(1));
var pro = obtener("d"+n);
console.log(edt);
var cant = document.getElementById("c"+n);
var pre = document.getElementById("p"+n);
var sub = document.getElementById("s"+n);
var db = firebase.database().ref("Productos/"+pro);
db.once("value",function(snap){
    console.log("casi");
    var ax = snap.val();
    console.log(ax);
    if(Foto==1){
      cant.max = 10;
    }else{
      cant.max = ax["cantidad"];
      if(id.substring(0,1)!='c'){
        cant.value=1;
      }else{
       /* if(cant.value>cant.max){
          cant.value=cant.max;
        }*/
      }
    }
    
    
    pre.value = parseFloat(ax["precio"]);
    sub.value = parseInt(cant.value) * parseFloat(pre.value);
    console.log("Se calculo");
    total(edt);
});

}
function agregardetalle(Foto=0,edt=0){
  var tabla;var content;
  if(edt){
    tabla = document.getElementById("dettable1");
    content = document.getElementById("detdata1");
  }else{
    tabla = document.getElementById("dettable");
    content = document.getElementById("detdata");
  }

  var n = tabla.rows.length;

  var add ;
  if(edt){
    add= "<tr>"+
    "<td><select onchange='selector(this.id,0,1);' aria-placeholder='seleccione los productos de la venta' class='form-control' onmouseover=\"cargardatos(this.id, ";
  }else{
    add= "<tr>"+
  "<td><select onchange='selector(this.id);' aria-placeholder='seleccione los productos de la venta' class='form-control' onmouseover=\"cargardatos(this.id, ";
  }
  
  if(Foto==1){
    add+= "'Foto'";
  }else{
    add+= "'Productos'";
  }
  if(edt){
    add+=  ",'nombre',0,0,1);\" name='detalle' id='d5"+n+"'>"+
    "    </select>"+
      "</td>"+
      "<td>"+
        "<input onchange='selector(this.id,0,1);' class='form-control' value='1' id='c5"+n+"' type='number' min='1'>"+
      "</td>"+
      "<td><input class='form-control' id='p5"+n+"' readonly type='number' placeholder='$' ></td>"+
      "<td><input class='form-control' id='s5"+n+"' readonly type='number' placeholder='$' ></td>"+
    "</tr>";
  }else{
      add+=  ",'nombre',0,0,1);\" name='detalle' id='d"+n+"'>"+
"    </select>"+
  "</td>"+
  "<td>"+
    "<input onchange='selector(this.id);' class='form-control' value='1' id='c"+n+"' type='number' min='1'>"+
  "</td>"+
  "<td><input class='form-control' id='p"+n+"' readonly type='number' placeholder='$' ></td>"+
  "<td><input class='form-control' id='s"+n+"' readonly type='number' placeholder='$' ></td>"+
"</tr>";
  }

content.innerHTML +=add;
}
function total(edt=0){
  var tabla ;
  if(edt){
    tabla= document.getElementById("dettable1");
  }else{
    tabla= document.getElementById("dettable");
  }
  
  var n = tabla.rows.length;
  var suma=0;
  for(var i=1;i<n;i++){
    if(edt){
      suma+= parseFloat(obtener("s5"+i));
    }else{
      suma+= parseFloat(obtener("s"+i));
    }
    
  }
  if(edt){
    document.getElementById("total1").value = suma;
  }else{
    document.getElementById("total").value = suma;
  }
  
}
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//-----------------------------------------------------------------------------IMPRIMIR
function imp(id="datatable",f=0,foto=0){
  var titulo;
  if(f){
    titulo = "<h1 class='text-center'> RAF, SA de CV </h1><br><h3 class='text-center'>SUCURSAL METROCENTRO SAN MIGUEL</h3><br>"
    var numerofactura = id.substring(4);
    var fecha=obtener("fecha");
    var total=obtener("total");
    var vendedor="<b>";
    var cliente="<b>";
    
    var detalle = "<table class='table'><thead ><tr><th style:'width: 60%;' class='text-left'>";
    if(foto){
      titulo+="<h4>Estudio de Fotografia</h4>";
      detalle+="Paquete de Fotografia";
    }else{
      titulo+="<h4>Venta de Articulos Electronicos y Accesorios</h4>";
      detalle+="Articulo";
    }
    
    detalle+="</th><th style:'width: 10%;' class='text-center'>Cantidad</th><th style:'width: 15%;' class='text-center'>Tarifa</th><th style:'width: 15%;' class='text-right'>Subtotal</th></tr> </thead><tbody>";
    var n = document.getElementById("dettable").rows.length;
    var det = "";
    var detax ;
    for(var j =1;j<n;j++){
      console.log("producto N "+j);
      detalle+="<tr><td class='text-left'>";
      detax = document.getElementById("d"+j).options.selectedIndex;
      det= document.getElementById("d"+j).options.item(detax).text;
      detalle+=det+"</td><td class='text-center'>"+obtener("c"+j)+"</td>";
      detalle+="<td class='text-center'>$"+obtener("p"+j)+"</td>";
      detalle+="<td class='text-right'>$"+obtener("s"+j)+"</td>";
    }
    detax = document.getElementById("vendedor").options.selectedIndex;
    vendedor += document.getElementById("vendedor").options.item(detax).text+"</b>";
    detax = document.getElementById("cliente").options.selectedIndex;
    cliente += document.getElementById("cliente").options.item(detax).text+"</b>";
    detalle+=" </tbody><tfoot><tr><td></td><td></td><td class='text-center'><b>TOTAL:</b></td><td class='text-right'><b>$"+total+"</b></td></tr> </tfoot></table>"
    var ordenar = "<table class='table'><thead> <tr> <th>Cajero</th> <th>Cliente</th> </tr> </thead><tbody>";
    ordenar+="<tr><td class='text-center'>"+vendedor+"</td>";
    ordenar+="<td class='text-center'>"+cliente+"</td>";
    ordenar+="</tbody></table>";
  }
  var mywindow = window.open('', 'PRINT', 'height=400,width=600');
  mywindow.document.write('<html><head>');
mywindow.document.write("  <script src='assets/js/funciones.js'></script> <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700,200' rel='stylesheet' /> <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.7.1/css/all.css' integrity='sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr' crossorigin='anonymous'> <link href='assets/demo/demo.css' rel='stylesheet' /> <link href='assets/css/bootstrap.min.css' rel='stylesheet' /> <link href='assets/css/now-ui-dashboard.css?v=1.3.0' rel='stylesheet' />");
  mywindow.document.write("</head><body onload='pr(window);'> <div class='wrapper'>");
  if(f){
    mywindow.document.write(fecha+"<div style='text-align:right;'><b>"+"FACTURA N°: "+numerofactura+"</b></div><br>"+titulo);
    mywindow.document.write("<br> "+ordenar);
    mywindow.document.write("<br>"+detalle);
   // mywindow.document.write("<footer class='footer'>Total a Pagar: $"+total);
    
  }else{
    mywindow.document.write(document.getElementById(id).innerHTML);
  }
  
  mywindow.document.write('</div></body></html>');
  mywindow.document.close(); // necesario para IE >= 10
  mywindow.focus(); // necesario para IE >= 10
 // 
  //mywindow.print();
 // mywindow.close();
  
  //return true;
}

function pr(ll){
  ll.print();
  ll.close();
}


//----------------------------------------------------------------------------SESIONES--------------------------------------
const clave = window.localStorage;
//"D:/works/0/2019/TSI/ProyectoRAF/";
const base = "https://ezio2220.github.io/ProyectoRAF/";

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
  if(clave.getItem('active')==null){
    nowuiDashboard.showNotification('top','center',"<b>Debe iniciar sesion!</b>","danger",1000);
      setTimeout(function(){window.location.href = base+'login/index.html';},1000);
  }else{
      var db = firebase.database().ref("Usuarios");
      db.once('value',function(snap){
        var aux = snap.val();
        for(var data in aux){
          if(data==clave.getItem('active')){
            if(aux[data].Estado==0){
              clave.removeItem('active');
              nowuiDashboard.showNotification('top','center',"<b>Se Cerro la Sesion en otro Dispositivo!</b>","danger",1000);
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
        nowuiDashboard.showNotification('top','center',"<b>Bienvenido ADMIN!</b>","success",1000);
       // document.getElementsByClassName("adm")
        document.head.innerHTML= document.head.innerHTML+"<style> .adm{ display:unset;} </style>"
      }else{
        nowuiDashboard.showNotification('top','center',"<b>Bienvenido!</b>","success",1000);
      }
     
  }
}
function solonumeros(e){
  var key = e.keyCod || e.which;
  var teclado = String.fromCharCode(key);
  var numero="0-1-2-3-4-5-6-7-8-9";
  var especiales = "8-37-38-46";
  var tecladoS = false;

  for (var i in especiales) {
    if (key==especiales[i]) {
      tecladoS=true;
    }
  }
  if (numero.indexOf(teclado)==-1 && !tecladoS) {
    return false;
  }
}