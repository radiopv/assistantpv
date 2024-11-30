import { Navigate } from "react-router-dom";

const Index = () => {
  // Always redirect to the public home page
  return <Navigate to="/" />;
};

export default Index;