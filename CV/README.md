<p align="center">
   <img src="https://github.com/jmezzera/UAIAVS/blob/WebInterface/GUI/src/Assets/Images/uaiavsBlackLogo.png?raw=true" width="180">
   <br/>
   Unmanned Aerial Intelligence Assisted Video System
</p>

## Módulo de _Computer Vision_
Contiene los siguientes elementos:
* **Jetson**: Carpeta en la que se encuentran todos los scripts que se ejecutan en el [NVIDIA Jetson Nano](https://developer.nvidia.com/embedded/jetson-nano-developer-kit) responsables de la detección del objetivo en tiempo real.
* **PC**: Carpeta que contiene los scripts auxiliares para el análisis de imágenes que se corrieron en PCs.
* _**ssd_graph.pb**_: Archivo de modelo o gráfico congelado utilizado para lograr la detección del jugador objetivo. Es la salida de entrenar un modelo ssd a partir de un dataset de imágenes tomadas sobre el prototipo.
