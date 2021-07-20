import { useContext } from "react";
import { destroyCookie } from "nookies";
import { withSSRAuth } from "../utils/withSSRAuth";
import { setupAPIClient } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { Can } from "../components/Can";
import { useCan } from "../hooks/useCan";

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);
  
  const userCanSeeMetrics = useCan({
    roles: ['editor', 'administrator']
  });

  return (
    <>
      <h1>Dashboard {user?.email}</h1>

      <button onClick={signOut}>Sign Out</button>

      <Can roles={['administrator']}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  console.log(response);

  return {
    props: {}
  }
})