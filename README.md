# tgtgSecAPI

## Too Good To Go Api with FASTAPI.

Ce code va permettre de realiser quelques tâches lié à TooGoodToGo via API.
Vous pouvez reprendre l'exemple et ajouter d'autre route si cela vous interesse.

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

## Configuration de crowdsec

Sur la machine qui héberge crowdsec voici les commandes à insérer :

```sudo mkdir /var/log/crowdsec; sudo chown -R $USER:$USER /var/log/crowdsec ```
```sudo mkdir /opt/appdata/crowdsec```

```sudo docker composeup -d crowdsec```
ou
```sudo docker compose up -d ```

Génération de la clé API :

```docker exec crowdsec cscli bouncers add traefik-bouncer```

Configuration des logs traefik :

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



# English Section
You can just use solo FastAPI for your project.



Basic Front with React JS (Display favourite shop and add to mongo db cloud with day to check if the deal is available)
Cron script check every 15min if shop if this day is to db, if yes check in tgtg if the quantity is one or more, if yes send you notifications on your mobile with ntfy.

Crowdsec is her for the security, prevent and remediation the hit and dashboard is available in app.crowdsec.com
Traefik list is recommend if you hosted api on vps or other public server.

Thx https://github.com/ahivert/tgtg-python for the library



Coming soon full readme structured...
