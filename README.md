<p align="center">
   <img src="https://github.com/jmezzera/UAIAVS/blob/WebInterface/GUI/src/Assets/Images/uaiavsBlackLogo.png?raw=true" width="180">
   <br/>
   Unmanned Aerial Intelligence Assisted Video System
</p>

# Tesis
Repositorio de UAIAVS, proyecto final de carrera de Ingeniería Telemática para la Universidad de Montevideo.

## Autores
* Natalia Invernizzi
* Juan Andrés Mezzera
* Adolfo Scalabrini

## Descripción del proyecto
UAIAVS es un sistema de posicionamiento de una cámara capaz de seguir a un jugador de fútbol durante un entrenamiento de forma inteligente y autónoma, así como también de ser controlado manualmente. 

La solución se divide en dos grandes módulos que pueden considerarse independientes. En primer lugar, se cuenta con una estructura que consta de cuatro (4) postes, una (1) cámara y un sistema conformado por poleas, cables y motores para permitir el movimiento de este dispositivo en tres dimensiones sobre el espacio definido por los mencionados postes. A su vez, la cámara estará acompañada por un segundo sistema de motores que le facilitará girar 180° en el plano horizontal y 90° en el vertical. 

Esta estructura será manejada mediante un control, de manera de dar la opción de colocar y redirigir la cámara en puntos a elección de forma manual.  

Además, se contará con una opción de _tracking_ o seguimiento: dado un jugador, la cámara lo seguirá automáticamente a través de análisis de imágenes. Así, podrán monitorearse los movimientos de dicho jugador durante cada entrenamiento. Esta funcionalidad se alcanza aplicando algoritmos de inteligencia artificial para lograr la capacidad de detectar y seguir al jugador, en particular, reentrenando un modelo SSD. Este módulo tiene como resultado hacia qué dirección debe moverse la cámara sobre la estructura del primer módulo descrito. 

## Estructura del repositorio
 * **Core:** Carpeta donde se encuentran los archivos relacionados al núcleo del sistema. Incluye backend de la GUI.
 * **CV:** Carpeta que contiene todos los scripts encargados de realizar el análisis de imágenes del sistema.
   * **Jetson**: Agrupa todos los scripts que se ejecutan en el [NVIDIA Jetson Nano](https://developer.nvidia.com/embedded/jetson-nano-developer-kit) responsables de la detección del objetivo en tiempo real.
   * **PC**: Contiene scripts auxiliares para el análisis de imágenes que se corrieron en PCs.
 * **GUI:** Carpeta en la que se guardan los componentes asociados al control de la interfaz de usuario, tanto la GUI como el control remoto de la estructura.
 * **Robotics:** Carpeta que presenta todos los scripts utilizados para el control de la estructura robótica del proyecto.
   * **Angles:** Aquì se ubica los scripts que manejan el movimiento de los servos encargados de la rotación de la cámara en los planos vertical y horizontal.
   * **Position:** Agrupa el código relacionado al movimiento de los cuatro motores de la estructura robótica responsables del movimiento de la cámara en el espacio. 
   * **Requests:** 
