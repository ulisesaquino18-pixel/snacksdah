"use client";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./Dashboard"), { 
  ssr: false,
  loading: () => (
    <div style={{background:"#0F1923",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#D4A843",fontSize:14,fontWeight:700}}>Cargando Snacks Depot® Dashboard...</div>
    </div>
  )
});

export default function Page() {
  return <Dashboard />;
}
