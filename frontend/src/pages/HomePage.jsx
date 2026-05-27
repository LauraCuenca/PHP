import { useEffect, useState } from "react";
import { testApi } from "../services/apiServices";

export default function Home() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadApi = async () => {
      try {
        const res = await testApi();
        console.log(res.data);
        setMessage(res.data);
      } catch (error) {
        console.log("Error API:", error.message);
      }
    };

    loadApi();
  }, []);

  return (
    <div>
      <h1>Home</h1>

      <p>Estado del backend:</p>

      <h3>{message}</h3>
    </div>
  );
}