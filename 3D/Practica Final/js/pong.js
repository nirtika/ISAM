//movimiento de la bola
   var stepX = 0;
   var stepY = 0;
   var player_CPU;
   var player_User;
   var score_CPU=0;
   var score_Player=0;
   var winner ="";
   var velocity;
   var player_num =1;
   var level = 1;


    function init() {
      var scene = new THREE.Scene();
      var sceneWidth = window.innerWidth-20;
      var sceneHeight = window.innerHeight-20;
      // responsive design (funciona mas o menos)
      window.addEventListener( 'resize', function() {
          camera.aspect = sceneWidth / sceneHeight;
          camera.updateProjectionMatrix();

          renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
      });

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
       	/*var background = new Array('img/background.jpg','img/background2.jpg');
       	var i = Math.floor(Math.random()*background.length);
        if(i > background.length-1) {i = 0;}*/
        var background = 'img/background.jpg';
        new THREE.TextureLoader().load(background, function(imgfondo) {
          scene.background = imgfondo;
        });

      var leftBorder = getBorder("left", 1, 20, 3, -5, 0, 0);
      var rightBorder = getBorder("right", 1, 20, 3, 5, 0, 0);
      player_CPU = getBorder("top", 3, 1, 2, 0, 9, 0);
      player_User = getBorder("down", 3, 1, 2, 0, -10, 0);
      var sphere = getSphere();
      var floor = getFloor();

      scene.add(leftBorder);
      scene.add(rightBorder);
      scene.add(player_CPU);
      scene.add(player_User);
      scene.add(sphere);
      scene.add(floor);

      getLight(scene);
      readOptions(scene);
      showText(scene);
      countScore(sphere,scene);
      showScore(sphere,scene);

      var borders = [ leftBorder, rightBorder, player_CPU, player_User ];

      animate(sphere, borders, renderer, scene, camera);

      //leer teclado
      document.onkeydown = function(ev) {
           switch (ev.keyCode) {
             case 37: // Left
               if(player_User.position.x > -3){
                 player_User.position.x -= 0.35;
               }
             break;
             case 39: // Right
               if(player_User.position.x < 3){
                  player_User.position.x += 0.35;
               }
              break;
              case 32: //space
                startGame();
                resetScore(scene);
                resetPosition(scene);
              break;
              case 65: // key A
              if (player_num==2 && player_CPU.position.x > -3) {
                player_CPU.position.x -= 0.35;
              }
              break;
              case 68: //key D
              if (player_num==2 &&player_CPU.position.x < 3) {
                 player_CPU.position.x += 0.35;
               }
              break;
           }
      }

   }

    //start game
    function startGame(){
       if (level == 1) {
         if (player_User.position.x < 1 || player_CPU.position.x <1){
           stepX=0.20;
           stepY=0.18;
         } else if (player_User.position.x > 1 || player_CPU.position.x >1) {
           stepX=0.30;
           stepY=0.25;
         }
      } else if (level == 2) {
          if (player_User.position.x < 1 || player_CPU.position.x <1){
           stepX=0.20;
           stepY=0.18;
         } else if (player_User.position.x > 1 || player_CPU.position.x >1) {
           stepX=0.25;
           stepY=0.23;
          }
      }else if (level == 3) {
          if (player_User.position.x < 1 || player_CPU.position.x <1){
           stepX=0.25;
           stepY=0.13;
         } else if (player_User.position.x > 1 || player_CPU.position.x >1) {
           stepX=0.30;
           stepY=0.28;
          }
       }
    }

    //read and set Level
    function setLevel(){
      var player_level=document.getElementById("Level");
      level = player_level.options[player_level.selectedIndex].value;
    }

    //read options
    function readOptions(scene){
     var button_play = document.getElementById( "Play" );
     var button_1player = document.getElementById( "1player" );
     var button_2players = document.getElementById( "2players" );
     button_play.addEventListener("click", function(){
       button_play.classList.add('button-clicked');
         startGame();
         resetScore(scene);
         resetPosition(scene);
     });

     button_1player.addEventListener("click", function(){
       button_2players.classList.remove('button-clicked');
       button_1player.classList.add('button-clicked');
       player_num=1;
       stepX = 0;
       stepY = 0;
       player_CPU.position.x=0.0;
       player_User.position.x=0.0;
       resetScore(scene);
     });

     button_2players.addEventListener("click", function(){
       button_1player.classList.remove('button-clicked');
       button_2players.classList.add('button-clicked');
       player_num =2;
       stepX = 0;
       stepY = 0;
       player_CPU.position.x=0.0;
       player_User.position.x=0.0;
       resetScore(scene);
     });
    }

   // show title and instruction text
    function showText(scene){
     var load_font = new THREE.FontLoader();
     var title_text= 'Juego de Pong';
     var instruction_text = "[ SPACE ] para empezar a jugar. \n\nPara mover: [ izquierda ] y [ derecha ] , [ A ] y [ D ] (Modo: 2 jugadores)";

     load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
        var textGeo_titulo = new THREE.TextGeometry( title_text, {
              font: font,
              size: 3.5,
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
          mesh.position.set(-15, 25,6.5);
          mesh.rotation.x = -5;
          scene.add( mesh );

          var textGeo_inst = new THREE.TextGeometry( instruction_text, {
            font: font,
            size: 1,
            height: 0,
            curveSegments: 5,
            bevelEnabled: false,
            bevelThickness: 0.04,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3
          } );
            var textMaterial2 = new THREE.MeshBasicMaterial();
            var mesh2 = new THREE.Mesh( textGeo_inst, textMaterial2 );
            mesh2.position.set(-15, 20, 5);
            mesh2.rotation.x = -5.5;
            scene.add( mesh2 );
      });
    }

   // mostrat puntos en la pantalla
    function showScore(name,scene){
     var load_font = new THREE.FontLoader();
     if (player_num==1) {
       var player_text = "Jugador : "+ score_Player + "\n\n Pc : "+ score_CPU;
     } else if (player_num==2) {
       var player_text = "Jugador1 : "+ score_Player + "\n\nJugador2 : "+ score_CPU;
     }

     load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
          var selectObject = scene.getObjectByName("cont_puntos");
          if(selectObject){
            scene.remove(selectObject);
          }
          var textGeo_Puntos = new THREE.TextGeometry(player_text , {
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
          mesh.position.set(-26, 7, 0);
          mesh.rotation.x = -5.5;
          mesh.name = "cont_puntos";
          scene.add( mesh );
     });

   }

    function animate(sphere, borders, renderer, scene, camera) {
      checkCollision(sphere, borders);

      sphere.position.x += (stepX * velocity);
      sphere.position.y += (stepY * velocity);

      if (player_num ==1) {
        //movimiento auto del cpu
          if (player_CPU.position.x < 3.5 || player_CPU.position.x > -3.5) {
            if (level==1) {
              player_CPU.position.x = (0.1-(sphere.position.x*0.68));
            }else if (level==2) {
              player_CPU.position.x =(0.1-(sphere.position.x*0.63));
            }else if (level==3) {
              player_CPU.position.x =(0.1+(sphere.position.x*0.55));
            }
          }
      }
      countScore(sphere,scene);
      showScore("Puntos",scene);

      renderer.render(scene, camera);

      requestAnimationFrame(function() {
        animate(sphere, borders, renderer, scene, camera);
      });
    }

    function getLight(scene) {
      var light = new THREE.DirectionalLight(0xffffff,0.3);
      light.position.set(0, 10,8);
      light.castShadow = true;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 25;
      light.shadow.camera.left = -8;
      light.shadow.camera.right = 5;
      light.shadow.camera.top = 10;
      light.shadow.camera.bottom = -10;
      light.shadow.mapSize.width = 4096;
      light.shadow.mapSize.height = 4096;
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff,0.4));

        /*var light2 = new THREE.DirectionalLight(0xffffff,0.3);
        light2.position.set(0, -1,4);;
        light2.castShadow = true;
        scene.add(light2);*/
        //scene.add( new THREE.CameraHelper( light.shadow.camera ) );
    }

    function getSphere() {
      var geometry = new THREE.SphereGeometry(0.7, 20, 20);
       var texture = new THREE.TextureLoader().load("img/ball.jpg");
       var material = new THREE.MeshPhongMaterial({
          map : texture
       });
       var mesh = new THREE.Mesh(geometry, material);
       mesh.position.z =0.4;
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

    //floor texture
    function getWoodMaterial(borders) {
      var material = new THREE.MeshPhysicalMaterial();
      var button_texture = document.getElementById("change-texture");
      var arrary_Textures = ['img/board.jpg','img/board2.png','img/board3.png'];
      var newtexture =1;
       if(borders =='border'){
         var texture = new THREE.TextureLoader().load("img/border.jpg");
         material = new THREE.MeshPhongMaterial({
            map : texture
         });
       }
       if(borders =='suelo'){
         material.map = new THREE.TextureLoader().load(arrary_Textures[0]);
         button_texture.addEventListener("click", function() {
          material.map= new THREE.TextureLoader().load(arrary_Textures[newtexture] );
           newtexture++;
           if(newtexture > arrary_Textures.length-1) {
           newtexture = 0;
           }
          material.needsUpdate = true;
          material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
          material.map.repeat.set(1, 1);
       });
       }
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
              if (level == 1) {
                if (player_CPU.position.x < 1){
                  velocity = 0.90;
                } else if (player_CPU.position.x > 1) {
                    velocity = 1.15;
                }
              }else if (level == 2) {
                if (player_CPU.position.x < 1){
                  velocity = 0.95;
                } else if (player_CPU.position.x > 1) {
                    velocity = 1.10;
                }
              }else if (level == 3) {
                if (player_CPU.position.x < 1){
                  velocity = 1.0;
                } else if (player_CPU.position.x > 1) {
                    velocity = 1.5;
                }
              }

            }
            if(collisionResults[0].object.name == "down" ){
              stepY *= -1;
              if (level == 1) {
                if (player_User.position.x < 1){
                    velocity = 0.95;
                } else if (player_User.position.x > 1) {
                    velocity = 1.05;
                }
              }else if (level == 2) {
                if (player_User.position.x < 1){
                    velocity = 0.95;
                } else if (player_User.position.x > 1) {
                    velocity = 1.10;
                }
              }else if (level == 3) {
                if (player_User.position.x < 1){
                    velocity = 1.0;
                } else if (player_User.position.x > 1) {
                    velocity = 1.10;
                }
              }
            }
          }
      }
        //countScore(sphere);
    }

    //Contar los puntos
    function countScore(sphere,scene){
      if (sphere.position.y > player_CPU.position.y) {
         score_Player+=1;
         sphere.position.x= 0.0;
         sphere.position.y= 0.0;
         //console.log("punto jugador: "+score_Player);
         showScore("Puntos",scene);
         checkWinner(scene);
      }
      if (sphere.position.y < player_User.position.y) {
         score_CPU +=1;
         sphere.position.x= 0.0;
         sphere.position.y= 0.0;
        // console.log("punto PC: "+score_CPU);
          showScore("Puntos",scene);
          checkWinner(scene);
      }
    }

    //comprobar el winner
    function checkWinner(scene){
      if (score_CPU ==5) {
        if(player_num==1){
         winner="PC";
       }else if(player_num==2){
         winner="Jugador 2";
       }
         stepX=0;
         stepY=0;
         gameOver(name,scene);

      }
      if(score_Player ==5) {
        if(player_num==1){
         winner="Jugador";
        }else if(player_num==2){
         winner="Jugador 1";
        }
         stepX=0;
         stepY=0;
         gameOver(name, scene);
      }
    }

    //resetear los puntos a 0
    function resetScore(scene){
       score_CPU=0;
       score_Player =0;
       var selectObject = scene.getObjectByName("remove_winner_text");
       if(selectObject){
         scene.remove(selectObject);
       }
    }

    //volver los palos al centro
    function resetPosition(scene){
      player_CPU.position.x=0.0;
      player_User.position.x=0.0;
    }

    //Mostrar el winner
    function gameOver(name,scene){
       var load_font = new THREE.FontLoader();
       load_font.load( 'js/helvetiker_regular.typeface.json', function ( font ) {
          var textGeo_titulo = new THREE.TextGeometry( "!! Ganador : "+ winner +" !!", {
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
          mesh.name ="remove_winner_text";
          scene.add( mesh );
       });
       resetPosition(scene);
    }
