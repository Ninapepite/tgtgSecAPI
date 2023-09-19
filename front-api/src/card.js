import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemCards = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost/items", {
                headers: {
                    Accept: "application/json",
                },
            })
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.log("Erreur lors de la récupération des données : ", error);
            });
    }, []);

    return (
        <div className="item-container">
            {items.map((itemData, index) => (
                <div className="item-card" key={index}>
                    <img src={itemData.item.cover_picture.current_url} alt="item cover" />
                    <h2>{itemData.display_name}</h2>
                    <p>{itemData.item.description}</p>
                    <p>Prix : {itemData.item.price_including_taxes.minor_units / 100} EUR</p>
                    <p>Distance : {itemData.distance} m</p>
                    <p>Adresse : {itemData.pickup_location.address.address_line}</p>
                </div>
            ))}
        </div>
    );
};

export default ItemCards;
