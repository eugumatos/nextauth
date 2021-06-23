import { useContext } from "react";
import { withSSRAuth } from "../utils/withSSRAuth";
import { setupAPIClient } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <h1>Dashboard {user?.email}</h1>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me');

  console.log(response.data);

  return {
    props: {}
  }
})