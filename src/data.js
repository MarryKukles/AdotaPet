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

export const seedIfNeeded = () => {
  if (!localStorage.getItem("adotapet_pets")) {
    localStorage.setItem(
      "adotapet_pets",
      JSON.stringify(initialPets)
    );
  }

  if (!localStorage.getItem("adotapet_requests")) {
    localStorage.setItem(
      "adotapet_requests",
      JSON.stringify([])
    );
  }

  if (!localStorage.getItem("adotapet_favorites")) {
    localStorage.setItem(
      "adotapet_favorites",
      JSON.stringify([])
    );
  }
};

export const getPets = () => {
  return JSON.parse(
    localStorage.getItem("adotapet_pets") || "[]"
  );
};

export const savePets = (pets) => {
  localStorage.setItem(
    "adotapet_pets",
    JSON.stringify(pets)
  );
};

export const getRequests = () => {
  return JSON.parse(
    localStorage.getItem("adotapet_requests") || "[]"
  );
};

export const saveRequests = (items) => {
  localStorage.setItem(
    "adotapet_requests",
    JSON.stringify(items)
  );
};

export const getFavorites = () => {
  return JSON.parse(
    localStorage.getItem("adotapet_favorites") || "[]"
  );
};

export const saveFavorites = (items) => {
  localStorage.setItem(
    "adotapet_favorites",
    JSON.stringify(items)
  );
};