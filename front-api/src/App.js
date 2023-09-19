import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);  // Nouveau state pour les boutiques
  const [selectedDay, setSelectedDay] = useState('Lundi');

  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const dayMapping = {
    'lundi': 'monday',
    'mardi': 'tuesday',
    'mercredi': 'wednesday',
    'jeudi': 'thursday',
    'vendredi': 'friday',
    'samedi': 'saturday',
    'dimanche': 'sunday'
  };

  const translateDay = (day) => {
    return dayMapping[day] || day;
  };


  useEffect(() => {
    // Récupération des articles
    axios.get('/items', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log('Erreur lors de la récupération des données : ', error);
      });

    // Récupération des boutiques
    fetchStores();
  }, []);

  const fetchStores = () => {
    axios.get('/stores/')
      .then(response => {
        setStores(response.data.stores);
      })
      .catch(error => {
        console.log('Erreur lors de la récupération des boutiques:', error);
      });
  };
  const addStore = (id, name, day) => {
    const translatedDay = translateDay(day); // Convertir en anglais
    axios
      .put(`/store/?id=${id}&name=${name}&day=${translatedDay}`)
      .then((response) => {
        console.log('Boutique ajoutée avec succès :', response.data);
      })
      .catch((error) => {
        console.log('Erreur lors de l\'ajout de la boutique:', error);
      });
  };

  const deleteStore = (id) => {
    axios.delete(`/store/${id}`)
      .then(response => {
        console.log('Boutique supprimée avec succès');
        fetchStores(); // Recharger les boutiques
      })
      .catch(error => {
        console.log('Erreur lors de la suppression de la boutique:', error);
      });
  };


  return (
    <div className="App">
      <h1>Liste des Shops</h1>
      <div className="item-container">
        {items.map((itemData, index) => (
          <div className="item-card" key={index}>
            <img src={itemData.item.cover_picture.current_url} alt="item cover" />
            <h2>{itemData.display_name}</h2>
            <p>ID de la boutique : {itemData.item.item_id}</p>
            <p>{itemData.item.description}</p>
            <p>Prix : {(itemData.item.price_including_taxes.minor_units / 100).toFixed(2)} EUR</p>
            <p>Distance : {itemData.distance.toFixed(2)} m</p>
            <p>Adresse : {itemData.pickup_location.address.address_line}</p>
            <select onChange={(e) => setSelectedDay(e.target.value)} value={selectedDay}>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <button onClick={() => addStore(itemData.item.item_id, itemData.display_name, selectedDay)}>Ajouter</button>
          </div>
        ))}
      </div>
      <h1>Boutiques enregistrées</h1>
      <div className="store-container">
        {stores.map((store, index) => (
          <div className="store-bubble" key={index}>
            <p>{store.name} ({store.day})</p>
            <button onClick={() => deleteStore(store.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
