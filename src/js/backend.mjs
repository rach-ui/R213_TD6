import PocketBase from "pocketbase";
// Backend - connexion à PocketBase
const pb = new PocketBase("http://127.0.0.1:8090");

export async function getEvents() {
    let events = await pb.collection("events").getFullList();
    return events;
}

export async function getEventById(eventId) {
    try {
        let event = await pb.collection("events").getOne(eventId);
        return event;
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return null;
    }
}

export async function getImageUrl(record, imageField) {
    return pb.files.getURL(record, record[imageField]);
}

export async function setFavori(eventId, isFavori) {
    try {
        const updatedEvent = await pb.collection("events").update(eventId,
            { favori: isFavori }
        );
        return updatedEvent;
    } catch (error) {
        console.error("Error setting favori status:", error);
        return null;
    }
}

export async function addEvent(data) {
    try {
        await pb.collection("events").create(data);
        return {
            success: true,
            message: "L'événement a été ajouté avec succès.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Une erreur est survenue lors de l'ajout de l'événement : " + error,
        };
    }
}

export async function updateEvent(id, data) {
    try {
        const event = await pb.collection("events").update(id, data);
        return {
            success: true,
            event: event,
            message: "L'événement a été modifié avec succès.",
        };
    } catch (error) {
        return {
            success: false,
            event: null,
            message: "Une erreur est survenue lors de la modification de l'événement: " + error,
        };
    }
}

export async function getArtistes() {
    try {
        let artistes = await pb.collection("artists").getFullList({
            expand: "events",
        });
        return artistes;
    } catch (error) {
        console.error("Error fetching artistes:", error);
        return [];
    }
}

export async function getArtisteById(artisteId) {
    try {
        let artiste = await pb.collection("artists").getOne(artisteId);
        return artiste;
    } catch (error) {
        console.error("Error fetching artiste by ID:", error);
        return null;
    }
}