
window.requestAnimFrame = function () {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
cw = window.innerWidth,
ch = window.innerHeight,
fireworks = [],
particles = [],
hue = 120,
limiterTotal = 5,
limiterTick = 0,
timerTotal = 80,
timerTick = 0,
mousedown = false,
mx,
my;

canvas.width = cw;
canvas.height = ch;


function random(min, max) {
  return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
  var xDistance = p1x - p2x,
  yDistance = p1y - p2y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {
  this.x = sx;
  this.y = sy;
  this.sx = sx;
  this.sy = sy;
  this.tx = tx;
  this.ty = ty;
  this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
  this.distanceTraveled = 0;
  this.coordinates = [];
  this.coordinateCount = 3;
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  this.angle = Math.atan2(ty - sy, tx - sx);
  this.speed = 2;
  this.acceleration = 1.05;
  this.brightness = random(50, 70);
  this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);

  if (this.targetRadius < 8) {
    this.targetRadius += 0.3;
  } else {
    this.targetRadius = 1;
  }

  this.speed *= this.acceleration;

  var vx = Math.cos(this.angle) * this.speed,
  vy = Math.sin(this.angle) * this.speed;
  this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

  if (this.distanceTraveled >= this.distanceToTarget) {
    createParticles(this.tx, this.ty);
    fireworks.splice(index, 1);
  } else {
    this.x += vx;
    this.y += vy;
  }
};

Firework.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
  ctx.stroke();
};

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.coordinates = [];
  this.coordinateCount = 5;
  while (this.coordinateCount--) {
    this.coordinates.push([this.x, this.y]);
  }
  this.angle = random(0, Math.PI * 2);
  this.speed = random(1, 10);
  this.friction = 0.95;
  this.gravity = 1;
  this.hue = random(hue - 20, hue + 20);
  this.brightness = random(50, 80);
  this.alpha = 1;
  this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function (index) {
  this.coordinates.pop();
  this.coordinates.unshift([this.x, this.y]);
  this.speed *= this.friction;
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed + this.gravity;
  this.alpha -= this.decay;

  if (this.alpha <= this.decay) {
    particles.splice(index, 1);
  }
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
  ctx.lineTo(this.x, this.y);
  ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
  ctx.stroke();
};

function createParticles(x, y) {
  var particleCount = 30;
  while (particleCount--) {
    particles.push(new Particle(x, y));
  }
}

function loop() {
  requestAnimFrame(loop);

  hue += 0.5;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, cw, ch);
  ctx.globalCompositeOperation = 'lighter';

  var i = fireworks.length;
  while (i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  var i = particles.length;
  while (i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  if (timerTick >= timerTotal) {
    if (!mousedown) {
      fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
      timerTick = 0;
    }
  } else {
    timerTick++;
  }

  if (limiterTick >= limiterTotal) {
    if (mousedown) {
      fireworks.push(new Firework(cw / 2, ch, mx, my));
      limiterTick = 0;
    }
  } else {
    limiterTick++;
  }
}


function reveal() {

  loop();

  var w, h;
  if (window.innerWidth >= 1000) {
    w = 295;h = 185;
  } else
  {
    w = 255;h = 155;
  }


  
}
var isFlameOff = false;



function loadVideo() {
  // ID del video de YouTube
  var videoId = 'RaeLAwacDG4'; // Cambia 'VIDEO_ID' por el ID del video de YouTube

  // URL del video de YouTube con el parámetro 'modestbranding=1' para ocultar el logo de YouTube
  var url = 'https://www.youtube.com/embed/' + videoId + '?modestbranding=1&autoplay=1&controls=0&showinfo=0&rel=0';

  // Crear el elemento iframe
  var iframe = document.createElement('iframe');
  iframe.width = '560'; // Ancho del video
  iframe.height = '315'; // Altura del video
  iframe.frameborder = '0';
  iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowfullscreen = true;
  iframe.src = url;

  // Obtener el contenedor del video
  var videoContainer = document.getElementById('videoContainer');

  // Limpiar el contenedor antes de agregar el nuevo video
  videoContainer.innerHTML = '';

  // Agregar el iframe al contenedor
  videoContainer.appendChild(iframe);
}
$(document).ready(function() {
  var merrywrap = document.getElementById("merrywrap");
  var box = merrywrap.getElementsByClassName("giftbox")[0];
  var step = 1;
  var stepMinutes = [2000, 1000, 1000, 1000];
  function init() {
    box.addEventListener("click", openBox, false);
  }
  function stepClass(step) {
    merrywrap.className = 'merrywrap';
    merrywrap.className = 'merrywrap step-' + step;
  }
  function openBox() {
    if (step === 1) {
      box.removeEventListener("click", openBox, false);
    }
    stepClass(step);
    if (step === 3) {
       document.querySelector('.blowCandle').style.display = 'block';
        document.querySelector('.merrywrap').style.background = 'radial-gradient(circle, rgba(250, 250, 200,1) 0%, rgba(35, 102, 186,1) 35%, rgba(10, 10, 20,1) 85%)';


       reveal();

      return;
    }
    setTimeout(openBox, stepMinutes[step - 1]);
    step++;
  }

  init();
            var audioContext;

            function initAudioContext() {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                var analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                var dataArray = new Uint8Array(analyser.frequencyBinCount);

                navigator.mediaDevices.getUserMedia({audio: true})
                .then(function(stream) {
                    var microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);

                    function checkAudioThreshold() {
                        analyser.getByteFrequencyData(dataArray);
                        var volume = 0;
                        for (var i = 0; i < dataArray.length; i++) {
                            volume += dataArray[i];
                        }
                        volume /= dataArray.length;

                        var threshold = 200;
                        console.log(volume)
                        if (volume > threshold) {
                            flameOff();
                            document.querySelector('.merrywrap').style.background = '';

                            document.querySelector('.merrywrap').style.backgroundColor = 'transparent';
                            isFlameOff=true;

                        }
                        if (!isFlameOff) {
                            requestAnimationFrame(checkAudioThreshold);
                        }
                    }

                    checkAudioThreshold();
                })
                .catch(function(err) {
                    console.log('El micrófono no pudo ser accedido.', err);
                });
            }

            $('#startAudio').on('click', function() {
                initAudioContext();
                $(this).prop('disabled', true);
            });

            function flameOff() {
                var flame = $("#flame");
                var txt = $("h1");

                flame.removeClass("burn").addClass("puff");
                $(".smoke").each(function () {
                    $(this).addClass("puff-bubble");
                });
                $("#glow").remove();
                txt.hide().html("Your wish will come true!").delay(750).fadeIn(300);

                var friendName = getParameterByName('name');
                if (friendName === null) {
                    friendName = '';
                }else {
                    friendName = friendName.charAt(0).toUpperCase() + friendName.slice(1);
                }
                var imgMinions = $("<img>").attr("src", "images/minion.gif");
                var imgOlaf = $("<img>").attr("src", "images/olaf.gif");

                setTimeout(function() {

                    txt.hide();
                    txt.html("Happy Birthday " + "<br>" + friendName + "!<br>");
                    loadVideo();

                    txt.delay(750).fadeIn(300);
                    document.querySelector('.candle').style.display = 'none';

                    setTimeout(function() {
                      var video = document.getElementById('videoContainer');
                      if (video) {
                          video.remove(); // Eliminar el iframe del DOM
                      }    
                    }, 41500);
                    setTimeout(function() {
                        txt.append(imgOlaf);
                    }, 42000);
                    setTimeout(function() {
                        txt.hide();
                        txt.html("<br><br><br>Have a nice day :)");
                        txt.delay(750).fadeIn(300);

                    }, 45000);
                }, 7000);


                $("#candle").animate(
                    {
                        opacity: ".5"
                    },
                    100
                );
            }
        });

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
