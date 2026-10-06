import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Heart,
  PawPrint,
  Search,
  MapPin,
  ShieldCheck,
  UserRound,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Clock3,
  CircleX,
  ArrowRight,
  ClipboardCheck,
  Home,
  Sparkles,
} from "lucide-react";

import { AuthProvider, useAuth } from "./auth";

import {
  getPets,
  savePets,
  getRequests,
  saveRequests,
  getFavorites,
  saveFavorites,
  seedIfNeeded,
} from "./data";


function App() {
  useEffect(() => {
    seedIfNeeded();
  }, []);

  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}


function Layout() {
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = useNavigate();

  const exit = async () => {
    await logout();

    nav("/");

    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="header">
        <div className="container header-inner">

          <Link
            className="brand"
            to="/"
            onClick={() => setMobileOpen(false)}
          >
            <span className="brand-icon">
              <PawPrint size={23} />
            </span>

            <span>
              Adota<span>Pet</span>
            </span>
          </Link>

          <button
            className="menu-btn"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

          <nav className={`nav ${mobileOpen ? "open" : ""}`}>
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
            >
              Início
            </NavLink>

            <NavLink
              to="/animais"
              onClick={() => setMobileOpen(false)}
            >
              Animais
            </NavLink>

            <NavLink
              to="/compatibilidade"
              onClick={() => setMobileOpen(false)}
            >
              Compatibilidade
            </NavLink>

            {user?.role === "protector" && (
              <NavLink
                to="/painel"
                onClick={() => setMobileOpen(false)}
              >
                Painel
              </NavLink>
            )}

            {user ? (
              <div className="nav-user">
                <span>
                  <UserRound size={16} />
                  {user.name}
                </span>

                <button
                  className="link-button"
                  onClick={exit}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                className="btn btn-primary nav-login"
                to="/login"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/animais"
            element={<AnimalsPage />}
          />

          <Route
            path="/animais/:id"
            element={<PetDetails />}
          />

          <Route
            path="/compatibilidade"
            element={<Compatibility />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/cadastro"
            element={<Register />}
          />

          <Route
            path="/painel"
            element={<Dashboard />}
          />

          <Route
            path="/favoritos"
            element={<Favorites />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">

          <div>
            <div className="brand footer-brand">
              <span className="brand-icon">
                <PawPrint size={19} />
              </span>

              AdotaPet
            </div>

            <p>
              Conectando animais a famílias responsáveis.
            </p>
          </div>

          <div>
            <strong>Projeto acadêmico</strong>
            <p>ODS 11 · ODS 15</p>
          </div>

        </div>
      </footer>
    </div>
  );
}


function HomePage() {
  const pets = getPets()
    .filter(
      (pet) => pet.status === "Disponível"
    )
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">

          <div className="hero-copy">

            <div className="eyebrow">
              <Sparkles size={16} />
              Adoção responsável
            </div>

            <h1>
              Um lar pode mudar{" "}
              <span>duas vidas.</span>
            </h1>

            <p>
              Encontre um companheiro que combine
              com seu estilo de vida e dê a ele uma
              nova chance de ser feliz.
            </p>

            <div className="hero-actions">
              <Link
                className="btn btn-primary btn-lg"
                to="/animais"
              >
                Encontrar um animal
                <ArrowRight size={18} />
              </Link>

              <Link
                className="btn btn-light btn-lg"
                to="/compatibilidade"
              >
                <ClipboardCheck size={18} />
                Fazer compatibilidade
              </Link>
            </div>

            <div className="trust-row">
              <span>
                <ShieldCheck size={18} />
                Adoção responsável
              </span>

              <span>
                <Heart size={18} />
                Sem fins lucrativos
              </span>
            </div>
          </div>

          <div className="hero-card">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=90"
              alt="Cachorros juntos"
            />

            <div className="hero-badge">
              <Heart
                fill="currentColor"
                size={16}
              />

              Encontre seu novo melhor amigo
            </div>
          </div>

        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Adote hoje
              </span>

              <h2>
                Animais esperando por você
              </h2>
            </div>

            <Link
              className="text-link"
              to="/animais"
            >
              Ver todos
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="pet-grid">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
              />
            ))}
          </div>

        </div>
      </section>

      <section className="how-section">
        <div className="container">

          <div className="section-heading centered">
            <div>
              <span className="eyebrow">
                Como funciona
              </span>

              <h2>
                Adotar é simples
              </h2>
            </div>
          </div>

          <div className="steps">

            <Step
              number="01"
              icon={<Search />}
              title="Encontre"
              text="Pesquise animais de acordo com suas preferências."
            />

            <Step
              number="02"
              icon={<Heart />}
              title="Conheça"
              text="Veja fotos, perfil e informações do animal."
            />

            <Step
              number="03"
              icon={<Home />}
              title="Solicite"
              text="Envie uma solicitação de adoção responsável."
            />

          </div>
        </div>
      </section>
    </>
  );
}


function Step({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="step">
      <div className="step-icon">
        {icon}
      </div>

      <small>{number}</small>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}


function PetCard({ pet }) {
  const [fav, setFav] = useState(
    getFavorites().includes(pet.id)
  );

  const toggle = () => {
    const current = getFavorites();

    const next = current.includes(pet.id)
      ? current.filter(
          (id) => id !== pet.id
        )
      : [...current, pet.id];

    saveFavorites(next);

    setFav(!fav);
  };

  const isAvailable =
    pet.status === "Disponível";

  return (
    <article className="pet-card">

      <div className="pet-image-wrap">

        <img
          src={pet.image}
          alt={pet.name}
        />

        <button
          className={`favorite ${
            fav ? "active" : ""
          }`}
          onClick={toggle}
          aria-label="Favoritar"
        >
          <Heart
            fill={
              fav
                ? "currentColor"
                : "none"
            }
          />
        </button>

        <span className="status-pill">
          {isAvailable
            ? "Disponível"
            : "Indisponível"}
        </span>

      </div>

      <div className="pet-content">

        <div className="pet-title">
          <h3>{pet.name}</h3>

          <span>
            {pet.sex === "Macho"
              ? "♂"
              : "♀"}
          </span>
        </div>

        <p>
          {pet.species} · {pet.age}{" "}
          {pet.age === 1
            ? "ano"
            : "anos"}{" "}
          · {pet.size}
        </p>

        <div className="location">
          <MapPin size={15} />
          {pet.city}
        </div>

        <Link
          className="btn btn-outline full"
          to={`/animais/${pet.id}`}
        >
          Ver detalhes
        </Link>

      </div>
    </article>
  );
}


function AnimalsPage() {
  const [pets, setPets] = useState(
    getPets()
  );

  const [q, setQ] = useState("");

  const [species, setSpecies] =
    useState("Todos");

  const [size, setSize] =
    useState("Todos");

  const [sex, setSex] =
    useState("Todos");

  const filtered = useMemo(
    () =>
      pets.filter((pet) => {
        const text =
          `${pet.name} ${pet.breed || ""} ${pet.city}`
            .toLowerCase();

        return (
          pet.status === "Disponível" &&
          (!q ||
            text.includes(
              q.toLowerCase()
            )) &&
          (species === "Todos" ||
            pet.species === species) &&
          (size === "Todos" ||
            pet.size === size) &&
          (sex === "Todos" ||
            pet.sex === sex)
        );
      }),
    [
      pets,
      q,
      species,
      size,
      sex,
    ]
  );

  return (
    <section className="section page-section">
      <div className="container">

        <div className="page-heading">
          <div>
            <span className="eyebrow">
              Encontre seu companheiro
            </span>

            <h1>
              Animais para adoção
            </h1>

            <p>
              {filtered.length} animais
              disponíveis no momento.
            </p>
          </div>
        </div>

        <div className="filters">

          <div className="search-box">
            <Search size={18} />

            <input
              value={q}
              onChange={(event) =>
                setQ(event.target.value)
              }
              placeholder="Buscar por nome, raça ou cidade..."
            />
          </div>

          <select
            value={species}
            onChange={(event) =>
              setSpecies(event.target.value)
            }
          >
            <option>Todos</option>
            <option>Cachorro</option>
            <option>Gato</option>
          </select>

          <select
            value={size}
            onChange={(event) =>
              setSize(event.target.value)
            }
          >
            <option>Todos</option>
            <option>Pequeno</option>
            <option>Médio</option>
            <option>Grande</option>
          </select>

          <select
            value={sex}
            onChange={(event) =>
              setSex(event.target.value)
            }
          >
            <option>Todos</option>
            <option>Macho</option>
            <option>Fêmea</option>
          </select>

        </div>

        <div className="pet-grid">
          {filtered.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
            />
          ))}
        </div>

        {!filtered.length && (
          <Empty
            title="Nenhum animal encontrado"
            text="Tente mudar os filtros ou fazer uma nova busca."
          />
        )}

      </div>
    </section>
  );
}


function PetDetails() {
  const { id } = useParams();

  const { user } = useAuth();

  const nav = useNavigate();

  const [message, setMessage] =
    useState("");

  const [sent, setSent] =
    useState(false);

  const [pet, setPet] =
    useState(() =>
      getPets().find(
        (item) => item.id === id
      )
    );

  if (!pet) {
    return <NotFound />;
  }

  const isAvailable =
    pet.status === "Disponível";

  const request = () => {
    if (!user) {
      nav("/login");

      return;
    }

    if (user.role !== "adopter") {
      alert(
        "Apenas usuários adotantes podem solicitar uma adoção."
      );

      return;
    }

    const currentPets = getPets();

    const currentPet =
      currentPets.find(
        (item) => item.id === pet.id
      );

    if (
      !currentPet ||
      currentPet.status !== "Disponível"
    ) {
      setPet(currentPet);

      alert(
        "Este animal não está mais disponível para adoção."
      );

      return;
    }

    const requests =
      getRequests();

    const alreadyRequested =
      requests.some(
        (item) =>
          item.petId === pet.id &&
          item.userId === user.id &&
          item.status === "Pendente"
      );

    if (alreadyRequested) {
      alert(
        "Você já possui uma solicitação pendente para este animal."
      );

      return;
    }

    requests.push({
      id: crypto.randomUUID(),

      petId: pet.id,

      petName: pet.name,

      userId: user.id,

      userName: user.name,

      userEmail: user.email,

      userPhone: user.phone || "",

      message,

      status: "Pendente",

      date: new Date().toLocaleDateString(
        "pt-BR"
      ),
    });

    saveRequests(requests);

    setSent(true);
  };

  return (
    <section className="section page-section">
      <div className="container">

        <Link
          className="back-link"
          to="/animais"
        >
          ← Voltar para animais
        </Link>

        <div className="details-grid">

          <div className="details-image">
            <img
              src={pet.image}
              alt={pet.name}
            />
          </div>

          <div className="details-copy">

            <span className="status-label">
              {isAvailable ? (
                <>
                  <CheckCircle2 size={15} />
                  Disponível para adoção
                </>
              ) : (
                <>
                  <CircleX size={15} />
                  Indisponível para adoção
                </>
              )}
            </span>

            <h1>
              {pet.name}{" "}
              <span className="sex">
                {pet.sex === "Macho"
                  ? "♂"
                  : "♀"}
              </span>
            </h1>

            <p className="lead">
              {pet.description}
            </p>

            <div className="info-grid">

              <Info
                label="Espécie"
                value={pet.species}
              />

              <Info
                label="Raça"
                value={pet.breed || "SRD"}
              />

              <Info
                label="Idade"
                value={`${pet.age} ${
                  pet.age === 1
                    ? "ano"
                    : "anos"
                }`}
              />

              <Info
                label="Porte"
                value={pet.size}
              />

              <Info
                label="Sexo"
                value={pet.sex}
              />

              <Info
                label="Cidade"
                value={pet.city}
              />

            </div>

            <div className="health-list">

              <span>
                <ShieldCheck />
                Vacinação{" "}
                {pet.vaccinated
                  ? "em dia"
                  : "pendente"}
              </span>

              <span>
                <ShieldCheck />
                Castração{" "}
                {pet.neutered
                  ? "realizada"
                  : "pendente"}
              </span>

            </div>

            {!isAvailable ? (
              <div className="success-box">
                <CircleX size={30} />

                <div>
                  <strong>
                    Este animal já foi adotado
                  </strong>

                  <p>
                    No momento, este animal
                    não está mais disponível
                    para novas solicitações
                    de adoção.
                  </p>
                </div>
              </div>
            ) : !sent ? (
              <div className="request-box">

                <h3>
                  Quero adotar {pet.name}
                </h3>

                <p>
                  Conte um pouco sobre você
                  e por que acredita que pode
                  oferecer um bom lar.
                </p>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder="Escreva sua mensagem..."
                  rows="4"
                />

                <button
                  className="btn btn-primary"
                  onClick={request}
                >
                  <Heart size={18} />
                  Enviar solicitação
                </button>

              </div>
            ) : (
              <div className="success-box">

                <CheckCircle2 size={30} />

                <div>
                  <strong>
                    Solicitação enviada!
                  </strong>

                  <p>
                    A ONG/protetor poderá
                    analisar seus dados e
                    entrar em contato.
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}


function Info({ label, value }) {
  return (
    <div className="info-item">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}


function Compatibility() {
  const [answers, setAnswers] =
    useState({
      time: "",
      home: "",
      size: "",
      energy: "",
      experience: "",
    });

  const [result, setResult] =
    useState(null);

  const calculate = () => {
    const score = {
      Pequeno: 0,
      Médio: 0,
      Grande: 0,
    };

    if (
      answers.home ===
      "Apartamento"
    ) {
      score.Pequeno += 2;
      score.Médio += 1;
    } else if (
      answers.home === "Casa"
    ) {
      score.Médio += 2;
      score.Grande += 2;
    } else {
      score.Pequeno += 1;
      score.Médio += 1;
      score.Grande += 1;
    }

    if (answers.time === "Pouco") {
      score.Pequeno += 2;
    }

    if (
      answers.time === "Moderado"
    ) {
      score.Médio += 2;
    }

    if (answers.time === "Muito") {
      score.Grande += 2;
      score.Médio += 1;
    }

    if (answers.size) {
      score[answers.size] += 2;
    }

    const best =
      Object.entries(score).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

    const candidates =
      getPets().filter(
        (pet) =>
          pet.status ===
            "Disponível" &&
          pet.size === best
      );

    setResult({
      best,
      candidates,
    });
  };

  return (
    <section className="section page-section">
      <div className="container narrow">

        <div className="page-heading centered">

          <span className="eyebrow">
            Quiz de compatibilidade
          </span>

          <h1>
            Qual animal combina
            com você?
          </h1>

          <p>
            Responda algumas perguntas
            para receber sugestões com
            base no seu estilo de vida.
          </p>

        </div>

        <div className="quiz-card">

          <Question
            label="Quanto tempo você tem por dia para cuidar do animal?"
            value={answers.time}
            set={(value) =>
              setAnswers({
                ...answers,
                time: value,
              })
            }
            options={[
              "Pouco",
              "Moderado",
              "Muito",
            ]}
          />

          <Question
            label="Onde você mora?"
            value={answers.home}
            set={(value) =>
              setAnswers({
                ...answers,
                home: value,
              })
            }
            options={[
              "Apartamento",
              "Casa",
              "Outro",
            ]}
          />

          <Question
            label="Qual porte você prefere?"
            value={answers.size}
            set={(value) =>
              setAnswers({
                ...answers,
                size: value,
              })
            }
            options={[
              "Pequeno",
              "Médio",
              "Grande",
            ]}
          />

          <Question
            label="Você já teve animais antes?"
            value={answers.experience}
            set={(value) =>
              setAnswers({
                ...answers,
                experience: value,
              })
            }
            options={[
              "Sim",
              "Não",
            ]}
          />

          <button
            className="btn btn-primary full"
            disabled={
              !answers.time ||
              !answers.home ||
              !answers.size
            }
            onClick={calculate}
          >
            <Sparkles size={18} />
            Ver compatibilidade
          </button>

        </div>

        {result && (
          <div className="result-box">

            <div className="result-icon">
              <Heart />
            </div>

            <h2>
              Seu perfil combina com
              animais de porte{" "}
              {result.best.toLowerCase()}.
            </h2>

            <p>
              Veja algumas opções
              disponíveis.
            </p>

            <div className="pet-grid">
              {result.candidates.map(
                (pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                  />
                )
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}


function Question({
  label,
  value,
  set,
  options,
}) {
  return (
    <div className="question">

      <label>{label}</label>

      <div className="option-grid">

        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option ${
              value === option
                ? "selected"
                : ""
            }`}
            onClick={() => set(option)}
          >
            {option}
          </button>
        ))}

      </div>

    </div>
  );
}


function Login() {
  const { login } = useAuth();

  const nav = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      await login(
        email,
        password
      );

      nav("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre para acompanhar suas adoções."
    >
      <form
        onSubmit={submit}
        className="form"
      >

        <Field
          label="E-mail"
          type="email"
          value={email}
          set={setEmail}
          required
        />

        <Field
          label="Senha"
          type="password"
          value={password}
          set={setPassword}
          required
        />

        {error && (
          <Alert>{error}</Alert>
        )}

        <button className="btn btn-primary full">
          Entrar
        </button>

        <p className="form-footer">
          Ainda não possui conta?{" "}
          <Link to="/cadastro">
            Criar conta
          </Link>
        </p>

      </form>
    </AuthCard>
  );
}


function Register() {
  const { register } = useAuth();

  const nav = useNavigate();

  const [data, setData] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "adopter",
    });

  const [error, setError] =
    useState("");

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      await register(data);

      nav(
        data.role === "protector"
          ? "/painel"
          : "/"
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Faça parte da rede de adoção responsável."
    >
      <form
        onSubmit={submit}
        className="form"
      >

        <Field
          label="Nome completo"
          value={data.name}
          set={(value) =>
            setData({
              ...data,
              name: value,
            })
          }
          required
        />

        <Field
          label="E-mail"
          type="email"
          value={data.email}
          set={(value) =>
            setData({
              ...data,
              email: value,
            })
          }
          required
        />

        <Field
          label="Telefone"
          type="tel"
          value={data.phone}
          set={(value) =>
            setData({
              ...data,
              phone: value,
            })
          }
          placeholder="(31) 99999-9999"
          required
        />

        <Field
          label="Senha"
          type="password"
          value={data.password}
          set={(value) =>
            setData({
              ...data,
              password: value,
            })
          }
          minLength="6"
          required
        />

        <div className="role-choice">

          <button
            type="button"
            className={
              data.role === "adopter"
                ? "selected"
                : ""
            }
            onClick={() =>
              setData({
                ...data,
                role: "adopter",
              })
            }
          >
            <UserRound />
            Quero adotar
          </button>

          <button
            type="button"
            className={
              data.role === "protector"
                ? "selected"
                : ""
            }
            onClick={() =>
              setData({
                ...data,
                role: "protector",
              })
            }
          >
            <PawPrint />
            Sou ONG / Protetor
          </button>

        </div>

        {error && (
          <Alert>{error}</Alert>
        )}

        <button className="btn btn-primary full">
          Criar conta
        </button>

        <p className="form-footer">
          Já possui conta?{" "}
          <Link to="/login">
            Entrar
          </Link>
        </p>

      </form>
    </AuthCard>
  );
}


function AuthCard({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <span className="brand-icon">
            <PawPrint />
          </span>
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>

        {children}

      </div>
    </section>
  );
}


function Field({
  label,
  type = "text",
  value,
  set,
  ...rest
}) {
  return (
    <label className="field">

      <span>{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          set(event.target.value)
        }
        {...rest}
      />

    </label>
  );
}


function Alert({ children }) {
  return (
    <div className="alert">
      {children}
    </div>
  );
}


function Dashboard() {
  const { user } = useAuth();

  const nav = useNavigate();

  const [pets, setPets] =
    useState(getPets());

  const [requests, setRequests] =
    useState(getRequests());

  const [form, setForm] =
    useState({
      name: "",
      species: "Cachorro",
      sex: "Macho",
      age: "1",
      size: "Médio",
      city: "Belo Horizonte",
      description: "",
      image:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85",
      vaccinated: true,
      neutered: false,
    });

  /*
   * Usuários cadastrados localmente.
   *
   * Isso é usado para recuperar o telefone
   * diretamente da conta do adotante.
   *
   * Dessa forma, solicitações antigas,
   * criadas antes do campo telefone existir,
   * também conseguem exibir o telefone.
   */
  const users = JSON.parse(
    localStorage.getItem(
      "adotapet_users"
    ) || "[]"
  );

  if (!user) {
    nav("/login");

    return null;
  }

  if (user.role !== "protector") {
    return (
      <section className="section page-section">
        <div className="container narrow">
          <Empty
            title="Área restrita"
            text="Faça login como ONG/protetor para acessar este painel."
          />
        </div>
      </section>
    );
  }

  const addPet = (event) => {
    event.preventDefault();

    const newPet = {
      ...form,
      id: crypto.randomUUID(),
      age: Number(form.age),
      status: "Disponível",
    };

    const next = [
      ...pets,
      newPet,
    ];

    savePets(next);

    setPets(next);

    setForm({
      ...form,
      name: "",
      description: "",
    });
  };


  const removePet = (id) => {
    const next =
      pets.filter(
        (pet) => pet.id !== id
      );

    savePets(next);

    setPets(next);
  };


  const updateRequest = (
    requestId,
    status
  ) => {
    const currentRequests =
      getRequests();

    const request =
      currentRequests.find(
        (item) =>
          item.id === requestId
      );

    if (!request) {
      return;
    }

    /*
     * Quando a ONG aprova a adoção,
     * o animal passa automaticamente
     * para o status "Adotado".
     */
    if (status === "Aprovada") {
      const currentPets =
        getPets();

      const pet =
        currentPets.find(
          (item) =>
            item.id === request.petId
        );

      if (pet) {
        const updatedPets =
          currentPets.map((item) =>
            item.id === pet.id
              ? {
                  ...item,
                  status: "Adotado",
                }
              : item
          );

        savePets(updatedPets);

        setPets(updatedPets);
      }

      /*
       * Se existirem outras solicitações
       * pendentes para o mesmo animal,
       * elas serão recusadas automaticamente.
       */
      const updatedRequests =
        currentRequests.map((item) => {
          if (
            item.id === requestId
          ) {
            return {
              ...item,
              status: "Aprovada",
            };
          }

          if (
            item.petId === request.petId &&
            item.status === "Pendente"
          ) {
            return {
              ...item,
              status: "Recusada",
              reason:
                "O animal foi adotado por outro solicitante.",
            };
          }

          return item;
        });

      saveRequests(
        updatedRequests
      );

      setRequests(
        updatedRequests
      );

      return;
    }

    const updatedRequests =
      currentRequests.map(
        (item) =>
          item.id === requestId
            ? {
                ...item,
                status,
              }
            : item
      );

    saveRequests(
      updatedRequests
    );

    setRequests(
      updatedRequests
    );
  };


  const available =
    pets.filter(
      (pet) =>
        pet.status ===
        "Disponível"
    ).length;


  return (
    <section className="section page-section">
      <div className="container">

        <div className="dashboard-head">

          <div>
            <span className="eyebrow">
              Área administrativa
            </span>

            <h1>
              Painel do protetor
            </h1>

            <p>
              Olá, {user.name}.
              Gerencie animais e
              solicitações.
            </p>
          </div>

          <Link
            className="btn btn-light"
            to="/animais"
          >
            Ver plataforma
          </Link>

        </div>


        <div className="stats">

          <Stat
            icon={<PawPrint />}
            value={pets.length}
            label="Animais cadastrados"
          />

          <Stat
            icon={<Heart />}
            value={available}
            label="Disponíveis"
          />

          <Stat
            icon={<Clock3 />}
            value={
              requests.filter(
                (request) =>
                  request.status ===
                  "Pendente"
              ).length
            }
            label="Solicitações pendentes"
          />

        </div>


        <div className="dashboard-grid">

          <div className="panel">

            <div className="panel-head">
              <h2>
                <Plus size={20} />
                Cadastrar animal
              </h2>
            </div>

            <form
              onSubmit={addPet}
              className="form compact"
            >

              <div className="two">

                <Field
                  label="Nome"
                  value={form.name}
                  set={(value) =>
                    setForm({
                      ...form,
                      name: value,
                    })
                  }
                  required
                />

                <Field
                  label="Idade"
                  type="number"
                  min="0"
                  value={form.age}
                  set={(value) =>
                    setForm({
                      ...form,
                      age: value,
                    })
                  }
                  required
                />

              </div>


              <div className="two">

                <label className="field">
                  <span>Espécie</span>

                  <select
                    value={form.species}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        species:
                          event.target.value,
                      })
                    }
                  >
                    <option>
                      Cachorro
                    </option>

                    <option>
                      Gato
                    </option>
                  </select>
                </label>


                <label className="field">
                  <span>Sexo</span>

                  <select
                    value={form.sex}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        sex:
                          event.target.value,
                      })
                    }
                  >
                    <option>
                      Macho
                    </option>

                    <option>
                      Fêmea
                    </option>
                  </select>
                </label>

              </div>


              <label className="field">
                <span>Porte</span>

                <select
                  value={form.size}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      size:
                        event.target.value,
                    })
                  }
                >
                  <option>
                    Pequeno
                  </option>

                  <option>
                    Médio
                  </option>

                  <option>
                    Grande
                  </option>
                </select>
              </label>


              <Field
                label="Cidade"
                value={form.city}
                set={(value) =>
                  setForm({
                    ...form,
                    city: value,
                  })
                }
                required
              />


              <Field
                label="URL da foto"
                value={form.image}
                set={(value) =>
                  setForm({
                    ...form,
                    image: value,
                  })
                }
              />


              <label className="field">
                <span>
                  Descrição
                </span>

                <textarea
                  rows="4"
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  required
                />
              </label>


              <button className="btn btn-primary full">
                <Plus size={18} />
                Cadastrar animal
              </button>

            </form>
          </div>


          <div className="panel">

            <div className="panel-head">
              <h2>
                <PawPrint size={20} />
                Animais cadastrados
              </h2>
            </div>

            <div className="admin-list">

              {pets.map((pet) => (
                <div
                  className="admin-item"
                  key={pet.id}
                >

                  <img
                    src={pet.image}
                    alt=""
                  />

                  <div>

                    <strong>
                      {pet.name}
                    </strong>

                    <small>
                      {pet.species} ·{" "}
                      {pet.city}
                    </small>

                    <span
                      className={`mini-status ${
                        pet.status ===
                        "Disponível"
                          ? "ok"
                          : ""
                      }`}
                    >
                      {pet.status ===
                      "Adotado"
                        ? "Indisponível"
                        : pet.status}
                    </span>

                  </div>

                  <button
                    className="icon-btn danger"
                    onClick={() =>
                      removePet(
                        pet.id
                      )
                    }
                    title="Excluir"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>
              ))}

            </div>
          </div>

        </div>


        <div className="panel requests-panel">

          <div className="panel-head">
            <h2>
              <ClipboardCheck size={20} />
              Solicitações de adoção
            </h2>
          </div>

          {requests.length === 0 ? (
            <Empty
              title="Nenhuma solicitação"
              text="Quando alguém solicitar uma adoção, ela aparecerá aqui."
            />
          ) : (
            <div className="request-list">

              {requests.map((request) => {

                /*
                 * Procura a conta do adotante
                 * usando o userId salvo na solicitação.
                 */
                const requester =
                  users.find(
                    (item) =>
                      item.id ===
                      request.userId
                  );

                /*
                 * Primeiro tenta usar o telefone
                 * salvo na própria solicitação.
                 *
                 * Se não existir, pega diretamente
                 * da conta do usuário.
                 *
                 * Isso resolve também solicitações
                 * antigas.
                 */
                const phone =
                  request.userPhone ||
                  requester?.phone ||
                  "Não informado";

                const email =
                  request.userEmail ||
                  requester?.email ||
                  "Não informado";

                return (
                  <div
                    className="request-item"
                    key={request.id}
                  >

                    <div>

                      <strong>
                        {request.userName}
                        {" → "}
                        {request.petName}
                      </strong>

                      <small>
                        {request.date}
                        {" · "}
                        {request.status}
                      </small>

                      <p>
                        {request.message ||
                          "Sem mensagem."}
                      </p>

                      <div
                        style={{
                          marginTop:
                            "8px",
                        }}
                      >

                        <small>
                          <strong>
                            E-mail:
                          </strong>{" "}
                          {email}
                        </small>

                        <br />

                        <small>
                          <strong>
                            Telefone:
                          </strong>{" "}
                          {phone}
                        </small>

                      </div>

                      {request.reason && (
                        <small>
                          {request.reason}
                        </small>
                      )}

                    </div>


                    <div className="request-actions">

                      {request.status ===
                        "Pendente" && (
                        <>
                          <button
                            className="btn btn-small btn-success"
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "Aprovada"
                              )
                            }
                          >
                            <CheckCircle2
                              size={15}
                            />

                            Aprovar
                          </button>

                          <button
                            className="btn btn-small btn-danger"
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "Recusada"
                              )
                            }
                          >
                            <CircleX
                              size={15}
                            />

                            Recusar
                          </button>
                        </>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </section>
  );
}


function Stat({
  icon,
  value,
  label,
}) {
  return (
    <div className="stat">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

    </div>
  );
}


function Favorites() {
  const ids = getFavorites();

  const pets = getPets().filter(
    (pet) =>
      ids.includes(pet.id)
  );

  return (
    <section className="section page-section">
      <div className="container">

        <div className="page-heading">
          <span className="eyebrow">
            Seus favoritos
          </span>

          <h1>
            Animais salvos
          </h1>
        </div>

        <div className="pet-grid">

          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
            />
          ))}

        </div>

        {!pets.length && (
          <Empty
            title="Você ainda não favoritou animais"
            text="Clique no coração dos animais que deseja acompanhar."
          />
        )}

      </div>
    </section>
  );
}


function Empty({
  title,
  text,
}) {
  return (
    <div className="empty">

      <PawPrint size={34} />

      <h2>{title}</h2>

      <p>{text}</p>

    </div>
  );
}


function NotFound() {
  return (
    <section className="section page-section">
      <div className="container narrow">

        <Empty
          title="Página não encontrada"
          text="A página que você procurou não existe."
        />

      </div>
    </section>
  );
}


export default App;