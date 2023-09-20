# tgtgSecAPI

Ce code va permettre de realiser quelques tâches lié à TooGoodToGo via API.
Vous pouvez reprendre l'exemple et ajouter d'autre route si cela vous interesse.
Exposition de l'api en wan possible grâce à la whitelist + sécurité crowdsec

## Too Good To Go Api with FASTAPI.

### Génération de token de connexion tgtg

```pip install tgtg```
```
from tgtg import TgtgClient

client = TgtgClient(email="<your_email>")
credentials = client.get_credentials()
print(credentials)
```

Nécessaire pour le fichier de variable d'environnement :)

Pour plus d'aide : https://github.com/ahivert/tgtg-python

## Utilisation seule de FASTAPI

Pour cela il suffit d'avoir les fichiers/dossier suivant : 

- Dockerfile dans la base du dossier
- .env_fastapi-example à renommer en .env_fastapi
- Dossier app

L'utilisation de mongodb cloud l'offre gratuite est utiliser. (https://cloud.mongodb.com/) 
Vous pouvez commenter le code concernant la DB ou utiliser un autre fournisseur.

Modifier dans le fichier cron.sh la variable 'NTFY_URL'

Une fois toutes les conditions réuni :

```sudo docker build -t local/python-api .```

Remplir le fichier env et utiliser le fichier docker-compose.yml comme exemple pour les arguments de lancement.

## Construction du front 

il suffit de rentrer dans le dossier front-api

```cd front-api/```

Ensuite il faut build l'image docker

```
sudo docker build -t local/front-api .
```

## Configuration de crowdsec

**Sur la machine qui héberge crowdsec voici les commandes à insérer :**

```sudo mkdir /var/log/crowdsec; sudo chown -R $USER:$USER /var/log/crowdsec ```

```sudo mkdir /opt/appdata/crowdsec```

```sudo docker compose up -d crowdsec```

ou

```sudo docker compose up -d ```

**Génération de la clé API :**

```docker exec crowdsec cscli bouncers add traefik-bouncer```

Indiquez votre clé à la ligne suivante : **CROWDSEC_BOUNCER_API_KEY: #BOUNCER API KEY**

**Configuration des logs traefik :**

```sudo nano /opt/appdata/crowdsec/acquis.yaml```
```
filenames:
  - /var/log/crowdsec/traefik.log
labels:
  type: traefik
---
filenames:
  - /var/log/auth.log
labels:
  type: syslog
```
Maitenant faire un compose up ça devrait être bon :)

```sudo docker compose up -d```

**Tableau de bord**

Allez sur : https://app.crowdsec.net/

- Création du compte
- Ajouter un "engine"
- Récupérer l'id de l'enrollement pour l'executer dans le conteneur.

```
sudo docker exec -it crowdsec /bin/bash
```
```
cscli console enroll YOURUNIQUEID
```

Plus de détails ici : https://docs.ibracorp.io/crowdsec/crowdsec/docker-compose/dashboard

Exemple du rendu :
![crowdsec-demo](https://github.com/Ninapepite/tgtgSecAPI/assets/108991904/65310b0f-6b12-4aa4-b6b6-809dbd6ceda9)

Vu sur les alertes :

![crowdsec-demo2](https://github.com/Ninapepite/tgtgSecAPI/assets/108991904/2474966e-4f63-4213-9fe3-44d858d14b0a)



# English Section
You can just use solo FastAPI for your project.



Basic Front with React JS (Display favourite shop and add to mongo db cloud with day to check if the deal is available)
Cron script check every 15min if shop if this day is to db, if yes check in tgtg if the quantity is one or more, if yes send you notifications on your mobile with ntfy.

Crowdsec is her for the security, prevent and remediation the hit and dashboard is available in app.crowdsec.com
Traefik list is recommend if you hosted api on vps or other public server.

Thx https://github.com/ahivert/tgtg-python for the library



Coming soon full readme structured...
