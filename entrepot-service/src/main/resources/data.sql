INSERT INTO entrepots (nom, ville, pays)
SELECT 'Entrepôt Paris Nord', 'Paris', 'France'
WHERE NOT EXISTS (SELECT 1 FROM entrepots WHERE ville = 'Paris');

INSERT INTO entrepots (nom, ville, pays)
SELECT 'Entrepôt Lyon Sud', 'Lyon', 'France'
WHERE NOT EXISTS (SELECT 1 FROM entrepots WHERE ville = 'Lyon');

INSERT INTO entrepots (nom, ville, pays)
SELECT 'Entrepôt Toulouse', 'Toulouse', 'France'
WHERE NOT EXISTS (SELECT 1 FROM entrepots WHERE ville = 'Toulouse');