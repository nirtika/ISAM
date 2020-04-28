//movimiento de la bola
   var stepX = 0;
   var stepY = 0;
   //var scene;
   var jugador_CPU ;
   var jugador_Usuario ;
   var punto_pc=0;
   var punto_jugador=0;
   var ganador ="" ;

   //empezar juego
   function startGame(){
     stepX = 0.15;
     stepY = 0.20;

   }

   function init() {

      var scene = new THREE.Scene();
      var sceneWidth = window.innerWidth -20;
      var sceneHeight = window.innerHeight -120;

      var camera = new THREE.PerspectiveCamera(100, sceneWidth / sceneHeight, 0.5, 1000);
      camera.position.set(0, -10, 15);
      camera.lookAt(scene.position);

      var renderer = new THREE.WebGLRenderer({
         antialias : true,
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(sceneWidth, sceneHeight);
      document.body.appendChild(renderer.domElement);

       //function fondo de pantalla random() {
       	/*var background = new Array('img/back.png','img/back1.jpg','img/back2.jpg','img/back3.jpg');
       	var i = parseInt(Math.random()*background.length);*/
       //	background.src = background[i];
        new THREE.TextureLoader().load('img/background.jpg', function(imgfondo) {
           scene.background = imgfondo;
        });


      var leftBorder = getBorder("left", 1, 20, 3, -5, 0, 0);
      var rightBorder = getBorder("right", 1, 20, 3, 5, 0, 0);
      jugador_CPU = getBorder("top", 3, 1, 2, 1, 8, 1);
      jugador_Usuario = getBorder("down", 3, 1, 2, 1, -10, 1.5);
      var sphere = getSphere();
      var light = getLight();
      var floor = getFloor();

      scene.add(light);
      scene.add(leftBorder);
      scene.add(rightBorder);
      scene.add(jugador_CPU);
      scene.add(jugador_Usuario);
      scene.add(sphere);
      scene.add(floor);
      mostrarTitulo(scene);
      contarPuntos(sphere,scene);
      mostrarPuntos(sphere,scene);


      var borders = [ leftBorder, rightBorder, jugador_CPU, jugador_Usuario ];

      animate(sphere, borders, renderer, scene, camera);


      document.getElementById("Play").addEventListener("click", function(){
          startGame();
          resetPuntos(scene);
      });

      //leer teclado
      document.onkeydown = function(ev) {
           switch (ev.keyCode) {
             case 37: // Left
               if(jugador_Usuario.position.x > -4){
                 jugador_Usuario.position.x -= 0.15;
                 //console.log(jugador_Usuario.position.x);
               }
             break;
             case 39: // Right
               if(jugador_Usuario.position.x < 4){
                  jugador_Usuario.position.x += 0.15;
                // console.log(jugador_Usuario.position.x);
               }
              break;
              case 32: //espacio
                startGame();
                resetPuntos(scene);
              break;
           }
      }
   }

   function mostrarTitulo(scene){
     var load_font = new THREE.FontLoader();
     var text= 'Juego de Pong';
     load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
        var textGeo_titulo = new THREE.TextGeometry( text, {
              font: font,
              size: 4,
              height: 1,
              curveSegments: 5,
              bevelEnabled: false,
              bevelThickness: 0.04,
              bevelSize: 0.05,
              bevelOffset: 0,
              bevelSegments: 3
          } );
          var textMaterial = new THREE.MeshNormalMaterial();
          var mesh = new THREE.Mesh( textGeo_titulo, textMaterial );
          mesh.position.set(-15, 25, 4);
          mesh.rotation.x = -5;
          scene.add( mesh );
     });
 }

   // mostrar puntos en la pantalla
   function mostrarPuntos(name,scene){
     var load_font = new THREE.FontLoader();
     load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
          var selectObject = scene.getObjectByName("cont_puntos");
          if(selectObject){
            scene.remove(selectObject);
          }
          var textGeo_Puntos = new THREE.TextGeometry( 'Jugador : '+ punto_jugador + '\n \n Pc : '+ punto_pc, {
              font: font,
              size: 2,
              height: 0,
              curveSegments: 5,
              bevelEnabled: false,
              bevelThickness: 0.04,
              bevelSize: 0.05,
              bevelOffset: 0,
               bevelSegments: 3
          });
          var textMaterial = new THREE.MeshNormalMaterial();
          var mesh = new THREE.Mesh( textGeo_Puntos, textMaterial );
          mesh.position.set(-25, 12, 0);
          mesh.rotation.x = -5.5;
          mesh.name = "cont_puntos";
          scene.add( mesh );
     });

   }

    function animate(sphere, borders, renderer, scene, camera) {
        checkCollision(sphere, borders);

      sphere.position.x += stepX;
      sphere.position.y += stepY;
      jugador_CPU.position.x = sphere.position.x  ; //movimiento auto del cpu
      mostrarPuntos("Puntos",scene);
      contarPuntos(sphere,scene);

      renderer.render(scene, camera);

      requestAnimationFrame(function() {
        animate(sphere, borders, renderer, scene, camera);
      });
    }


    function getLight() {
      var light = new THREE.DirectionalLight();
      light.position.set(4,4,4);
      light.castShadow = true;
      light.shadow.camera.near = 0;
      light.shadow.camera.far = 16;
      light.shadow.camera.left = -8;
      light.shadow.camera.right = 5;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      return light;
    }

    function getSphere() {
      var geometry = new THREE.SphereGeometry(0.8, 20, 20);
       var texture = new THREE.TextureLoader().load("img/ball.jpg");
       var material = new THREE.MeshPhysicalMaterial({
          map : texture
       });
       var mesh = new THREE.Mesh(geometry, material);
       mesh.position.z =0 ;
       mesh.castShadow = true;
       mesh.name = "sphere";
       return mesh;
    }

    function getFloor() {
      var geometry = new THREE.PlaneGeometry(10, 20);
      var mesh = new THREE.Mesh(geometry, getWoodMaterial('suelo'));
      mesh.receiveShadow = true;
      return mesh;
    }

    function getBorder(name, x, y, z, posX, posY, posZ) {
      var geometry = new THREE.BoxGeometry(x, y, z);
      var mesh = new THREE.Mesh(geometry, getWoodMaterial('border'));
      mesh.receiveShadow = true;
      mesh.position.set(posX, posY, posZ);
      mesh.name = name;
      return mesh;
    }

    function getWoodMaterial(borders) {
       if(borders =='border'){
         var texture = new THREE.TextureLoader().load("img/border.jpg");
       }else{
         var texture = new THREE.TextureLoader().load("img/board.jpg");
       }
        //var texture = new THREE.TextureLoader().load("board.jpg");
        var material = new THREE.MeshPhysicalMaterial({
           map : texture
        });
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(1, 1);
        material.side = THREE.DoubleSide;

        return material;
    }

    //Comprobar Collision
    function checkCollision(sphere, borders) {
      var originPosition = sphere.position.clone();

      for (var i = 0; i < sphere.geometry.vertices.length; i++) {
         var localVertex = sphere.geometry.vertices[i].clone();
         var globalVertex = localVertex.applyMatrix4(sphere.matrix);
         var directionVector = globalVertex.sub(sphere.position);
         var ray = new THREE.Raycaster(originPosition, directionVector.clone().normalize());
         var collisionResults = ray.intersectObjects(borders);
         if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            // Collision detected
            if (collisionResults[0].object.name == "left" || collisionResults[0].object.name == "right") {
              stepX *= -1 ;
            }
            if(collisionResults[0].object.name == "top") {
              stepY *= -1;
            }
            if (collisionResults[0].object.name == "down" ){
              stepY *= -1;

            }
          }
      }
        //contarPuntos(sphere);
    }

    //Contar los puntos
    function contarPuntos(sphere,scene){
      if (sphere.position.y > jugador_CPU.position.y) {
         punto_jugador+=1;
         sphere.position.x= 0.0;
         sphere.position.y= 0.0;
         //console.log("punto jugador: "+punto_jugador);
         mostrarPuntos("Puntos",scene);
         checkWinner(scene);
      }
      if (sphere.position.y < jugador_Usuario.position.y) {
         punto_pc +=1;
         sphere.position.x= 0.0;
         sphere.position.y= 0.0;
        // console.log("punto PC: "+punto_pc);
          mostrarPuntos("Puntos",scene);
          checkWinner(scene);
      }
    }

    //comprobar el ganador
    function checkWinner(scene){
      if (punto_pc ==5) {
         ganador="PC";
         stepX=0;
         stepY=0;
         gameOver(name,scene);
      }
      if(punto_jugador ==5) {
         ganador="Jugador";
         stepX=0;
         stepY=0;
         gameOver(name, scene);
      }
    }

    //resetear los puntos a 0
    function resetPuntos(scene){
       punto_pc=0;
       punto_jugador =0;

       var selectObject = scene.getObjectByName("quitar_texto_ganador");
       if(selectObject){
         scene.remove(selectObject);
       }
    }

    function resetPosition(scene){
       var selectObject = scene.getObjectByName("top");
       if(selectObject){
         scene.remove(selectObject);
       }
       var selectObject2 = scene.getObjectByName("down");
       if(selectObject2){
         scene.remove(selectObject2);
       }
    }
    //Mostrar el ganador
    function gameOver(name,scene){
       var load_font = new THREE.FontLoader();
       load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
          var textGeo_titulo = new THREE.TextGeometry( "!! Ganador : "+ ganador +" !!", {
              font: font,
              size: 1.5,
              height: 0,
              curveSegments: 0.5,
              bevelEnabled: false,
              bevelThickness: 0.04,
              bevelSize: 0.05,
              bevelOffset: 0,
              bevelSegments: 3
          });
          var textMaterial = new THREE.MeshBasicMaterial();
          var mesh = new THREE.Mesh( textGeo_titulo, textMaterial );
          mesh.position.set(-8, -13, 0);
          mesh.name ="quitar_texto_ganador";
          scene.add( mesh );
       });
//resetPosition(scene);
    }
