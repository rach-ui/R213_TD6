import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export function getImageUrl(record, filename) {
    return pb.files.getURL(record, filename);
}

export async function getOffres() {
    try {
        return await pb.collection("maison").getFullList();
    } catch (error) {
        return [];
    }
}

export async function getOffre(id) {
    try {
        return await pb.collection("maison").getOne(id, { expand: "agent" });
    } catch (error) {
        return null;
    }
}

export async function getOffresBySurface(surface) {
    try {
        return await pb.collection("maison").getFullList({
            filter: `surface > ${surface}`,
        });
    } catch (error) {
        return [];
    }
}

export async function getOffresSurface50() {
    return getOffresBySurface(50);
}

export async function PrixInferieur(prix = 100000) {
    try {
        return await pb.collection("maison").getFullList({
            filter: `Prix < ${prix}`,
        });
    } catch (error) {
        return [];
    }
}

export async function addOffre(data) {
    try {
        await pb.collection("maison").create(data);
        return { success: true, message: "L'offre a été ajoutée avec succès." };
    } catch (error) {
        return { success: false, message: "Erreur lors de l'ajout : " + error.message };
    }
}

export async function filterByPrix(minPrix, maxPrix) {
    try {
        return await pb.collection("maison").getFullList({
            filter: `Prix >= ${minPrix} && Prix <= ${maxPrix}`,
        });
    } catch (error) {
        return [];
    }
}

export async function getFavoris() {
    try {
        return await pb.collection("maison").getFullList({
            filter: "favori = true",
        });
    } catch (error) {
        return [];
    }
}

export async function setFavori(id, isFavori) {
    try {
        return await pb.collection("maison").update(id, { favori: isFavori });
    } catch (error) {
        return null;
    }
}

export async function getAgents() {
    try {
        return await pb.collection("agent").getFullList();
    } catch (error) {
        return [];
    }
}

export async function getAgent(id) {
    try {
        return await pb.collection("agent").getOne(id);
    } catch (error) {
        return null;
    }
}

export async function getOffresByAgent(agentId) {
    try {
        return await pb.collection("maison").getFullList({
            filter: `agent = "${agentId}"`,
        });
    } catch (error) {
        return [];
    }
}
