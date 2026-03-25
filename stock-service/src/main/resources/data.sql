INSERT INTO stock_items (nom_outil, categorie, quantite_disponible, quantite_totale, entrepot_id)
SELECT 'Perceuse Bosch', 'Perçage', 3, 5, 1
WHERE NOT EXISTS (SELECT 1 FROM stock_items WHERE nom_outil = 'Perceuse Bosch');

INSERT INTO stock_items (nom_outil, categorie, quantite_disponible, quantite_totale, entrepot_id)
SELECT 'Scie circulaire', 'Découpe', 1, 3, 1
WHERE NOT EXISTS (SELECT 1 FROM stock_items WHERE nom_outil = 'Scie circulaire');

INSERT INTO stock_items (nom_outil, categorie, quantite_disponible, quantite_totale, entrepot_id)
SELECT 'Bétonneuse', 'Maçonnerie', 2, 2, 2
WHERE NOT EXISTS (SELECT 1 FROM stock_items WHERE nom_outil = 'Bétonneuse');