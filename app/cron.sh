#!/bin/bash

# Remplacez cette URL par l'URL de votre API
API_URL="http://localhost:8080"

# URL pour les notifications
NTFY_URL="https://ntfy.ninapepite.ovh/tgtgapi"

# Remplacez par l'ID de la boutique que vous souhaitez vérifier
STORE_ID="$1"
STORE_NAME="$2"

if [ -z "$STORE_ID" ] || [ -z "$STORE_NAME" ]; then
  echo "Usage: $0 <STORE_ID> <STORE_NAME>"
  exit 1
fi

# Effectuez un appel API pour obtenir des informations sur l'élément
response=$(curl -s "$API_URL/item/$STORE_ID")

# Extrait la valeur de 'items_available' de la réponse JSON
items_available=$(echo "$response" | jq '.items_available')

# Vérifiez si items_available est égal à 1 ou plus
if [ "$items_available" -ge 1 ]; then
  echo "Items available: $items_available. Sending notification."

  # Envoi d'une notification
  curl -d "Un panier disponible chez : $STORE_NAME" "$NTFY_URL"

  echo "Notification sent."
else
  echo "Items available: $items_available. No notification sent."
fi