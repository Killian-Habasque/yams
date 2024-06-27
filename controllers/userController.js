const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const db = require('../models/firebaseModel');


const login = async (req, res) => {
    const { pseudo, password } = req.body;

    try {
        const email = pseudo + '@' + process.env.DOMAIN_EMAIL_USER
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        // Stocker le jeton dans Firestore (facultatif, dépend de vos besoins)
        const tokenDocRef = await addDoc(collection(db, 'tokens'), { uid: user.uid, token });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ uid: user.uid, email: user.email, token });
    } catch (error) {
        // console.error('Erreur lors de la connexion utilisateur', error);
        res.status(401).json({ error: 'Identifiants invalides', details: error.message });
    }
};

const register = async (req, res) => {
    const { pseudo, password, verifPassword, score } = req.body;

    try {
        const q = query(collection(db, 'users'), where('pseudo', '==', pseudo));
        const userRef = await getDocs(q);

        if (!userRef.empty) {
            return res.status(400).json({ error: 'Le pseudo est déjà pris. Veuillez en choisir un autre.' });
        }
        if (password.length === 0 || verifPassword.length === 0 || password !== verifPassword) {
            return res.status(400).json({ error: 'Les mots de passe ne sont pas similaires.' });
        }
        const email = pseudo + '@' + process.env.DOMAIN_EMAIL_USER
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            uid: user.uid,
            pseudo: pseudo,
            bestscore: score ?? 0
        };
        await addDoc(collection(db, 'users'), userData);
        await login(req, res);

        // res.status(200).json({ uid: user.uid, email: userData.pseudo });
    } catch (error) {
        // console.error('Erreur lors de l\'inscription utilisateur', error);
        res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        // console.error('Erreur lors de la déconnexion utilisateur', error);
        res.status(500).json({ error: 'Erreur serveur lors de la déconnexion' });
    }
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.user;
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);

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

        const userData = userDoc.data();
        res.status(200).json({
            uid: userData.uid,
            email: userData.email,
            pseudo: userData.pseudo,
            bestscore: userData.bestscore,
        });
    } catch (error) {
        // console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { getUser, login, register, logout };