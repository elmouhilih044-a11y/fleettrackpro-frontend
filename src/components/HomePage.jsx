function HomePage({ user }) {
  return (
    <>
      <h2>Accueil</h2>
      <p>
        Bienvenue {user.firstName} {user.lastName}, vous êtes connecté en tant que{" "}
        {user.role === "admin" ? "Admin" : "Chauffeur"}.
      </p>
      <p>Email : {user.email}</p>
    </>
  )
}

export default HomePage