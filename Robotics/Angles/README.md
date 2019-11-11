# Angles
Módulo encargado del manejo de un conjunto de servos mediante una API HTTP. 

## Uso
El paquete expone los siguientes _endpoints_:
* `GET` `/servos`:

    Devuelve la lista de servos registrados en el sistema

* `POST` `/servos`:

    Registra un nuevo servo, iniciándolo con un ángulo de `zero`. En caso de omitirse, su valor por defecto es 0. 
    Recibe en el _body_ de la petición un objeto _json_ con los siguientes atributos:
    ```json
    "name": "Ejemplo",
    "pin": 10,
    "zero": 90
    ```
    Devuelve el servo creado.
* `POST` `/servos/:servo`:

    Mueve el servo con el nombre `servo` al ángulo pasado en el cuerpo de la petición, bajo el nombre `angle`.
    Devuelve un estado de 200 si la solicitud se hizo correctamente o un 404 si no se encuentra un servo con el nombre pasado.

* `PATCH` `/servos/:servo`:

    Mueve el servo con el nombre `servo` el ángulo pasado en el cuerpo de la petición, bajo el nombre `angle`.
    Devuelve un estado de 200 si la solicitud se hizo correctamente o un 404 si no se encuentra un servo con el nombre pasado.