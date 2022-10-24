import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {
  const { data: session } = useSession();
  //utilizando hook do next-auth para pegar o usuário logado, com a variável session

  return session ? (
    <button 
      type="button" 
      className={styles.signInButton}
      onClick={() => signOut()}
      //utilizando o signOut do next-auth para fazer o logout
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}//passando função de singIn para login no github, e o nome do provider
    >
      <FaGithub color="#eba417" />
      Sign in with GitHub
    </button>
  );
}
