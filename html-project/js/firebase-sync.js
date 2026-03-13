import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function firebaseLoadMenu(){

    const snapshot = await getDocs(collection(db,"menu"));

    const items=[];

    snapshot.forEach(d=>{
        items.push({
            id:d.id,
            ...d.data()
        });
    });

    return items;

}

export async function firebaseAddMenu(item){

    await addDoc(collection(db,"menu"),item);

}

export async function firebaseUpdateMenu(id,data){

    await updateDoc(
        doc(db,"menu",id),
        data
    );

}

export async function firebaseDeleteMenu(id){

    await deleteDoc(
        doc(db,"menu",id)
    );

}
