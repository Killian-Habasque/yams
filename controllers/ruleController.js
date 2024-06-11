
const { collection, getDocs, updateDoc } = require('firebase/firestore');
const db = require('../models/firebaseModel');

const getRules = async (req, res) => {
    try {
        const dataRef = collection(db, 'rules');
        const snapshot = await getDocs(dataRef);
        let data = snapshot.docs.map(doc => doc.data());
        res.json(data);
    } catch (error) {
        // console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { getRules };