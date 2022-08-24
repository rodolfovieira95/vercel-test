import { Express } from "express";

export const notificationRoute = (app) => {
  app.get("/teste", function (req, res) {
    res.send(`<!DOCTYPE HTML>
      
          <html>
             <head>
                  <style>
                      .fade-in {
                          animation: fadeIn ease 4s;
                          -webkit-animation: fadeIn ease 4s;
                          -moz-animation: fadeIn ease 4s;
                          -o-animation: fadeIn ease 4s;
                          -ms-animation: fadeIn ease 4s;
                          }
                              @keyframes fadeIn {
                              0% {
                                  opacity:0;
                              }
                              100% {
                                  opacity:1;
                              }
                              }
      
                              @-moz-keyframes fadeIn {
                              0% {
                                  opacity:0;
                              }
                              100% {
                                  opacity:1;
                              }
                              }
      
                              @-webkit-keyframes fadeIn {
                              0% {
                                  opacity:0;
                              }
                              100% {
                                  opacity:1;
                              }
                              }
      
                              @-o-keyframes fadeIn {
                              0% {
                                  opacity:0;
                              }
                              100% {
                                  opacity:1;
                              }
                              }
      
                              @-ms-keyframes fadeIn {
                              0% {
                                  opacity:0;
                              }
                              100% {
                                  opacity:1;
                                  }
                              }
                              .fade-out {
                                  animation: fadeOut ease 2s;
                                  -webkit-animation: fadeOut ease 2s;
                                  -moz-animation: fadeOut ease 2s;
                                  -o-animation: fadeOut ease 2s;
                                  -ms-animation: fadeOut ease 2s;
                                  }
                                  @keyframes fadeOut {
                                  0% {
                                      opacity:1;
                                  }
                                  100% {
                                      opacity:0;
                                  }
                                  }
      
                                  @-moz-keyframes fadeOut {
                                  0% {
                                      opacity:1;
                                  }
                                  100% {
                                      opacity:0;
                                  }
                                  }
      
                                  @-webkit-keyframes fadeOut {
                                  0% {
                                      opacity:1;
                                  }
                                  100% {
                                      opacity:0;
                                  }
                                  }
      
                                  @-o-keyframes fadeOut {
                                  0% {
                                      opacity:1;
                                  }
                                  100% {
                                      opacity:0;
                                  }
                                  }
      
                                  @-ms-keyframes fadeOut {
                                  0% {
                                      opacity:1;
                                  }
                                  100% {
                                      opacity:0;
                                      }
                                  }
                  </style>
                <script type="text/javascript">
                   window.onload = function(){
                      const div = document.getElementById('teste')
                      const socket = new WebSocket('wss://localhost');
                      socket.onopen = function(event) {
                      };
      
                      socket.onerror = function(error) {
                          console.error('WebSocket error: ' + error);
                      };
      
                      socket.onmessage = function(event) {
                          const msg = event.data;
                          div.innerHTML = msg + '<div><img class="fade-in"src="https://img.ibxk.com.br/2021/06/09/09104542797072.gif" id="image" alt="gif" /></div>';
                          const image = document.getElementById('image');
                          setTimeout(function () {image.className = 'fade-out'}, 4000);
                          setTimeout(function () {div.innerHTML = '';}, 6000);
                          
                          
                      };
      
      
                   }
                </script>
              
             </head>
             
             <body>
                <img id = "sse">
                   <div id="teste" style="color: red"></div>
                </div>
                
             </body>
          </html>`);
  });
};
