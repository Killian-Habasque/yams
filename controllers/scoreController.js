
const { collection, getDocs, updateDoc } = require('firebase/firestore');
const db = require('../models/firebaseModel');


const getScores = async (req, res) => {
    try {
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);
        let data = snapshot.docs.map(doc => doc.data());
        data = data.filter(user => user.bestscore !== 0);
        data.sort((a, b) => b.bestscore - a.bestscore);
        data = data.slice(0, 20);
        res.json(data);
    } catch (error) {
        // console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};


const setScore = async (req, res) => {
    try {
        const { uid } = req.user;

        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        let userDoc;
        snapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });

        if (!userDoc) {
            // console.error('Utilisateur non trouvé.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const { bestscore } = req.body;

        if (bestscore > userDoc.data().bestscore) {
            await updateDoc(userDoc.ref, { bestscore });
            res.status(200).json({ message: 'Nouveau meilleur score mis à jour avec succès' });
        } 
        // else {
        //     res.status(200).json({ message: 'Le score reçu n\'est pas supérieur au meilleur score actuel. Aucune mise à jour effectuée.' });
        // }
    } catch (error) {
        // console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { getScores, setScore};