import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================================================
   DADOS INICIAIS
   ========================================================= */

export const initialPets = [
  {
    id: "thor",
    name: "Thor",
    species: "Cachorro",
    breed: "SRD",
    sex: "Macho",
    age: 2,
    size: "Médio",
    city: "Belo Horizonte",
    vaccinated: true,
    neutered: true,
    description:
      "Thor é brincalhão, dócil e adora pessoas. Está pronto para encontrar uma família responsável.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },

  {
    id: "luna",
    name: "Luna",
    species: "Gato",
    breed: "SRD",
    sex: "Fêmea",
    age: 1,
    size: "Pequeno",
    city: "Belo Horizonte",
    vaccinated: true,
    neutered: true,
    description:
      "Luna é tranquila, carinhosa e se adapta bem a ambientes internos.",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },

  {
    id: "mel",
    name: "Mel",
    species: "Cachorro",
    breed: "SRD",
    sex: "Fêmea",
    age: 4,
    size: "Grande",
    city: "Contagem",
    vaccinated: true,
    neutered: false,
    description:
      "Mel é carinhosa e muito companheira. Precisa de espaço e de uma família paciente.",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },

  {
    id: "simba",
    name: "Simba",
    species: "Gato",
    breed: "SRD",
    sex: "Macho",
    age: 3,
    size: "Pequeno",
    city: "Betim",
    vaccinated: true,
    neutered: true,
    description:
      "Simba é curioso e sociável. Gosta de brincar e de receber carinho.",
    image:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },

  {
    id: "nina",
    name: "Nina",
    species: "Cachorro",
    breed: "SRD",
    sex: "Fêmea",
    age: 6,
    size: "Médio",
    city: "Belo Horizonte",
    vaccinated: true,
    neutered: true,
    description:
      "Nina é calma e companheira. Ideal para quem procura um animal adulto e tranquilo.",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },

  {
    id: "bento",
    name: "Bento",
    species: "Cachorro",
    breed: "SRD",
    sex: "Macho",
    age: 1,
    size: "Pequeno",
    city: "Nova Lima",
    vaccinated: false,
    neutered: false,
    description:
      "Bento é jovem, energético e muito carinhoso. Precisa de uma família ativa.",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85",
    status: "Disponível",
  },
];

/* =========================================================
   ANIMAIS
   ========================================================= */

export async function getPets() {
  const snapshot = await getDocs(
    collection(db, "pets")
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getAvailablePets() {
  const snapshot = await getDocs(
    query(
      collection(db, "pets"),
      where("status", "==", "Disponível")
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getPetById(petId) {
  const snapshot = await getDoc(
    doc(db, "pets", petId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function getPetsByProtector(
  protectorId
) {
  const snapshot = await getDocs(
    query(
      collection(db, "pets"),
      where(
        "protectorId",
        "==",
        protectorId
      )
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function createPet(
  pet,
  protectorId
) {
  if (!protectorId) {
    throw new Error(
      "Não foi possível identificar o protetor."
    );
  }

  const petId =
    pet.id || crypto.randomUUID();

  const data = {
    name: pet.name?.trim() || "",
    species: pet.species || "",
    breed: pet.breed || "SRD",
    sex: pet.sex || "",
    age: Number(pet.age) || 0,
    size: pet.size || "",
    city: pet.city?.trim() || "",
    vaccinated: Boolean(
      pet.vaccinated
    ),
    neutered: Boolean(
      pet.neutered
    ),
    description:
      pet.description?.trim() || "",
    image: pet.image?.trim() || "",
    status:
      pet.status || "Disponível",
    protectorId,
    createdAt: serverTimestamp(),
  };

  await setDoc(
    doc(db, "pets", petId),
    data
  );

  return {
    id: petId,
    ...data,
  };
}

export async function deletePet(
  petId
) {
  await deleteDoc(
    doc(db, "pets", petId)
  );
}

/* =========================================================
   SOLICITAÇÕES DE ADOÇÃO
   ========================================================= */

export async function getRequestsByUser(
  userId
) {
  if (!userId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "adoptionRequests"
      ),
      where(
        "userId",
        "==",
        userId
      )
    )
  );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}

export async function getRequestsByPet(
  petId
) {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        "adoptionRequests"
      ),
      where(
        "petId",
        "==",
        petId
      )
    )
  );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}

export async function getRequestsByProtector(
  petIds = []
) {
  const uniquePetIds = [
    ...new Set(
      petIds.filter(Boolean)
    ),
  ];

  if (!uniquePetIds.length) {
    return [];
  }

  const results =
    await Promise.all(
      uniquePetIds.map(
        (petId) =>
          getRequestsByPet(
            petId
          )
      )
    );

  return results
    .flat()
    .sort((a, b) => {
      const aTime =
        a.createdAt?.toMillis?.() ||
        0;

      const bTime =
        b.createdAt?.toMillis?.() ||
        0;

      return bTime - aTime;
    });
}

export async function createAdoptionRequest({
  petId,
  userId,
  message,
}) {
  if (!petId) {
    throw new Error(
      "Animal não informado."
    );
  }

  if (!userId) {
    throw new Error(
      "Usuário não informado."
    );
  }

  const pet =
    await getPetById(petId);

  if (!pet) {
    throw new Error(
      "Animal não encontrado."
    );
  }

  if (
    pet.status !==
    "Disponível"
  ) {
    throw new Error(
      "Este animal não está mais disponível para adoção."
    );
  }

  const existing =
    await getRequestsByUser(
      userId
    );

  const hasPendingRequest =
    existing.some(
      (item) =>
        item.petId === petId &&
        item.status ===
          "Pendente"
    );

  if (hasPendingRequest) {
    throw new Error(
      "Você já possui uma solicitação pendente para este animal."
    );
  }

  const requestId =
    crypto.randomUUID();

  const data = {
    petId,
    userId,
    message:
      message?.trim() || "",
    status: "Pendente",
    createdAt:
      serverTimestamp(),
  };

  await setDoc(
    doc(
      db,
      "adoptionRequests",
      requestId
    ),
    data
  );

  return {
    id: requestId,
    ...data,
  };
}

export async function updateRequest(
  requestId,
  changes
) {
  await updateDoc(
    doc(
      db,
      "adoptionRequests",
      requestId
    ),
    {
      ...changes,
      updatedAt:
        serverTimestamp(),
    }
  );
}

/* =========================================================
   APROVAR ADOÇÃO
   ========================================================= */

export async function approveAdoptionRequest(
  requestId
) {
  const requestSnapshot =
    await getDoc(
      doc(
        db,
        "adoptionRequests",
        requestId
      )
    );

  if (
    !requestSnapshot.exists()
  ) {
    throw new Error(
      "Solicitação não encontrada."
    );
  }

  const request =
    requestSnapshot.data();

  const petSnapshot =
    await getDoc(
      doc(
        db,
        "pets",
        request.petId
      )
    );

  if (
    !petSnapshot.exists()
  ) {
    throw new Error(
      "Animal não encontrado."
    );
  }

  const pet =
    petSnapshot.data();

  if (
    pet.status !==
    "Disponível"
  ) {
    throw new Error(
      "Este animal não está mais disponível."
    );
  }

  const requests =
    await getRequestsByPet(
      request.petId
    );

  const batch =
    writeBatch(db);

  /* Animal passa para adotado */
  batch.update(
    doc(
      db,
      "pets",
      request.petId
    ),
    {
      status: "Adotado",
      updatedAt:
        serverTimestamp(),
    }
  );

  /* Atualiza as solicitações */
  requests.forEach(
    (item) => {
      if (
        item.id ===
        requestId
      ) {
        batch.update(
          doc(
            db,
            "adoptionRequests",
            item.id
          ),
          {
            status:
              "Aprovada",
            updatedAt:
              serverTimestamp(),
          }
        );
      } else if (
        item.status ===
        "Pendente"
      ) {
        batch.update(
          doc(
            db,
            "adoptionRequests",
            item.id
          ),
          {
            status:
              "Recusada",
            reason:
              "O animal foi adotado por outro solicitante.",
            updatedAt:
              serverTimestamp(),
          }
        );
      }
    }
  );

  await batch.commit();
}

/* =========================================================
   FAVORITOS
   ========================================================= */

export async function getFavorites(
  userId
) {
  if (!userId) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "favorites"
      ),
      where(
        "userId",
        "==",
        userId
      )
    )
  );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}

export async function toggleFavorite(
  userId,
  petId
) {
  if (!userId || !petId) {
    throw new Error(
      "Usuário ou animal não informado."
    );
  }

  const favoriteId =
    `${userId}_${petId}`;

  const reference = doc(
    db,
    "favorites",
    favoriteId
  );

  const snapshot =
    await getDoc(reference);

  if (snapshot.exists()) {
    await deleteDoc(
      reference
    );

    return false;
  }

  await setDoc(
    reference,
    {
      userId,
      petId,
      createdAt:
        serverTimestamp(),
    }
  );

  return true;
}

/* =========================================================
   PERFIL DO USUÁRIO
   ========================================================= */

export async function getUserProfile(
  userId
) {
  if (!userId) {
    return null;
  }

  const snapshot =
    await getDoc(
      doc(
        db,
        "users",
        userId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}